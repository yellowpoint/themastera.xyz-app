const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
require('dotenv').config()

function parseArgs() {
  const args = process.argv.slice(2)
  const getVal = (keys) => {
    for (let i = 0; i < args.length; i++) {
      if (keys.includes(args[i])) return args[i + 1]
    }
    return undefined
  }
  const file = getVal(['--file', '--path'])
  const dryRun = args.includes('--dry-run')
  const gzip = args.includes('--gzip') || (file && file.endsWith('.gz'))
  return { file, dryRun, gzip }
}

function detectProvider() {
  const schemaPath = path.resolve(process.cwd(), 'prisma', 'schema.prisma')
  let provider
  let sqliteTarget
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    const pv = schema.match(
      /datasource\s+db\s*\{[\s\S]*?provider\s*=\s*"(.*?)"/
    )
    if (pv) provider = pv[1]
    if (provider === 'sqlite') {
      const um = schema.match(/url\s*=\s*"file:(.*?)"/)
      const rel = um && um[1] ? um[1] : './dev.db'
      sqliteTarget = path.resolve(path.dirname(schemaPath), rel)
    }
  }
  const url = process.env.DATABASE_URL
  if (!provider && url) {
    const low = url.toLowerCase()
    if (low.startsWith('postgres') || low.startsWith('postgresql'))
      provider = 'postgresql'
    else if (low.startsWith('file:') || low.startsWith('sqlite'))
      provider = 'sqlite'
  }
  return { provider, sqliteTarget, url: process.env.DATABASE_URL }
}

async function restoreSqlite(file, target, gzip) {
  if (!file) throw new Error('Missing --file for SQLite restore')
  if (!fs.existsSync(file)) throw new Error(`Backup file not found: ${file}`)
  const dir = path.dirname(target)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (gzip) {
    const zlib = require('zlib')
    await new Promise((resolve, reject) => {
      const inS = fs.createReadStream(file)
      const outS = fs.createWriteStream(target)
      const gunzip = zlib.createGunzip()
      inS.on('error', reject)
      outS.on('error', reject)
      outS.on('finish', resolve)
      inS.pipe(gunzip).pipe(outS)
    })
  } else {
    fs.copyFileSync(file, target)
  }
}

function parseDatabaseUrl(u) {
  try {
    const url = new URL(u)
    const db = url.pathname.replace(/^\//, '')
    const pass = url.password || undefined
    return {
      protocol: url.protocol.replace(':', ''),
      host: url.hostname,
      port: url.port ? Number(url.port) : undefined,
      user: url.username || undefined,
      password: pass,
      database: db,
    }
  } catch {
    return {}
  }
}

async function restorePostgres(dbUrl, file, gzip) {
  if (!file) throw new Error('Missing --file for PostgreSQL restore')
  if (!fs.existsSync(file)) throw new Error(`Backup file not found: ${file}`)
  const info = parseDatabaseUrl(dbUrl)
  const args = []
  if (info.host) args.push('-h', info.host)
  if (info.port) args.push('-p', String(info.port))
  if (info.user) args.push('-U', info.user)
  if (info.database) args.push('-d', info.database)
  return new Promise((resolve, reject) => {
    const child = spawn('psql', args, {
      env: { ...process.env, PGPASSWORD: info.password || '' },
    })
    const inS = fs.createReadStream(file)
    const z = gzip ? require('zlib').createGunzip() : null
    let stderr = ''
    child.stderr.on('data', (d) => (stderr += String(d)))
    child.on('error', reject)
    if (z) inS.pipe(z).pipe(child.stdin)
    else inS.pipe(child.stdin)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(stderr || `psql exited with code ${code}`))
    })
  })
}

async function main() {
  const { file, dryRun, gzip } = parseArgs()
  const { provider, sqliteTarget, url } = detectProvider()
  if (dryRun) {
    console.log(
      JSON.stringify({ provider, sqliteTarget, url, file, gzip }, null, 2)
    )
    process.exit(0)
  }
  if (!provider) throw new Error('Cannot detect database provider')
  if (provider === 'sqlite') {
    await restoreSqlite(
      file,
      sqliteTarget || path.resolve(process.cwd(), 'prisma', 'dev.db'),
      gzip
    )
  } else if (provider === 'postgresql') {
    if (!url) throw new Error('DATABASE_URL is required for PostgreSQL')
    await restorePostgres(url, file, gzip)
  } else {
    throw new Error(`Unsupported provider: ${provider}`)
  }
  console.log('OK')
}

main().catch((e) => {
  console.error(String(e && e.message ? e.message : e))
  process.exit(1)
})

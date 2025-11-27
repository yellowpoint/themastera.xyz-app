const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
require('dotenv').config()

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
}

function timestamp() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`
}

function parseArgs() {
  const args = process.argv.slice(2)
  const getVal = (keys) => {
    for (let i = 0; i < args.length; i++) {
      if (keys.includes(args[i])) return args[i + 1]
    }
    return undefined
  }
  const out = getVal(['--out', '--output'])
  const name = getVal(['--name'])
  const dryRun = args.includes('--dry-run')
  const gzip = args.includes('--gzip') || args.includes('--gz')
  return { out, name, dryRun, gzip }
}

function detectProvider() {
  const schemaPath = path.resolve(process.cwd(), 'prisma', 'schema.prisma')
  let provider
  let sqliteFile
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    const pv = schema.match(
      /datasource\s+db\s*\{[\s\S]*?provider\s*=\s*"(.*?)"/
    )
    if (pv) provider = pv[1]
    if (provider === 'sqlite') {
      const um = schema.match(/url\s*=\s*"file:(.*?)"/)
      const rel = um && um[1] ? um[1] : './dev.db'
      sqliteFile = path.resolve(path.dirname(schemaPath), rel)
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
  return { provider, sqliteFile, url: process.env.DATABASE_URL }
}

function buildOutPath(baseDir, baseName, gzip, provider) {
  ensureDir(baseDir)
  const ext = provider === 'sqlite' ? '.db' : '.sql'
  const name = `${baseName}-${timestamp()}${gzip ? `${ext}.gz` : ext}`
  return path.join(baseDir, name)
}

async function backupSqlite(sqliteFile, outPath, gzip) {
  if (!fs.existsSync(sqliteFile))
    throw new Error(`SQLite file not found: ${sqliteFile}`)
  if (gzip) {
    const zlib = require('zlib')
    await new Promise((resolve, reject) => {
      const inS = fs.createReadStream(sqliteFile)
      const outS = fs.createWriteStream(outPath)
      const gz = zlib.createGzip()
      inS.on('error', reject)
      outS.on('error', reject)
      outS.on('finish', resolve)
      inS.pipe(gz).pipe(outS)
    })
  } else {
    fs.copyFileSync(sqliteFile, outPath)
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

async function backupPostgres(dbUrl, outPath, gzip) {
  const info = parseDatabaseUrl(dbUrl)
  const args = []
  if (info.host) args.push('-h', info.host)
  if (info.port) args.push('-p', String(info.port))
  if (info.user) args.push('-U', info.user)
  if (info.database) args.push('-d', info.database)
  return new Promise((resolve, reject) => {
    const child = spawn('pg_dump', args, {
      env: { ...process.env, PGPASSWORD: info.password || '' },
    })
    const fileS = fs.createWriteStream(outPath)
    const gz = gzip ? require('zlib').createGzip() : null
    let stderr = ''
    child.stderr.on('data', (d) => (stderr += String(d)))
    child.on('error', reject)
    if (gz) child.stdout.pipe(gz).pipe(fileS)
    else child.stdout.pipe(fileS)
    fileS.on('finish', resolve)
    child.on('close', (code) => {
      if (code !== 0)
        reject(new Error(stderr || `pg_dump exited with code ${code}`))
    })
  })
}

async function main() {
  const { out, name, dryRun, gzip } = parseArgs()
  const { provider, sqliteFile, url } = detectProvider()
  const baseDir = out
    ? path.resolve(process.cwd(), out)
    : path.resolve(process.cwd(), 'backups')
  const baseName = name || provider || 'db'
  const outPath = buildOutPath(baseDir, baseName, gzip, provider || 'db')
  if (dryRun) {
    console.log(
      JSON.stringify({ provider, sqliteFile, url, outPath, gzip }, null, 2)
    )
    process.exit(0)
  }
  if (!provider) throw new Error('Cannot detect database provider')
  if (provider === 'sqlite') {
    await backupSqlite(
      sqliteFile || path.resolve(process.cwd(), 'prisma', 'dev.db'),
      outPath,
      gzip
    )
  } else if (provider === 'postgresql') {
    if (!url) throw new Error('DATABASE_URL is required for PostgreSQL')
    await backupPostgres(url, outPath, gzip)
  } else {
    throw new Error(`Unsupported provider: ${provider}`)
  }
  console.log(outPath)
}

main().catch((e) => {
  console.error(String(e && e.message ? e.message : e))
  process.exit(1)
})

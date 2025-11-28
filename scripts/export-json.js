const fs = require('fs')
const path = require('path')
require('dotenv').config()
const { PrismaClient, Prisma } = require('@prisma/client')

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
  const envArg = getVal(['--env'])
  return { out, name, dryRun, envArg }
}

function buildOutPath(baseDir, baseName) {
  ensureDir(baseDir)
  const file = `${baseName}-${timestamp()}.json`
  return path.join(baseDir, file)
}

function lowerFirst(s) {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : s
}

function detectProvider() {
  const schemaPath = path.resolve(process.cwd(), 'prisma', 'schema.prisma')
  let provider
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    const pv = schema.match(
      /datasource\s+db\s*\{[\s\S]*?provider\s*=\s*"(.*?)"/
    )
    if (pv) provider = pv[1]
  }
  const url = process.env.DATABASE_URL
  if (!provider && url) {
    const low = url.toLowerCase()
    if (low.startsWith('postgres') || low.startsWith('postgresql'))
      provider = 'postgresql'
    else if (low.startsWith('file:') || low.startsWith('sqlite'))
      provider = 'sqlite'
  }
  return { provider, url }
}

function detectEnv(envArg) {
  if (envArg === 'dev' || envArg === 'local') return 'local'
  if (envArg === 'prod' || envArg === 'production') return 'prod'
  const { provider, url } = detectProvider()
  if (provider === 'sqlite') return 'local'
  if (provider === 'postgresql' && url) {
    try {
      const u = new URL(url)
      const host = u.hostname || ''
      if (['localhost', '127.0.0.1'].includes(host)) return 'local'
      return 'prod'
    } catch {}
  }
  return 'local'
}

async function main() {
  const { out, name, dryRun, envArg } = parseArgs()
  const envName = detectEnv(envArg)
  if (envName === 'local') await exportLocalJSON({ out, name, dryRun })
  else await exportProdJSON({ out, name, dryRun })
}

main().catch((e) => {
  console.error(String(e && e.message ? e.message : e))
  process.exit(1)
})

async function exportJSON(envName, { out, name, dryRun }) {
  const baseDir = out
    ? path.resolve(process.cwd(), out)
    : path.resolve(process.cwd(), 'backups/json', envName)
  const baseName = name || 'db'
  const outPath = buildOutPath(baseDir, baseName)
  const prisma = new PrismaClient()
  try {
    const modelNames =
      Prisma && Prisma.ModelName
        ? Object.values(Prisma.ModelName)
        : Object.keys(prisma)
            .filter(
              (k) => prisma[k] && typeof prisma[k].findMany === 'function'
            )
            .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
    const data = {}
    for (const modelName of modelNames) {
      const delegateName = lowerFirst(modelName)
      const delegate = prisma[delegateName]
      if (!delegate || typeof delegate.findMany !== 'function') continue
      const rows = await delegate.findMany()
      data[modelName] = rows
    }
    const payload = {
      _meta: {
        exportedAt: new Date().toISOString(),
        env: envName,
      },
      ...data,
    }
    if (dryRun) {
      console.log(JSON.stringify(Object.keys(data), null, 2))
      return
    }
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2))
    console.log(outPath)
  } finally {
    await prisma.$disconnect()
  }
}

async function exportLocalJSON(opts) {
  return exportJSON('local', opts)
}

async function exportProdJSON(opts) {
  return exportJSON('prod', opts)
}

module.exports = { exportLocalJSON, exportProdJSON }

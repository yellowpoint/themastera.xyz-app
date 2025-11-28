const fs = require('fs')
const path = require('path')
require('dotenv').config()
const { PrismaClient, Prisma } = require('@prisma/client')

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
  const truncate = args.includes('--truncate') || args.includes('--wipe')
  const batchSize = Number(getVal(['--batch'])) || 1000
  const envArg = getVal(['--env'])
  const allowProd = args.includes('--allow-prod')
  return { file, dryRun, truncate, batchSize, envArg, allowProd }
}

function lowerFirst(s) {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : s
}

function orderedModels() {
  return [
    'User',
    'Verification',
    'Work',
    'Playlist',
    'Session',
    'Account',
    'Follow',
    'Purchase',
    'Review',
    'WorkLike',
    'WorkDislike',
    'PlaylistEntry',
    'WatchHistory',
  ]
}

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function pickScalarFields(model, item) {
  const scalarFields = model.fields
    .filter((f) => f.kind === 'scalar')
    .map((f) => f.name)
  const out = {}
  for (const k of scalarFields) {
    if (Object.prototype.hasOwnProperty.call(item, k)) out[k] = item[k]
  }
  for (const f of model.fields) {
    if (f.kind === 'scalar' && f.type === 'DateTime' && out[f.name])
      out[f.name] = new Date(out[f.name])
  }
  return out
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
  const { file, dryRun, truncate, batchSize, envArg, allowProd } = parseArgs()
  if (!file) throw new Error('Missing --file')
  if (!fs.existsSync(file)) throw new Error(`File not found: ${file}`)
  const raw = fs.readFileSync(file, 'utf-8')
  const json = JSON.parse(raw)
  const envName = detectEnv(envArg)
  if (envName === 'local')
    await importLocalJSON({ file, dryRun, truncate, batchSize })
  else await importProdJSON({ file, dryRun, truncate, batchSize, allowProd })
}

main().catch((e) => {
  console.error(String(e && e.message ? e.message : e))
  process.exit(1)
})

async function importJSON({ file, dryRun, truncate, batchSize }) {
  const raw = fs.readFileSync(file, 'utf-8')
  const json = JSON.parse(raw)
  const prisma = new PrismaClient()
  try {
    const order = orderedModels()
    const dataset = {}
    for (const name of order) {
      const arr = Array.isArray(json[name])
        ? json[name]
        : Array.isArray(json[name?.toLowerCase()])
          ? json[name.toLowerCase()]
          : []
      dataset[name] = arr
    }
    if (dryRun) {
      const info = {}
      for (const name of order) info[name] = dataset[name]?.length || 0
      console.log(JSON.stringify(info, null, 2))
      return
    }
    if (truncate) {
      const reverse = [...order].reverse()
      for (const name of reverse) {
        const delegate = prisma[lowerFirst(name)]
        await delegate.deleteMany()
      }
    }
    for (const name of order) {
      const items = dataset[name] || []
      if (!items.length) continue
      const rows = items.map((it) => it)
      const delegate = prisma[lowerFirst(name)]
      const batches = chunk(rows, batchSize)
      for (const b of batches) {
        await delegate.createMany({ data: b, skipDuplicates: true })
      }
    }
    console.log('OK')
  } finally {
    await prisma.$disconnect()
  }
}

async function importLocalJSON(opts) {
  return importJSON(opts)
}

async function importProdJSON(opts) {
  if (!opts.allowProd)
    throw new Error('Refusing to import into production without --allow-prod')
  return importJSON(opts)
}

module.exports = { importLocalJSON, importProdJSON }

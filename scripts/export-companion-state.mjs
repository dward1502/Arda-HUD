import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const out = process.argv[2] ?? '../citadel-companion/public/generated/arda-presence-knowledge.json'
const passthroughArgs = process.argv.slice(3)
const tmp = mkdtempSync(join(tmpdir(), 'arda-companion-export-'))
const bundle = join(tmp, 'exportCompanionState.mjs')

const build = spawnSync('npm', [
  'exec',
  'esbuild',
  '--',
  'scripts/exportCompanionState.ts',
  '--bundle',
  '--platform=node',
  '--format=esm',
  `--outfile=${bundle}`,
  '--log-level=warning',
], { stdio: 'inherit' })

if (build.status !== 0) {
  rmSync(tmp, { recursive: true, force: true })
  process.exit(build.status ?? 1)
}

const run = spawnSync(process.execPath, [bundle, out, ...passthroughArgs], { stdio: 'inherit' })
rmSync(tmp, { recursive: true, force: true })
process.exit(run.status ?? 1)

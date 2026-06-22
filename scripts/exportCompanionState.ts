// sigil: REPAIR
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import {
  deriveLatestPresenceStateFromEventLedger,
  derivePresenceStateFromArdaPresence,
} from '../src/scene/systems/presenceState'
import { toCitadelCompanionPayload } from '../src/scene/systems/companionDisplayState'
import { COMPANION_HANDOFF_KNOWLEDGE_EVENT } from '../src/scene/systems/companionHandoffFixture'

function argumentValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag)
  if (index < 0) return undefined
  return process.argv[index + 1]
}

const outputPath = resolve(process.argv[2] ?? '../citadel-companion/public/generated/arda-presence-knowledge.json')
const ledgerPath = argumentValue('--ledger')
const fallbackTimestamp = argumentValue('--fallback-timestamp') ?? new Date().toISOString()
const presenceState = ledgerPath && existsSync(resolve(ledgerPath))
  ? deriveLatestPresenceStateFromEventLedger(readFileSync(resolve(ledgerPath), 'utf8'), fallbackTimestamp)
  : derivePresenceStateFromArdaPresence(COMPANION_HANDOFF_KNOWLEDGE_EVENT)
const payload = toCitadelCompanionPayload({
  ...presenceState,
  inquiry: presenceState.inquiry ?? 'Review synthesized candidate clusters',
  action: presenceState.action ?? 'Open the review packet before queue mutation',
}, fallbackTimestamp)

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
console.log(outputPath)

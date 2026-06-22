// sigil: REPAIR
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  Activity,
  BookOpenText,
  Bot,
  Briefcase,
  FolderKanban,
  HeartHandshake,
  Shield,
  Sparkles,
  TerminalSquare,
  UserRound,
  X,
  Minus,
  Maximize2,
} from 'lucide-react'
import {
  BusinessModule,
  ExecutiveOverviewModule,
  HermesDashboardModule,
  HumanRealmModule,
  LineList,
  LearningLoopSurfaceWrapper,
  MediaLibraryModule,
  MetricPill,
  ModuleCard,
  OperatingSurfacePlanModule,
  OperationsActionContractPanel,
  PanelWorkspace,
  PlanningActionContractPanel,
  RuntimeModeBadge,
  SceneWorkstation,
  SceneTransitionOverlay,
  PersonalGrowthModule,
  QueueProvenancePanel,
  ReviewGateWorkstation,
  ServiceEmbedModule,
  SettingsModule,
  SectionFocusModule,
  SourceCoverageBadge,
  SystemsModule,
  WorldTerminalActionContractPanel,
  buildReviewGateDecisionRecordPreview,
  type ModuleId,
  type CommandConsoleSurface,
  type OperatingSurfaceLaneReport,
  type OperatorCockpitSurface,
  type ThemeId,
  type ThemeOption,
  type ViewMode,
  type ArandurQueueWriteRequest,
  type ReviewGateItem,
  type SourceCoverageBadgeState,
} from './components/arda'
import BoardroomViewport from './scene/boardroom/BoardroomViewport'
import { deriveBoardroomHudInstruments } from './scene/boardroom/boardroomHudInstruments'
import WorldRuntimeViewport from './scene/world/WorldViewport'
import { calculateWorldDistrictUrgencies } from './scene/world/worldDistrictUrgency'
import {
  getSceneSlotWorkstationManifestById,
  getSceneSlotWorkstationManifestByZoneId,
} from './scene/workstations/sceneSlotWorkstationTemplates'
import {
  createCoreStateSource,
  type ArdaBundle,
  type ArdaSceneZone,
  type ArdaSection,
  type ArdaWorkstationManifest,
  type JsonRecord,
} from './lib/ardaSource'
import { detectArdaRuntimeMode } from './lib/ardaRuntimeMode'
import {
  getSurfaceAdapterManifest,
  getSurfaceAdapterWorkstationManifests,
} from './lib/surfaceAdapterManifests'
import { resolveAgentSigilFromContract, primarySigilForSource } from './lib/soterionRender'
import {
  executeSystemAction,
  getSystemActionCapabilityStatuses,
  getSystemActionDescriptors,
  type SystemActionId,
} from './lib/systemActionBus'
import {
  getStoredWorkstationState,
  initWindowBridge,
  syncWorkstationState,
  windowManager,
  type WorkstationBridgeState,
} from './utils/multiWindow'
import type { RoutableProviderEntry, RoutableProviderModel } from './components/arda/modules/systems/RoutableProvidersPanel'
import { useArdaActionAdapters } from './components/arda/hooks/useArdaActionAdapters'
import { useArdaBundle } from './components/arda/hooks/useArdaBundle'
import { useArdaRuntimePulse } from './components/arda/hooks/useArdaRuntimePulse'
import { useArdaWindowControls } from './components/arda/hooks/useArdaWindowControls'
import { useBoardroomSlotAssignments } from './components/arda/hooks/useBoardroomSlotAssignments'
import { useCharonLiveSnapshot } from './components/arda/hooks/useCharonLiveSnapshot'
import { useWorldSurfaceAssignments } from './components/arda/hooks/useWorldSurfaceAssignments'
import {
  BOARDROOM_MONITOR_SLOT_IDS,
  BOARDROOM_SCENE_SLOT_IDS,
} from './lib/boardroomSlotSettings'
import {
  WORLD_SCENE_SURFACE_IDS,
  WORLD_TERMINAL_SURFACE_IDS,
  type WorldSceneSurfaceId,
} from './lib/worldSurfaceSettings'
import type { SceneAnchorDefinition, SceneZoneDefinition } from './scene/systems/runtimeTypes'

const THEMES: ThemeOption[] = [
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'gibson2', label: 'Gibson 2.0' },
  { id: 'eva', label: 'EVA' },
]

const source = createCoreStateSource()
const runtimeModeStatus = detectArdaRuntimeMode()
const MODULE_STORAGE_KEY = 'arda.module.order.v1'
const DEFAULT_MODULE_ORDER: ModuleId[] = [
  'operating_surface',
  'executive_overview',
  'section_focus',
  'human_realm',
  'systems',
  'governance_controls',
  'operations_and_packages',
  'hermes_dashboard',
  'planning',
  'learning_loop',
  'business',
  'personal_growth',
  'culture_and_art',
  'service_embed',
  'media_library',
  'settings',
]
const PANEL_LAYOUTS: Record<string, ModuleId[]> = {
  sovereign_world: ['operating_surface', 'executive_overview', 'systems'],
  now_command: ['operating_surface', 'executive_overview', 'governance_controls', 'systems'],
  governance_guardhouse: ['governance_controls', 'operating_surface'],
  decisions: ['governance_controls', 'operating_surface'],
  knowledge_and_reasoning: ['human_realm', 'section_focus'],
  routing_and_comms: ['section_focus', 'operations_and_packages'],
  systems_health: ['systems', 'operations_and_packages'],
  routing_health: ['operations_and_packages', 'governance_controls'],
  hermes_dashboard: ['hermes_dashboard', 'operations_and_packages'],
  lifecycle_execution_economics: ['planning', 'operations_and_packages'],
  memory_and_continuity: ['human_realm', 'section_focus'],
  planning_and_queue: ['planning', 'learning_loop', 'operations_and_packages', 'section_focus'],
  business_ops: ['business', 'planning', 'operations_and_packages'],
  evidence_trust: ['operating_surface', 'systems', 'human_realm'],
  personal_growth: ['personal_growth', 'human_realm'],
  culture_and_art: ['culture_and_art', 'human_realm'],
  service_factory_ai: ['service_embed'],
  service_warp_dev: ['service_embed'],
  service_vast_ai_os: ['service_embed'],
  service_beelink_grafana: ['service_embed'],
  service_beelink_openwebui: ['service_embed'],
  media_library: ['media_library', 'service_embed'],
  agent_remote_session: ['service_embed'],
}

type OperatingSurfaceNavKey =
  | 'Now'
  | 'Work'
  | 'Decisions'
  | 'Knowledge'
  | 'Health'
  | 'Business'
  | 'Evidence'
  | 'Settings'

const OPERATING_SURFACE_NAV: Array<{
  lane: OperatingSurfaceNavKey
  panelModeKey: string
  subtitle: string
}> = [
  { lane: 'Now', panelModeKey: 'now_command', subtitle: 'mode, attention, active work' },
  { lane: 'Work', panelModeKey: 'planning_and_queue', subtitle: 'queues, jobs, receipts' },
  { lane: 'Decisions', panelModeKey: 'decisions', subtitle: 'human gates and approvals' },
  { lane: 'Knowledge', panelModeKey: 'knowledge_and_reasoning', subtitle: 'research, memory, citations' },
  { lane: 'Health', panelModeKey: 'systems_health', subtitle: 'fleet, providers, drift' },
  { lane: 'Business', panelModeKey: 'business_ops', subtitle: 'clients, projects, readiness' },
  { lane: 'Evidence', panelModeKey: 'evidence_trust', subtitle: 'sources, audits, provenance' },
  { lane: 'Settings', panelModeKey: 'settings', subtitle: 'setup and configuration' },
]
interface FloatingWorkstationState {
  id: string
  manifestId: string
  sourceZoneId: string
  originAnchorId: string
  title: string
  presentationMode: 'in_scene' | 'native_window'
  x: number
  y: number
  width: number
  height: number
  zIndex: number
}

const FLOATING_WORKSTATION_BASE_Z_INDEX = 320
const FLOATING_WORKSTATION_MARGIN = 28
const FLOATING_WORKSTATION_TILE_GAP = 18

function clampFloatingWorkstationValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

function getFloatingWorkstationViewport() {
  if (typeof window === 'undefined') {
    return { width: 1440, height: 900 }
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

function getFloatingWorkstationTileLayout(index: number, total: number) {
  const viewport = getFloatingWorkstationViewport()
  const safeTotal = Math.max(1, total)
  const margin = FLOATING_WORKSTATION_MARGIN
  const gap = FLOATING_WORKSTATION_TILE_GAP
  const availableWidth = Math.max(360, viewport.width - margin * 2)
  const availableHeight = Math.max(280, viewport.height - margin * 2)

  if (safeTotal === 1) {
    const width = Math.min(940, availableWidth)
    const height = Math.min(680, availableHeight)
    return {
      x: Math.round(margin + (availableWidth - width) / 2),
      y: Math.round(margin + Math.max(0, (availableHeight - height) * 0.28)),
      width,
      height,
    }
  }

  const columns = safeTotal <= 4 ? 2 : Math.min(3, Math.ceil(Math.sqrt(safeTotal)))
  const rows = Math.ceil(safeTotal / columns)
  const tileWidth = Math.floor((availableWidth - gap * (columns - 1)) / columns)
  const tileHeight = Math.floor((availableHeight - gap * (rows - 1)) / rows)
  const row = Math.floor(index / columns)
  const column = index % columns
  const rowItemCount = Math.min(columns, safeTotal - row * columns)
  const rowWidth = rowItemCount * tileWidth + Math.max(0, rowItemCount - 1) * gap
  const rowOffset = Math.max(0, (availableWidth - rowWidth) / 2)

  return {
    x: Math.round(margin + rowOffset + column * (tileWidth + gap)),
    y: Math.round(margin + row * (tileHeight + gap)),
    width: clampFloatingWorkstationValue(tileWidth, 320, availableWidth),
    height: clampFloatingWorkstationValue(tileHeight, 240, availableHeight),
  }
}

function getFloatingWorkstationCenteredLayout() {
  const viewport = getFloatingWorkstationViewport()
  const margin = FLOATING_WORKSTATION_MARGIN
  const availableWidth = Math.max(360, viewport.width - margin * 2)
  const availableHeight = Math.max(280, viewport.height - margin * 2)
  const width = Math.min(940, availableWidth)
  const height = Math.min(680, availableHeight)

  return {
    x: Math.round(margin + Math.max(0, (availableWidth - width) / 2)),
    y: Math.round(margin + Math.max(0, (availableHeight - height) / 2)),
    width,
    height,
  }
}
const BOARDROOM_MONITOR_OPTIONS = [
  { id: 'now_command', label: 'Now' },
  { id: 'planning_and_queue', label: 'Work' },
  { id: 'decisions', label: 'Decisions' },
  { id: 'knowledge_and_reasoning', label: 'Knowledge' },
  { id: 'systems_health', label: 'Health' },
  { id: 'business_ops', label: 'Business' },
  { id: 'evidence_trust', label: 'Evidence' },
  { id: 'settings', label: 'Settings' },
  { id: 'governance_guardhouse', label: 'Guardhouse' },
  { id: 'routing_and_comms', label: 'Routing' },
  { id: 'lifecycle_execution_economics', label: 'Lifecycle' },
  { id: 'personal_growth', label: 'Personal' },
  { id: 'memory_and_continuity', label: 'Memory' },
  { id: 'human_realm', label: 'Human Realm' },
  { id: 'sovereign_world', label: 'Sovereign World' },
  { id: 'service_factory_ai', label: 'Factory AI' },
  { id: 'service_warp_dev', label: 'Warp' },
  { id: 'service_vast_ai_os', label: 'VAST AI OS' },
  { id: 'service_beelink_grafana', label: 'Beelink Grafana' },
  { id: 'service_beelink_openwebui', label: 'Beelink Open WebUI' },
  { id: 'media_library', label: 'Media Library' },
  { id: 'agent_remote_session', label: 'Agent Remote Session' },
] as const
const PANEL_TITLES: Record<string, string> = {
  sovereign_world: 'Sovereign World',
  now_command: 'Now Command Surface',
  governance_guardhouse: 'Governance Guardhouse',
  decisions: 'Decisions',
  knowledge_and_reasoning: 'Knowledge And Reasoning',
  routing_and_comms: 'Routing And Comms',
  systems_health: 'Fleet Systems Health',
  routing_health: 'Routing Health',
  hermes_dashboard: 'Hermes Dashboard',
  lifecycle_execution_economics: 'Lifecycle Execution Economics',
  memory_and_continuity: 'Memory And Continuity',
  planning_and_queue: 'Planning And Queue',
  business_ops: 'Business Operations',
  evidence_trust: 'Evidence And Trust',
  personal_growth: 'Personal Growth',
  culture_and_art: 'Culture And Art',
  service_factory_ai: 'Factory AI Surface',
  service_warp_dev: 'Warp Surface',
  service_vast_ai_os: 'VAST AI OS Surface',
  service_beelink_grafana: 'Beelink Grafana',
  service_beelink_openwebui: 'Beelink Open WebUI',
  media_library: 'ARDA Media Library',
  agent_remote_session: 'Agent Remote Session',
  settings: 'Settings',
}
function asRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as JsonRecord
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function getString(value: unknown, fallback = 'n/a'): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

function getNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function getBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function formatMetric(value: number): string {
  return Number.isInteger(value) ? `${value}` : value.toFixed(2)
}

function getTimestamp(value: JsonRecord): string {
  return getString(
    value.ts_utc ??
      value.created_at_utc ??
      value.completed_at_utc ??
      value.received_at_utc ??
      value.generated_at_utc,
    'not recorded',
  )
}

function formatBytes(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = value
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }
  return `${size >= 10 || unitIndex === 0 ? size.toFixed(0) : size.toFixed(1)} ${units[unitIndex]}`
}

function isDerivedRecord(record: JsonRecord | null): boolean {
  return typeof record?.authority === 'string' && record.authority.startsWith('arda_derived')
}

function provenanceTag(record: JsonRecord | null, label: string): string {
  if (!record) return `${label}: missing`
  return `${label}: ${isDerivedRecord(record) ? 'Derived' : 'Projected'}`
}

function statusTone(status: string): 'gold' | 'cyan' | 'ember' | 'mint' | 'violet' {
  const normalized = status.toLowerCase()
  if (normalized.includes('ready') || normalized.includes('healthy') || normalized.includes('online')) return 'mint'
  if (normalized.includes('attention') || normalized.includes('degraded')) return 'ember'
  if (normalized.includes('offline') || normalized.includes('lock')) return 'violet'
  return 'cyan'
}

function getSectionById(sections: ArdaSection[], activeId: string | null): ArdaSection | null {
  if (!activeId) return sections[0] ?? null
  return sections.find((section) => section.id === activeId) ?? null
}

function sourceCoverageForSections(sections: ArdaSection[]): SourceCoverageBadgeState | undefined {
  if (sections.length === 0) return undefined

  const missingCount = sections.reduce((count, section) => count + (section.missing_projections?.length ?? 0), 0)
  if (missingCount > 0) {
    return { status: 'partial', label: 'source map partial', missingCount }
  }

  return { status: 'backed', label: 'source map backed', missingCount: 0 }
}

function sourceCoverageForPanel(sections: ArdaSection[], panelId: ModuleId): SourceCoverageBadgeState | undefined {
  const mappedSections = sections.filter((section) => section.arda_panels.includes(panelId))
  if (mappedSections.length === 0) return { status: 'unmapped', label: 'source map unmapped', missingCount: 0 }
  return sourceCoverageForSections(mappedSections)
}

function getSceneZoneById(zones: ArdaSceneZone[], activeId: string | null): ArdaSceneZone | null {
  if (!activeId) return zones[0] ?? null
  return zones.find((zone) => zone.id === activeId) ?? null
}

function getWorkstationManifestByZoneId(
  manifests: ArdaWorkstationManifest[],
  zoneId: string | null,
): ArdaWorkstationManifest | null {
  if (!zoneId) return null
  const sceneSlotManifest = getSceneSlotWorkstationManifestByZoneId(zoneId)
  if (sceneSlotManifest) return sceneSlotManifest
  if (zoneId === 'settings') {
    return {
      id: 'settings_workstation',
      title: 'Settings',
      source_zone_id: 'settings',
      entry_anchor_id: 'settings_workstation_entry',
      module_ids: ['settings'],
      presentation_modes: ['in_scene', 'native_window'],
    }
  }
  if (zoneId === 'hermes_dashboard') {
    return {
      id: 'hermes_dashboard_workstation',
      title: 'Hermes Dashboard',
      source_zone_id: 'hermes_dashboard',
      entry_anchor_id: 'hermes_dashboard_entry',
      module_ids: ['hermes_dashboard', 'operations_and_packages'],
      presentation_modes: ['in_scene', 'native_window'],
    }
  }
  return manifests.find((manifest) => manifest.source_zone_id === zoneId) ?? null
}

function getWorkstationManifestById(
  manifests: ArdaWorkstationManifest[],
  manifestId: string | null,
): ArdaWorkstationManifest | null {
  if (!manifestId) return null
  const sceneSlotManifest = getSceneSlotWorkstationManifestById(manifestId)
  if (sceneSlotManifest) return sceneSlotManifest
  if (manifestId === 'settings_workstation') {
    return {
      id: 'settings_workstation',
      title: 'Settings',
      source_zone_id: 'settings',
      entry_anchor_id: 'settings_workstation_entry',
      module_ids: ['settings'],
      presentation_modes: ['in_scene', 'native_window'],
    }
  }
  if (manifestId === 'hermes_dashboard_workstation') {
    return {
      id: 'hermes_dashboard_workstation',
      title: 'Hermes Dashboard',
      source_zone_id: 'hermes_dashboard',
      entry_anchor_id: 'hermes_dashboard_entry',
      module_ids: ['hermes_dashboard', 'operations_and_packages'],
      presentation_modes: ['in_scene', 'native_window'],
    }
  }
  return manifests.find((manifest) => manifest.id === manifestId) ?? null
}

function getHumanDocs(bundle: ArdaBundle): Array<{ title: string; path: string; body_preview: string }> {
  const portal = asRecord(bundle.humanContext?.human_portal)
  const docs = asArray(portal?.docs)
  return docs
    .map((doc) => asRecord(doc))
    .filter((doc): doc is JsonRecord => doc !== null)
    .map((doc) => ({
      title: getString(doc.title, 'Untitled'),
      path: getString(doc.path),
      body_preview: getString(doc.body_preview, ''),
    }))
}

function getHumanNotes(bundle: ArdaBundle): Array<{ title: string; path: string; body_preview: string }> {
  const portal = asRecord(bundle.humanContext?.human_portal)
  const notes = asArray(portal?.notes)
  return notes
    .map((note) => asRecord(note))
    .filter((note): note is JsonRecord => note !== null)
    .slice(0, 6)
    .map((note) => ({
      title: getString(note.title, 'Untitled'),
      path: getString(note.path),
      body_preview: getString(note.body_preview, ''),
    }))
}

function getAgents(bundle: ArdaBundle): Array<{ name: string; realm: string; status: string; trustScore: number; sigil: string }> {
  return asArray(bundle.world?.agents)
    .map((agent) => asRecord(agent))
    .filter((agent): agent is JsonRecord => agent !== null)
    .map((agent) => ({
      name: getString(agent.name, 'Unknown'),
      realm: getString(agent.realm, 'unknown'),
      status: getString(agent.status, 'UNKNOWN'),
      trustScore: getNumber(agent.trust_score, 0),
      sigil: resolveAgentSigilFromContract(asRecord(bundle.soterionRenderContract), agent),
    }))
}

function getPackageTools(bundle: ArdaBundle): Array<{ tool: string; status: string; version: string; repo: string }> {
  return asArray(bundle.packageHealth?.tools)
    .map((tool) => asRecord(tool))
    .filter((tool): tool is JsonRecord => tool !== null)
    .slice(0, 8)
    .map((tool) => ({
      tool: getString(tool.tool, 'unknown'),
      status: getString(tool.observation_status, 'unknown'),
      version: getString(tool.version_hint, 'version hidden'),
      repo: getString(tool.repo, 'n/a'),
    }))
}

function getPackageEnablement(bundle: ArdaBundle): {
  summary: Array<{ label: string; value: string }>
  tools: Array<{ tool: string; lane: string; state: string; readiness: string; nextAction: string }>
} {
  const enablement = asRecord(bundle.packageEnablement)
  const summary = asRecord(enablement?.summary)
  return {
    summary: [
      { label: 'Policy Ready', value: `${getNumber(summary?.policy_ready_total, 0)}` },
      { label: 'Activation Ready', value: `${getNumber(summary?.ready_for_activation_total, 0)}` },
      { label: 'Config Ready', value: `${getNumber(summary?.configuration_ready_total, 0)}` },
      { label: 'Evidence Ready', value: `${getNumber(summary?.evidence_ready_total, 0)}` },
      { label: 'Observed Only', value: `${getNumber(summary?.observed_only_total, 0)}` },
    ],
    tools: asArray(enablement?.tools)
      .map((tool) => asRecord(tool))
      .filter((tool): tool is JsonRecord => tool !== null)
      .slice(0, 8)
      .map((tool) => ({
        tool: getString(tool.tool, 'unknown'),
        lane: getString(tool.integration_lane, 'unknown'),
        state: getString(tool.integration_state, 'unknown'),
        readiness: getString(tool.policy_readiness, 'untracked'),
        nextAction: getString(tool.next_action, 'n/a'),
      })),
  }
}

function getPackageRuntimeActivation(bundle: ArdaBundle): Array<{ tool: string; status: string; detail: string; ok: string }> {
  const activation = asRecord(bundle.packageRuntimeActivation)
  const surfaces = asRecord(activation?.surfaces)
  return Object.entries(surfaces ?? {})
    .map(([tool, value]) => {
      const record = asRecord(value)
      const status = getString(record?.status, 'unknown')
      const detail =
        getString(record?.proxy_url, '') ||
        getString(record?.base_url, '') ||
        getString(record?.runtime_mode, '') ||
        getString(record?.tool_bin_dir, '') ||
        getString(record?.command, '') ||
        getString(record?.summary, 'n/a').split('\n')[0]
      return {
        tool,
        status,
        detail,
        ok: getBoolean(record?.ok, false) ? 'ok' : 'check',
      }
    })
    .sort((a, b) => a.tool.localeCompare(b.tool))
    .slice(0, 8)
}

function getStorageStores(bundle: ArdaBundle): Array<{ path: string; changed: boolean; bytesAfter: number }> {
  const compaction = asRecord(bundle.storagePressure?.compaction)
  return asArray(compaction?.stores)
    .map((store) => asRecord(store))
    .filter((store): store is JsonRecord => store !== null)
    .slice(0, 6)
    .map((store) => ({
      path: getString(store.path),
      changed: getBoolean(store.changed, false),
      bytesAfter: getNumber(store.bytes_after, 0),
    }))
}

function getStoragePressureSummary(bundle: ArdaBundle): {
  summary: Array<{ label: string; value: string }>
  roots: Array<{ path: string; classification: string; bytes: string }>
  candidates: Array<{ path: string; action: string; bytes: string }>
} {
  const pressure = asRecord(bundle.storagePressure)
  const summary = asRecord(pressure?.summary)
  const guard = asRecord(pressure?.pressure_guard)
  const observed = asRecord(guard?.observed)
  return {
    summary: [
      { label: '/var Used', value: `${getNumber(observed?.disk_used_pct, 0)}%` },
      { label: 'Workspace Seen', value: formatBytes(getNumber(summary?.total_observed_workspace_bytes, 0)) },
      { label: 'Rebuildable', value: formatBytes(getNumber(summary?.rebuildable_bytes, 0)) },
      { label: 'Operational', value: formatBytes(getNumber(summary?.operational_bytes, 0)) },
      { label: 'History', value: formatBytes(getNumber(summary?.history_bytes, 0)) },
      { label: 'Mirror', value: formatBytes(getNumber(summary?.accounting_mirror_bytes, 0)) },
    ],
    roots: asArray(pressure?.workspace_roots)
      .map((item) => asRecord(item))
      .filter((item): item is JsonRecord => item !== null)
      .sort((a, b) => getNumber(b.bytes, 0) - getNumber(a.bytes, 0))
      .slice(0, 5)
      .map((item) => ({
        path: getString(item.path, 'unknown'),
        classification: getString(item.classification, 'unknown'),
        bytes: formatBytes(getNumber(item.bytes, 0)),
      })),
    candidates: asArray(pressure?.reclaim_candidates)
      .map((item) => asRecord(item))
      .filter((item): item is JsonRecord => item !== null)
      .slice(0, 4)
      .map((item) => ({
        path: getString(item.path, 'unknown'),
        action: getString(item.recommended_action, 'observe_only'),
        bytes: formatBytes(getNumber(item.bytes, 0)),
      })),
  }
}

function getOutputTopology(bundle: ArdaBundle): {
  surfaces: Array<{ id: string; path: string; classification: string; purpose: string }>
  candidates: Array<{ path: string; reason: string; action: string; priority: string; estimatedJoulework: number }>
  counts: { dataJsonl: number; humanMarkdown: number; historySnapshots: number }
} {
  const topology = asRecord(bundle.outputTopology)
  const counts = asRecord(topology?.counts)
  return {
    surfaces: asArray(topology?.surfaces)
      .map((surface) => asRecord(surface))
      .filter((surface): surface is JsonRecord => surface !== null)
      .map((surface) => ({
        id: getString(surface.id, 'unknown'),
        path: getString(surface.path),
        classification: getString(surface.classification, 'unknown'),
        purpose: getString(surface.purpose, ''),
      })),
    candidates: asArray(topology?.long_term_accounting_candidates)
      .map((candidate) => asRecord(candidate))
      .filter((candidate): candidate is JsonRecord => candidate !== null)
      .map((candidate) => ({
        path: getString(candidate.path),
        reason: getString(candidate.reason, ''),
        action: getString(candidate.recommended_action, 'mirror_tree'),
        priority: getString(candidate.priority, 'unknown'),
        estimatedJoulework: getNumber(candidate.estimated_joulework, 0),
      })),
    counts: {
      dataJsonl: getNumber(counts?.data_jsonl_files, 0),
      humanMarkdown: getNumber(counts?.human_markdown_files, 0),
      historySnapshots: getNumber(counts?.metrics_history_snapshots, 0),
    },
  }
}

function getOutputAccounting(bundle: ArdaBundle): {
  mirrorRoot: string
  mode: string
  summary: Array<{ label: string; value: string }>
  candidates: Array<{ path: string; status: string; mirrorPath: string; bytes: string; skippedFiles: number; compressedFiles: number }>
} {
  const accounting = asRecord(bundle.outputAccounting)
  const summary = asRecord(accounting?.summary)
  return {
    mirrorRoot: getString(accounting?.mirror_root, 'data/accounting/output_mirror'),
    mode: getString(accounting?.mode, 'mirror_only_non_destructive'),
    summary: [
      { label: 'Candidates', value: `${getNumber(summary?.candidate_count, 0)}` },
      { label: 'Mirrored Files', value: `${getNumber(summary?.mirrored_files, 0)}` },
      { label: 'Mirrored MB', value: formatMetric(getNumber(summary?.mirrored_bytes, 0) / (1024 * 1024)) },
      { label: 'Observed MB', value: formatMetric(getNumber(summary?.observed_source_bytes, 0) / (1024 * 1024)) },
      { label: 'Est. JW', value: formatMetric(getNumber(summary?.estimated_joulework, 0)) },
      { label: 'Est. Minutes', value: `${getNumber(summary?.estimated_operator_minutes, 0)}` },
    ],
    candidates: asArray(accounting?.candidates)
      .map((candidate) => asRecord(candidate))
      .filter((candidate): candidate is JsonRecord => candidate !== null)
      .map((candidate) => ({
        path: getString(candidate.path),
        status: getString(candidate.status, 'unknown'),
        mirrorPath: getString(candidate.mirror_path, 'n/a'),
        bytes: formatMetric(getNumber(candidate.mirrored_bytes, 0) / (1024 * 1024)),
        skippedFiles: getNumber(candidate.skipped_files, 0),
        compressedFiles: getNumber(candidate.compressed_files, 0),
      })),
  }
}

function getGovernanceRuntimeSignals(bundle: ArdaBundle): Array<{ label: string; value: string }> {
  const governance = asRecord(bundle.governanceRuntime)
  const signals = asRecord(governance?.signals)
  const derived = asRecord(governance?.derived)
  return [
    { label: 'Autonomy', value: formatMetric(getNumber(signals?.autonomy_observation_score, 0)) },
    { label: 'Gap', value: formatMetric(getNumber(derived?.autonomy_gap, 0)) },
    { label: 'JW', value: formatMetric(getNumber(signals?.avg_joulework, 0)) },
    { label: 'LE', value: formatMetric(getNumber(signals?.avg_love_eq, 0)) },
    { label: 'Bacon', value: formatMetric(getNumber(signals?.bacon_lite_recent_confidence, 0)) },
    { label: 'Triad', value: formatMetric(getNumber(signals?.triad_pass_rate, 0)) },
  ]
}

function getOperationsFlowSummary(bundle: ArdaBundle): Array<{ label: string; value: string }> {
  const operations = asRecord(bundle.operationsFlow)
  const derived = asRecord(operations?.derived)
  const posture = asRecord(derived?.queue_posture)
  return [
    { label: 'Projects Queue', value: `${getNumber(posture?.projects_queue_queued, 0)}` },
    { label: 'Known Work', value: `${getNumber(posture?.total_known_work_items, 0)}` },
    { label: 'Escalations', value: `${getNumber(posture?.pending_escalations, 0)}` },
    { label: 'Lockdown', value: getBoolean(derived?.control_plane_ready, false) ? 'ready' : 'gap' },
    { label: 'Autonomy', value: getBoolean(derived?.autonomy_ready, false) ? 'ready' : 'degraded' },
  ]
}

function getPaperclipAlignment(bundle: ArdaBundle): {
  summary: Array<{ label: string; value: string }>
  domains: Array<{ label: string; value: string }>
  tasks: Array<{ title: string; owner: string; status: string }>
  evidence: Array<{ sourceId: string; readiness: string; confidence: string }>
} {
  const alignment = asRecord(bundle.paperclipAlignment)
  const derived = asRecord(alignment?.derived)
  const evidence = asRecord(alignment?.evidence)
  const readiness = asRecord(derived?.paperclip_readiness)

  return {
    summary: [
      { label: 'Evidence Ready', value: getBoolean(derived?.evidence_ready, false) ? 'yes' : 'no' },
      { label: 'Policy Ready', value: `${getNumber(evidence?.policy_ready_sources, 0)}/${getNumber(evidence?.expected_policy_ready_sources, 0)}` },
      { label: 'Open Tasks', value: `${getNumber(derived?.comparison_tasks_open, 0)}` },
    ],
    domains: [
      { label: 'Governance', value: getBoolean(readiness?.governance, false) ? 'aligned' : 'gap' },
      { label: 'Edge Runtime', value: getBoolean(readiness?.edge_runtime, false) ? 'aligned' : 'gap' },
      { label: 'Deployment', value: getBoolean(readiness?.deployment, false) ? 'aligned' : 'gap' },
      { label: 'Ledger', value: getBoolean(readiness?.ledger_topology, false) ? 'aligned' : 'gap' },
    ],
    tasks: asArray(evidence?.comparison_tasks)
      .map((item) => asRecord(item))
      .filter((item): item is JsonRecord => item !== null)
      .map((item) => ({
        title: getString(item.title, 'Untitled task'),
        owner: getString(item.owner, 'unknown'),
        status: getString(item.status, 'unknown'),
      })),
    evidence: asArray(evidence?.sources)
      .map((item) => asRecord(item))
      .filter((item): item is JsonRecord => item !== null)
      .map((item) => ({
        sourceId: getString(item.source_id, 'unknown'),
        readiness: getString(item.policy_readiness, 'unknown'),
        confidence: formatMetric(getNumber(item.confidence, 0)),
      })),
  }
}

function getEscalationRuntime(bundle: ArdaBundle): {
  summary: Array<{ label: string; value: string }>
  reasons: Array<{ label: string; value: string }>
} {
  const escalation = asRecord(bundle.escalationRuntime)
  const summary = asRecord(escalation?.summary)
  return {
    summary: [
      { label: 'Pending', value: `${getNumber(summary?.pending_total, 0)}` },
      { label: 'Deduped', value: `${getNumber(summary?.pending_deduped, 0)}` },
      { label: 'Duplicates', value: `${getNumber(summary?.duplicate_pending_count, 0)}` },
    ],
    reasons: asArray(escalation?.reason_buckets)
      .map((item) => asRecord(item))
      .filter((item): item is JsonRecord => item !== null)
      .slice(0, 6)
      .map((item) => ({
        label: getString(item.reason, 'unknown'),
        value: `${getNumber(item.count, 0)}`,
      })),
  }
}

function getOperatorActions(bundle: ArdaBundle): {
  summary: Array<{ label: string; value: string }>
  actions: Array<{ title: string; owner: string; status: string; note: string }>
} {
  const actions = asRecord(bundle.operatorActions)
  const summary = asRecord(actions?.summary)
  return {
    summary: [
      { label: 'Human Needed', value: `${getNumber(summary?.human_needed_total, 0)}` },
      { label: 'External Blockers', value: `${getNumber(summary?.external_blockers_total, 0)}` },
      { label: 'Auth Required', value: `${getNumber(summary?.auth_required_total, 0)}` },
      { label: 'Config Required', value: `${getNumber(summary?.configuration_required_total, 0)}` },
    ],
    actions: asArray(actions?.actions)
      .map((item) => asRecord(item))
      .filter((item): item is JsonRecord => item !== null)
      .slice(0, 8)
      .map((item) => ({
        title: getString(item.title, 'Untitled action'),
        owner: getString(item.owner, 'unknown'),
        status: getString(item.status, 'unknown'),
        note: getString(item.note, 'n/a'),
      })),
  }
}

function getGovernanceSummary(bundle: ArdaBundle): { ready: boolean; weights: Array<{ label: string; value: number }>; thresholds: Array<{ label: string; value: number }> } {
  const governance = asRecord(bundle.runtimeSettings?.governance)
  const weights = asRecord(governance?.weights)
  const thresholds = asRecord(governance?.thresholds)

  return {
    ready: getBoolean(asRecord(governance?.always_on)?.triad_influence, false),
    weights: Object.entries(weights ?? {}).map(([label, value]) => ({
      label,
      value: getNumber(value, 0),
    })),
    thresholds: Object.entries(thresholds ?? {}).map(([label, value]) => ({
      label,
      value: getNumber(value, 0),
    })),
  }
}

function getAutonomyReadinessSummary(bundle: ArdaBundle): {
  posture: string
  checkpoint: Array<{ label: string; value: string }>
  evidence: Array<{ phase: string; title: string; status: string; source: string }>
  nextUnlocks: Array<{ title: string; status: string; requires: string }>
} {
  const readiness = asRecord(bundle.autonomyReadiness)
  const checkpoint = asRecord(readiness?.checkpoint)
  const evidence = asArray(readiness?.evidence)
    .map((item) => asRecord(item))
    .filter((item): item is JsonRecord => item !== null)
    .map((item) => ({
      phase: getString(item.phase, 'n/a'),
      title: getString(item.title, 'Untitled evidence'),
      status: getString(item.status, 'unknown'),
      source: getString(item.source, 'unknown source'),
    }))
  const nextUnlocks = asArray(readiness?.next_unlocks)
    .map((item) => asRecord(item))
    .filter((item): item is JsonRecord => item !== null)
    .map((item) => ({
      title: getString(item.title, 'Untitled unlock'),
      status: getString(item.status, 'unknown'),
      requires: asArray(item.requires).map((entry) => getString(entry)).filter(Boolean).join(', '),
    }))

  return {
    posture: getString(checkpoint?.overall_posture, 'unknown'),
    checkpoint: Object.entries(checkpoint ?? {}).map(([label, value]) => ({
      label,
      value: getString(value, `${value}`),
    })),
    evidence,
    nextUnlocks,
  }
}

function getSnapshotSectionStats(bundle: ArdaBundle): Array<{ id: string; status: string }> {
  return Object.entries(asRecord(bundle.snapshot?.sections) ?? {}).map(([id, section]) => ({
    id,
    status: getString(asRecord(section)?.schema_version, 'unknown'),
  }))
}

function getQueueSummary(bundle: ArdaBundle): { completed: number; priorities: Array<{ label: string; value: number }>; owners: Array<{ label: string; value: number }> } {
  const projectTasks = asRecord(bundle.queueSummary?.project_tasks)
  const countsByStatus = asRecord(projectTasks?.counts_by_status)
  const countsByPriority = asRecord(projectTasks?.counts_by_priority)
  const countsByOwner = asRecord(projectTasks?.counts_by_owner)

  return {
    completed: getNumber(countsByStatus?.completed, 0),
    priorities: Object.entries(countsByPriority ?? {}).map(([label, value]) => ({
      label,
      value: getNumber(value, 0),
    })),
    owners: Object.entries(countsByOwner ?? {}).slice(0, 8).map(([label, value]) => ({
      label,
      value: getNumber(value, 0),
    })),
  }
}

function latestTaskEntries(entries: JsonRecord[]): JsonRecord[] {
  const byId = new Map<string, JsonRecord>()
  for (const entry of entries) {
    const id = getString(entry.id ?? entry.task_id, '')
    if (!id) continue
    byId.set(id, entry)
  }
  return [...byId.values()]
}

function providerOperationalState(provider: JsonRecord): string {
  if (!getBoolean(provider.enabled, false)) return 'disabled'
  if (!getBoolean(provider.has_api_key, false)) return 'missing_api_key'
  const requestsPerDay = getNumber(provider.requests_per_day, NaN)
  const requestsUsedDay = getNumber(provider.requests_used_day, 0)
  const requestsPerMinute = getNumber(provider.requests_per_minute, NaN)
  const requestsUsedMinute = getNumber(provider.requests_used_minute, 0)
  if (Number.isFinite(requestsPerDay) && requestsPerDay > 0 && requestsUsedDay >= requestsPerDay) return 'rate_limited'
  if (Number.isFinite(requestsPerMinute) && requestsPerMinute > 0 && requestsUsedMinute >= requestsPerMinute) return 'minute_quota_exhausted'
  if (getBoolean(provider.in_cooldown, false)) return 'cooldown'
  if (!getBoolean(provider.healthy, false)) return 'unhealthy'
  if (getNumber(provider.consecutive_failures, 0) >= 2 || getNumber(provider.error_count, 0) >= 5) return 'degraded'
  return 'ready'
}

function providerUsageRatio(used: unknown, max: unknown): number | null {
  const maxValue = getNumber(max, NaN)
  if (!Number.isFinite(maxValue) || maxValue <= 0) return null
  return Math.min(Math.max(getNumber(used, 0) / maxValue, 0), 1)
}

function providerBudgetPressureLevel(provider: JsonRecord): string {
  const state = providerOperationalState(provider)
  const minuteRatio = providerUsageRatio(provider.requests_used_minute, provider.requests_per_minute)
  const dayRatio = providerUsageRatio(provider.requests_used_day, provider.requests_per_day)
  if (
    ['rate_limited', 'minute_quota_exhausted', 'cooldown'].includes(state) ||
    (minuteRatio !== null && minuteRatio >= 0.9) ||
    (dayRatio !== null && dayRatio >= 0.9)
  ) {
    return 'critical'
  }
  if ((minuteRatio !== null && minuteRatio >= 0.75) || (dayRatio !== null && dayRatio >= 0.75)) return 'warning'
  return 'ok'
}

function getOperatorCockpitSurface(bundle: ArdaBundle, reviewGateItems: ReviewGateItem[]): OperatorCockpitSurface {
  const latestTasks = latestTaskEntries(bundle.taskQueueEntries)
  const openTasks = latestTasks
    .filter((entry) => ['queued', 'in_progress', 'blocked', 'pending'].includes(getString(entry.status, '')))
    .sort((left, right) => getTimestamp(right).localeCompare(getTimestamp(left)))
  const humanGates = reviewGateItems
    .filter((item) => ['pending_review', 'write_pending', 'blocked', 'human_required'].some((status) => item.status.includes(status)))
    .slice(0, 8)
  const repairPressure = asRecord(asRecord(bundle.controlLoopTruth.wardenGuardhouse?.queue)?.repair_pressure)
  const auditRunner = asRecord(bundle.controlLoopTruth.chronosStatus?.audit_runner)
  const scheduledTasks = asArray(auditRunner?.scheduled_tasks)
    .map((item) => asRecord(item))
    .filter((item): item is JsonRecord => item !== null)
  const dueTasks = scheduledTasks
    .filter((task) => getBoolean(task.due, false))
    .slice(0, 5)
    .map((task) => ({
      id: getString(task.id, 'unknown'),
      name: getString(task.name, 'Untitled audit'),
      cadence: getString(task.cadence, 'unknown'),
      owner: getString(task.owner, 'chronos'),
    }))
  const hermesReceiptRecords = [
    ...bundle.hermesAgentGatewayReceipts.map((receipt) => ({ ...(receipt as JsonRecord), __source: 'gateway' })),
    ...bundle.flywheelDispatchReceipts.map((receipt) => ({ ...(receipt as JsonRecord), __source: 'dispatch' })),
  ] as Array<JsonRecord & { __source: string }>
  const latestReceipts = hermesReceiptRecords
    .sort((left, right) => getTimestamp(right).localeCompare(getTimestamp(left)))
    .slice(0, 5)
    .map((receipt, index) => ({
      id: getString(receipt.receipt_id ?? receipt.task_id ?? receipt.ts_utc, `receipt-${index + 1}`),
      status: getString(receipt.status ?? (getBoolean(receipt.dry_run, false) ? 'dry_run' : 'recorded'), 'recorded'),
      task: getString(receipt.task_ref ?? receipt.task_id ?? receipt.packet_id, 'unlinked task'),
      source: getString(receipt.__source, 'receipt'),
    }))
  const latestReadinessBySource = new Map<string, JsonRecord>()
  for (const entry of bundle.athenaPolicyReadiness) {
    const sourceId = getString(entry.source_id, '')
    if (!sourceId) continue
    const previous = latestReadinessBySource.get(sourceId)
    if (!previous || getTimestamp(entry).localeCompare(getTimestamp(previous)) >= 0) {
      latestReadinessBySource.set(sourceId, entry)
    }
  }
  const readinessRecords = [...latestReadinessBySource.values()]
  const readinessCount = (readiness: string) =>
    readinessRecords.filter((entry) => getString(entry.policy_readiness, 'reference_only') === readiness).length
  const providerPressure = asRecord(bundle.charonRouter?.provider_pressure)
  const pressureProviders = [
    ...asArray(providerPressure?.providers),
    ...asArray(providerPressure?.cooldowns),
    ...asArray(providerPressure?.budget_pressure),
  ]
    .map((entry) => asRecord(entry))
    .filter((entry): entry is JsonRecord => entry !== null)
  const uniquePressureProviders = new Map<string, JsonRecord>()
  for (const provider of pressureProviders) {
    const id = getString(provider.id, getString(provider.provider_id, 'unknown'))
    const state = getString(provider.operational_state, providerOperationalState(provider))
    const level = getString(provider.budget_pressure_level, providerBudgetPressureLevel(provider))
    uniquePressureProviders.set(`${id}:${state}:${level}`, {
      ...provider,
      operational_state: state,
      budget_pressure_level: level,
    })
  }
  const charonWarnings = [...uniquePressureProviders.values()]
    .filter((provider) => {
      const state = getString(provider.operational_state, 'ready')
      const level = getString(provider.budget_pressure_level, 'ok')
      const healthy = getBoolean(provider.healthy, true)
      const blocked = getBoolean(provider.operational_blocked, getBoolean(provider.blocked, false))
      return blocked || !healthy || state === 'cooldown' || level !== 'ok' || getBoolean(provider.in_cooldown, false)
    })
    .slice(0, 6)
    .map((provider) => ({
      providerId: getString(provider.id, getString(provider.provider_id, 'unknown')),
      state: getString(provider.operational_state, getBoolean(provider.in_cooldown, false) ? 'cooldown' : 'unknown'),
      level: getString(provider.budget_pressure_level, getBoolean(provider.in_cooldown, false) ? 'critical' : 'ok'),
      detail: getString(provider.last_error, getString(provider.cooldown_until_utc, 'provider pressure')),
    }))
  const routeGuardrails = asRecord(bundle.charonRouter?.route_guardrails)
  const providerRecords = asArray(providerPressure?.providers)
    .map((entry) => asRecord(entry))
    .filter((entry): entry is JsonRecord => entry !== null)
  const availableProviderCount = providerRecords.filter((provider) =>
    getBoolean(provider.enabled, false)
    && getBoolean(provider.healthy, false)
    && !getBoolean(provider.operational_blocked, getBoolean(provider.blocked, false))
  ).length
  const blockedProviderCount = providerRecords.filter((provider) =>
    getBoolean(provider.enabled, false)
    && getBoolean(provider.operational_blocked, getBoolean(provider.blocked, false))
  ).length
  const liveAutonomyReadiness = asRecord(bundle.ceoAutopilotState?.autonomy_readiness)
  const autonomyGateReasons = asArray(liveAutonomyReadiness?.reasons)
    .map((reason) => getString(reason))
    .filter(Boolean)
  const storageSummary = asRecord(bundle.storagePressure?.summary)
  const storageApply = asRecord(bundle.storagePressure?.latest_apply ?? bundle.storagePressure?.apply)
  const storageApplySummary = asRecord(storageApply?.summary)
  const storageClasses = asArray(bundle.storagePressure?.classes)
    .map((entry) => asRecord(entry))
    .filter((entry): entry is JsonRecord => entry !== null)
  const storageWarnings = storageClasses
    .filter((entry) => ['generated_tick_output', 'runtime_backup', 'rebuildable_temp', 'misplaced_model_artifact'].includes(getString(entry.category, '')))
    .slice(0, 5)
    .map((entry) => ({
      label: getString(entry.category, 'storage'),
      value: `${getNumber(entry.files, 0)} files`,
      detail: getString(entry.recommended_action, 'review'),
    }))
  const deletedBytes = getNumber(storageApplySummary?.deleted_bytes, 0)

  return {
    queue: {
      openTotal: openTasks.length,
      items: openTasks.slice(0, 8).map((entry) => ({
        id: getString(entry.id ?? entry.task_id, 'unknown'),
        title: getString(entry.title, 'Untitled task'),
        owner: getString(entry.owner, 'unknown'),
        status: getString(entry.status, 'unknown'),
        priority: getString(entry.priority, 'normal'),
      })),
    },
    humanGates: {
      blockedTotal: humanGates.length,
      items: humanGates.map((item) => ({
        id: item.id,
        title: item.title,
        status: item.status,
        decisionClass: item.decisionClass,
      })),
    },
    warden: {
      effectiveAttention: getNumber(repairPressure?.effective_attention_required, 0),
      rawAttention: getNumber(repairPressure?.raw_attention_required, 0),
      repeatedNoise: getNumber(repairPressure?.repeated_repair_noise, 0),
      activeRepairFiles: getNumber(repairPressure?.active_repair_files, 0),
      resolvedRepairFiles: getNumber(repairPressure?.resolved_repair_files, 0),
    },
    chronos: {
      runnerStatus: getString(auditRunner?.runner_status, getString(bundle.controlLoopTruth.chronosStatus?.status, 'missing')),
      readyTaskCount: getNumber(auditRunner?.ready_task_count, 0),
      scheduledTaskCount: getNumber(auditRunner?.scheduled_task_count, scheduledTasks.length),
      dueTasks,
    },
    hermes: {
      gatewayReceiptCount: bundle.hermesAgentGatewayReceipts.length,
      dispatchReceiptCount: bundle.flywheelDispatchReceipts.length,
      latestReceipts,
    },
    athena: {
      policyReady: readinessCount('policy_ready'),
      referenceOnly: readinessCount('reference_only'),
      implementationReady: readinessCount('implementation_ready'),
      latest: readinessRecords.slice(-6).reverse().map((entry) => {
        const observed = asRecord(asRecord(entry.gate)?.observed)
        return {
          sourceId: getString(entry.source_id, 'unknown'),
          readiness: getString(entry.policy_readiness, 'unknown'),
          confidence: formatMetric(getNumber(observed?.confidence, 0)),
        }
      }),
    },
    charon: {
      providerCount: providerRecords.length,
      availableProviderCount,
      blockedProviderCount,
      cooldownCount: charonWarnings.filter((warning) => warning.state === 'cooldown').length,
      budgetPressureCount: charonWarnings.filter((warning) => warning.level !== 'ok').length,
      toolContextFloor: getNumber(routeGuardrails?.tool_execution_min_context_window, 64000),
      warnings: charonWarnings,
    },
    autonomyGate: {
      decision: getString(liveAutonomyReadiness?.decision, 'unknown'),
      cleanupPacketCount: getNumber(liveAutonomyReadiness?.cleanup_packet_count, 0),
      externalSourceBlockedCount: getNumber(liveAutonomyReadiness?.external_source_blocked_count, 0),
      reasons: autonomyGateReasons.slice(0, 5),
    },
    storageHygiene: {
      status: getString(bundle.storagePressure?.status, 'missing'),
      cleanupCandidateCount: getNumber(storageSummary?.cleanup_candidate_count, 0),
      deletedBytes,
      warnings: deletedBytes > 0
        ? [
            {
              label: 'latest_apply',
              value: `${deletedBytes} bytes`,
              detail: `${getNumber(storageApplySummary?.deleted_total, 0)} deleted`,
            },
            ...storageWarnings,
          ].slice(0, 6)
        : storageWarnings,
    },
    ledgerGaps: bundle.controlLoopTruth.ledgerStates
      .filter((ledger) => ledger.status !== 'ready')
      .map((ledger) => ({
        label: ledger.label,
        path: ledger.path,
        status: ledger.status,
        detail: ledger.detail,
      })),
  }
}

function getCommandConsoleSurface(bundle: ArdaBundle, reviewGateItems: ReviewGateItem[]): CommandConsoleSurface {
  const projectTasks = asRecord(bundle.queueSummary?.project_tasks)
  const recentTasks = asArray(projectTasks?.recent)
    .map((entry) => asRecord(entry))
    .filter((entry): entry is JsonRecord => entry !== null)
  const queueFederationSummary = asRecord(bundle.queueFederation?.summary)
  const queueFederationSources = asArray(bundle.queueFederation?.sources)
    .map((entry) => asRecord(entry))
    .filter((entry): entry is JsonRecord => entry !== null)
  const canonicalQueueContract = queueFederationSources.find((source) => getString(source.id, '') === 'canonical_project_tasks')
  const canonicalRecordClass = getString(canonicalQueueContract?.default_record_class, 'execution_attempt')
  const canonicalLaneSubclass = getString(canonicalQueueContract?.lane_subclass, 'canonical_task')
  const canonicalReceipt = getString(canonicalQueueContract?.promotion_receipt_required, 'core/projects/tasks/queue.jsonl append-only closeout')
  const flywheelSummary = asRecord(bundle.flywheelPacketRuntime?.summary)
  const flywheelPackets = asArray(bundle.flywheelPacketRuntime?.packets)
    .map((entry) => asRecord(entry))
    .filter((entry): entry is JsonRecord => entry !== null)
  const packetTotal = getNumber(flywheelSummary?.packet_total, flywheelPackets.length)
  const readyTotal = getNumber(flywheelSummary?.ready_total, 0)
  const blockedTotal = getNumber(flywheelSummary?.blocked_total, 0)
  const l3Status = asRecord(bundle.l3ReadinessProjection?.status)
  const l3Flywheel = asRecord(bundle.l3ReadinessProjection?.flywheel)
  const l3ProjectionPolicy = asRecord(bundle.l3ReadinessProjection?.projection_policy)
  const l3Level = getString(l3Status?.level, 'missing')
  const l3BoundedReady = getBoolean(l3Status?.bounded_mutation_ready, false)
  const l3BroadMutationAuthorized = getBoolean(l3Status?.broad_mutation_authorized, false)
  const l3NextReadyPacket = asRecord(l3Flywheel?.next_ready_packet)
  const completedTotal = getNumber(asRecord(projectTasks?.counts_by_status)?.completed, 0)
  const scoutTotal = bundle.scoutRequests.length + bundle.scoutFindings.length

  const workItems = (flywheelPackets.length > 0 ? flywheelPackets : recentTasks.slice(-8))
    .slice(-8)
    .reverse()
    .map((item, index) => {
      const meta = asRecord(item.meta)
      return {
        id: getString(item.id ?? item.task_id ?? meta?.packet_id, `work-${index + 1}`),
        title: getString(item.title ?? item.summary ?? meta?.plan, 'Untitled work item'),
        owner: getString(item.owner ?? meta?.owner, 'unknown'),
        status: getString(item.readiness ?? item.status ?? item.result, 'unknown'),
        priority: getString(item.priority ?? meta?.risk, 'normal'),
        recordClass: getString(item.record_class ?? meta?.record_class, canonicalRecordClass),
        laneSubclass: getString(item.lane_subclass ?? meta?.lane_subclass, canonicalLaneSubclass),
        promotionReceiptRequired: getString(item.promotion_receipt_required ?? meta?.promotion_receipt_required, canonicalReceipt),
      }
    })

  const messages = bundle.hermesMessages
    .slice(-6)
    .reverse()
    .map((message, index) => {
      const classification = asRecord(message.classification)
      const body = getBoolean(message.content_redacted, false)
        ? '[redacted]'
        : getString(message.content ?? message.summary, 'No message body recorded')
      return {
        id: getString(message.completion_id ?? message.receipt_id ?? message.received_at_utc, `message-${index + 1}`),
        source: getString(message.source ?? message.direction, 'hermes'),
        actor: getString(message.sender ?? message.agent ?? message.channel, 'unknown'),
        intent: getString(classification?.intent ?? message.status, 'message'),
        body,
        timestamp: getTimestamp(message),
      }
    })

  const receiptRecords = [
    ...bundle.flywheelDispatchReceipts.map((receipt) => ({ ...receipt, __source: 'flywheel dispatch' })),
    ...bundle.hermesAgentGatewayReceipts.map((receipt) => ({ ...receipt, __source: 'hermes gateway' })),
  ] as Array<JsonRecord & { __source: string }>
  const receipts = receiptRecords
    .sort((left, right) => getTimestamp(left).localeCompare(getTimestamp(right)))
    .slice(-6)
    .reverse()
    .map((receipt, index) => ({
      id: getString(receipt.receipt_id ?? receipt.task_id ?? receipt.ts_utc, `receipt-${index + 1}`),
      source: getString(receipt.__source, 'receipt'),
      status: getString(receipt.status ?? (getBoolean(receipt.dry_run, false) ? 'dry_run' : 'recorded'), 'recorded'),
      task: getString(receipt.task_ref ?? receipt.task_id ?? receipt.packet_id, 'unlinked task'),
      summary: getString(receipt.summary ?? receipt.next_action ?? receipt.prompt_sha1_12, 'Receipt recorded without summary text.'),
      timestamp: getTimestamp(receipt),
    }))

  const conversations = bundle.agentConversations
    .slice(-6)
    .reverse()
    .map((conversation, index) => ({
      id: getString(conversation.conversation_id ?? conversation.id ?? conversation.ts_utc, `conversation-${index + 1}`),
      topic: getString(conversation.topic ?? conversation.related_plan ?? conversation.related_task, 'Untitled conversation'),
      speaker: getString(conversation.speaker_agent ?? conversation.agent ?? conversation.speaker, 'unknown agent'),
      messageClass: getString(conversation.message_class ?? conversation.class ?? conversation.actionability, 'observation'),
      summary: getString(conversation.summary ?? conversation.message ?? conversation.content, 'No conversation summary recorded.'),
      risk: getString(conversation.risk_lane ?? conversation.risk, 'unknown risk'),
      timestamp: getTimestamp(conversation),
    }))

  const scoutRequests = bundle.scoutRequests.map((request, index) => ({
    id: getString(request.scout_request_id ?? request.request_id ?? request.id, `scout-request-${index + 1}`),
    kind: 'request',
    question: getString(request.question ?? request.topic ?? request.summary, 'Untitled scout request'),
    requester: getString(request.requester_agent ?? request.requester ?? request.owner, 'unknown requester'),
    status: getString(request.status ?? request.state, 'requested'),
    sourcePolicy: getString(request.allowed_sources ?? request.source_policy, 'source policy unknown'),
    timestamp: getTimestamp(request),
  }))
  const scoutFindings = bundle.scoutFindings.map((finding, index) => ({
    id: getString(finding.scout_finding_id ?? finding.finding_id ?? finding.id, `scout-finding-${index + 1}`),
    kind: 'finding',
    question: getString(finding.question ?? finding.title ?? finding.summary, 'Untitled scout finding'),
    requester: getString(finding.requester_agent ?? finding.source_agent ?? finding.owner, 'athena'),
    status: getString(finding.status ?? finding.result, 'found'),
    sourcePolicy: getString(finding.allowed_sources ?? finding.source_policy ?? finding.source_class, 'sources recorded in finding'),
    timestamp: getTimestamp(finding),
  }))
  const scoutItems = [...scoutRequests, ...scoutFindings]
    .sort((left, right) => left.timestamp.localeCompare(right.timestamp))
    .slice(-6)
    .reverse()

  const gaps = [
    {
      title: 'Agent conversation viewer',
      detail: bundle.agentConversations.length > 0
        ? `${bundle.agentConversations.length} council conversation records loaded.`
        : 'Missing data/council/agent_conversations.jsonl projection for active agent conversations.',
    },
    {
      title: 'Scout research lane',
      detail: scoutTotal > 0
        ? `${bundle.scoutRequests.length} requests and ${bundle.scoutFindings.length} findings loaded.`
        : 'Missing data/athena/scout_requests.jsonl, data/athena/scout_findings.jsonl, or core/state/scout_runtime.json projection.',
    },
    {
      title: 'Flywheel packet backlog',
      detail: packetTotal > 0
        ? `${packetTotal} packets projected with ${readyTotal} ready and ${blockedTotal} blocked.`
        : 'core/state/flywheel_packet_runtime.json is loaded, but it currently exposes no packets for the ARDA work lane.',
    },
    {
      title: 'L3 readiness projection',
      detail: bundle.l3ReadinessProjection
        ? `${l3Level}; bounded mutation ${l3BoundedReady ? 'ready' : 'not ready'}; broad mutation ${l3BroadMutationAuthorized ? 'authorized' : 'blocked'}.`
        : 'Missing core/state/l3_readiness_projection.json for ARDA/Hermes L3 operator context.',
    },
  ]

  return {
    metrics: [
      { label: 'L3', value: l3BoundedReady ? 'READY' : 'GATED', tone: l3BoundedReady ? 'good' : 'warn' },
      { label: 'packets', value: `${packetTotal}`, tone: packetTotal > 0 ? 'good' : 'warn' },
      { label: 'ready', value: `${readyTotal}`, tone: readyTotal > 0 ? 'good' : 'muted' },
      { label: 'reviews', value: `${reviewGateItems.length}`, tone: reviewGateItems.length > 0 ? 'warn' : 'muted' },
      { label: 'messages', value: `${bundle.hermesMessages.length}`, tone: bundle.hermesMessages.length > 0 ? 'good' : 'warn' },
      { label: 'receipts', value: `${receipts.length}`, tone: receipts.length > 0 ? 'good' : 'warn' },
      { label: 'council', value: `${conversations.length}`, tone: conversations.length > 0 ? 'good' : 'warn' },
      { label: 'scout', value: `${scoutItems.length}`, tone: scoutItems.length > 0 ? 'good' : 'warn' },
    ],
    lanes: [
      {
        title: 'Stage Contract',
        value: `${getNumber(queueFederationSummary?.sources_total, queueFederationSources.length)} lanes`,
        detail: `${getNumber(queueFederationSummary?.promotion_ready_total, 0)} promotion-ready / ${getNumber(queueFederationSummary?.blocked_total, 0)} blocked; canonical=${canonicalRecordClass}`,
        status: bundle.queueFederation ? 'partial' : 'gap',
      },
      {
        title: 'Flywheel',
        value: `${readyTotal} ready`,
        detail: `${packetTotal} packets / ${blockedTotal} blocked`,
        status: packetTotal > 0 ? 'partial' : 'gap',
      },
      {
        title: 'L3 Readiness',
        value: l3BoundedReady ? 'bounded ready' : 'gated',
        detail: l3NextReadyPacket
          ? `${getString(l3NextReadyPacket.packet_id, 'next')} ${getString(l3NextReadyPacket.readiness, 'ready')}; projection read-only=${getBoolean(l3ProjectionPolicy?.read_only, true) ? 'true' : 'false'}`
          : `${l3Level}; projection missing next packet`,
        status: bundle.l3ReadinessProjection ? 'partial' : 'gap',
      },
      {
        title: 'Queue',
        value: `${recentTasks.length} recent`,
        detail: `${completedTotal} completed in task summary`,
        status: recentTasks.length > 0 ? 'partial' : 'gap',
      },
      {
        title: 'Hermes',
        value: `${messages.length} visible`,
        detail: `${bundle.hermesAgentGatewayReceipts.length} gateway receipts loaded`,
        status: messages.length > 0 ? 'partial' : 'gap',
      },
      {
        title: 'Scout',
        value: `${scoutTotal} records`,
        detail: bundle.scoutRuntime ? 'runtime projection loaded' : 'runtime projection missing',
        status: scoutTotal > 0 || bundle.scoutRuntime ? 'partial' : 'gap',
      },
      {
        title: 'Decisions',
        value: `${reviewGateItems.length} gated`,
        detail: 'Arandur, HADES, and ATHENA review packets',
        status: reviewGateItems.length > 0 ? 'partial' : 'gap',
      },
      {
        title: 'Evidence',
        value: `${receipts.length} recent`,
        detail: 'Hermes gateway and Flywheel dispatch receipts',
        status: receipts.length > 0 ? 'partial' : 'gap',
      },
    ],
    workItems,
    messages,
    receipts,
    conversations,
    scoutItems,
    gaps,
  }
}

function getPlanShelf(bundle: ArdaBundle): {
  humanPlanRoot: string
  corePlanRoot: string
  plans: Array<{ id: string; title: string; owner: string; openTaskCount: number; humanPlanPath: string; coreQuickRefPath: string }>
} {
  const planMap = asRecord(bundle.planMap)
  const plans = asArray(planMap?.plans)
    .map((entry) => asRecord(entry))
    .filter((entry): entry is JsonRecord => entry !== null)
    .map((entry) => ({
      id: getString(entry.id, 'unknown'),
      title: getString(entry.title, 'Untitled Plan'),
      owner: getString(entry.owner, 'unknown'),
      openTaskCount: getNumber(entry.openTaskCount ?? entry.open_task_count, 0),
      humanPlanPath: getString(entry.humanPlanPath ?? entry.human_plan_path, 'human/plans'),
      coreQuickRefPath: getString(entry.coreQuickRefPath ?? entry.core_quick_ref_path, 'core/projects/Plans'),
    }))

  return {
    humanPlanRoot: getString(planMap?.humanPlanRoot ?? planMap?.human_plan_root, 'human/plans'),
    corePlanRoot: getString(planMap?.corePlanRoot ?? planMap?.core_plan_root, 'core/projects/Plans'),
    plans,
  }
}

function getOperatorRuntimeSurface(bundle: ArdaBundle): JsonRecord | null {
  return asRecord(bundle.operatorRuntimeStatus)
}

function getHumanAugmentationRuntime(bundle: ArdaBundle): {
  summary: Array<{ label: string; value: string }>
  approvals: Array<{ id: string; decisionClass: string; approvers: string; status: string; note: string; commandSignature?: string | null }>
} {
  const runtime = asRecord(bundle.humanAugmentationRuntime)
  const summary = asRecord(runtime?.summary)
  const approvals = asArray(runtime?.approvals)
    .map((item) => asRecord(item))
    .filter((item): item is JsonRecord => item !== null)
    .map((item) => ({
      id: getString(item.approval_id, 'unknown'),
      decisionClass: getString(item.decision_class, 'unknown'),
      approvers: asArray(item.approvers).map((entry) => getString(entry)).filter(Boolean).join(', '),
      status: getString(item.status, 'unknown'),
      note: getString(item.note, 'n/a'),
      commandSignature: typeof item.command_signature === 'string' ? item.command_signature : null,
    }))

  return {
    summary: [
      { label: 'Approved', value: `${getNumber(summary?.approved_total, 0)}` },
      { label: 'Pending', value: `${getNumber(summary?.pending_total, 0)}` },
    ],
    approvals,
  }
}

function getArandurQueueWriteRequests(bundle: ArdaBundle): ArandurQueueWriteRequest[] {
  const runtime = asRecord(bundle.humanAugmentationRuntime)
  return asArray(runtime?.arandur_queue_write_requests ?? runtime?.queue_write_requests)
    .map((item) => asRecord(item))
    .filter((item): item is JsonRecord => item !== null)
    .map((item) => {
      const requestedEntry = asRecord(item.requested_queue_entry)
      const sourceFingerprints = asRecord(item.source_fingerprints)
      const boundedOutput = asRecord(item.bounded_output)
      const mutationPolicyRecord = asRecord(item.mutation_policy)
      const mutationPolicy = Object.fromEntries(
        Object.entries(mutationPolicyRecord ?? {})
          .map(([key, value]) => [key, getString(value, `${value}`)]),
      )
      return {
        id: getString(item.queue_write_request_id, 'unknown'),
        missionCandidateId: getString(item.source_mission_candidate_id, 'unknown'),
        queueProposalId: getString(item.source_queue_proposal_id, 'unknown'),
        title: getString(requestedEntry?.title, 'Untitled Arandur queue write'),
        scope: getString(requestedEntry?.scope, 'arandur'),
        justification: getString(item.justification, 'No justification provided'),
        createdAtUtc: getString(item.created_at_utc, 'unknown'),
        canonicalQueueSha1: getString(sourceFingerprints?.canonical_queue_sha1, 'unknown'),
        proposalSha1: getString(sourceFingerprints?.mission_queue_proposal_sha1, 'unknown'),
        reviewRequired: getBoolean(item.review_required, true),
        reviewChecklist: asArray(item.operator_write_checklist).map((entry) => getString(entry)).filter(Boolean),
        requiresFutureHumanApproval: getBoolean(boundedOutput?.requires_future_human_approval, true),
        requiresSeparateFutureCanonicalQueueWrite: getBoolean(boundedOutput?.requires_separate_future_canonical_queue_write, true),
        mutationPolicy,
        writePending: getBoolean(item.write_pending, false),
        executionStatus: getString(item.execution_status, getBoolean(item.write_pending, false) ? 'write_pending' : 'legacy_review'),
        canonicalQueueTaskId: typeof item.canonical_queue_task_id === 'string' ? item.canonical_queue_task_id : null,
      }
    })
}

function getReviewGateItems(bundle: ArdaBundle, queueWriteRequests: ArandurQueueWriteRequest[]): ReviewGateItem[] {
  const queueItems: ReviewGateItem[] = queueWriteRequests.map((request) => ({
    id: request.id,
    kind: 'queue_write',
    title: request.title,
    source: request.scope,
    status: request.executionStatus,
    decisionClass: 'arandur_queue_write',
    evidence: `${request.canonicalQueueSha1},${request.proposalSha1}`,
    summary: request.justification,
    checklist: request.reviewChecklist,
    createdAtUtc: request.createdAtUtc,
  }))

  const recommendationItems: ReviewGateItem[] = bundle.arandurRecommendations.map((entry) => {
    const candidate = asRecord(entry.candidate)
    const sources = asArray(candidate?.sources).map((source) => getString(source)).filter(Boolean)
    return {
      id: getString(entry.recommendation_id, 'unknown'),
      kind: 'recommendation',
      title: getString(candidate?.title, getString(entry.recommended_candidate_id, 'Untitled recommendation')),
      source: getString(entry.source, 'arandur'),
      status: getBoolean(entry.review_required, false) ? 'pending_review' : getString(candidate?.result ?? candidate?.status, 'recorded'),
      decisionClass: 'arandur_recommendation',
      evidence: getString(entry.source_packet, sources.slice(0, 2).join(',')),
      summary: getString(entry.recommended_action, 'Review Arandur recommendation before promotion.'),
      checklist: [
        'confirm source evidence still supports the recommendation',
        'confirm no canonical queue mutation is implied by approval alone',
        'confirm claims remain review-gated until implementation planning',
      ],
      createdAtUtc: getString(entry.ts_utc, ''),
    }
  })

  const missionItems: ReviewGateItem[] = bundle.arandurMissionApprovalRequests.map((entry) => {
    const boundedRecommendation = asRecord(entry.bounded_recommendation)
    const sourceFingerprints = asRecord(entry.source_fingerprints)
    return {
      id: getString(entry.approval_request_id, 'unknown'),
      kind: 'mission_approval',
      title: getString(boundedRecommendation?.title, getString(entry.approval_question, 'Untitled mission approval')),
      source: getString(boundedRecommendation?.scope, 'arandur'),
      status: getBoolean(entry.review_required, false) ? 'pending_review' : 'recorded',
      decisionClass: 'arandur_mission_approval',
      evidence: [
        getString(sourceFingerprints?.canonical_queue_sha1, ''),
        getString(sourceFingerprints?.mission_candidate_sha1, ''),
        getString(sourceFingerprints?.mission_review_sha1, ''),
      ].filter(Boolean).join(','),
      summary: getString(entry.approval_question, getString(entry.justification, 'Review mission approval request.')),
      checklist: asArray(entry.operator_approval_checklist).map((item) => getString(item)).filter(Boolean),
      createdAtUtc: getString(entry.created_at_utc, ''),
    }
  })

  const hadesItems: ReviewGateItem[] = bundle.hadesLifecycleReviewQueue.map((entry) => ({
    id: getString(entry.review_id, getString(entry.finding_id, 'unknown')),
    kind: 'hades_lifecycle',
    title: getString(entry.recommendation, 'HADES lifecycle review'),
    source: getString(entry.path, getString(entry.evidence_path, 'hades')),
    status: getBoolean(entry.review_required, false) ? 'pending_review' : getString(entry.classification, 'recorded'),
    decisionClass: 'hades_lifecycle_review',
    evidence: getString(entry.evidence_path, getString(entry.path, '')),
    summary: `${getString(entry.classification, 'review')} / ${getString(entry.severity, 'unknown')} severity`,
    checklist: asArray(entry.allowed_actions).map((item) => `allowed action: ${getString(item)}`).filter(Boolean),
    createdAtUtc: getString(entry.queued_at_utc, ''),
  }))

  const latestAthenaReadinessBySource = new Map<string, JsonRecord>()
  for (const entry of bundle.athenaPolicyReadiness) {
    const sourceId = getString(entry.source_id, '')
    if (!sourceId) continue
    const previous = latestAthenaReadinessBySource.get(sourceId)
    const previousTs = getString(previous?.ts_utc, '')
    const nextTs = getString(entry.ts_utc, '')
    if (!previous || nextTs.localeCompare(previousTs) >= 0) {
      latestAthenaReadinessBySource.set(sourceId, entry)
    }
  }

  const athenaItems: ReviewGateItem[] = [...latestAthenaReadinessBySource.values()]
    .filter((entry) => getString(entry.policy_readiness, 'reference_only') !== 'implementation_ready')
    .map((entry) => {
      const gate = asRecord(entry.gate)
      const observed = asRecord(gate?.observed)
      const blockers = asArray(gate?.blockers).map((item) => getString(item)).filter(Boolean)
      const sourceId = getString(entry.source_id, 'unknown')
      const confidence = getNumber(observed?.confidence, NaN)
      const confidenceLabel = Number.isFinite(confidence) ? `${Math.round(confidence * 100)}% confidence` : 'confidence unknown'
      const oppositionCoverage = getNumber(observed?.opposition_coverage, NaN)
      const oppositionLabel = Number.isFinite(oppositionCoverage) ? `${oppositionCoverage} opposition sources` : 'opposition coverage unknown'
      const triadPassed = getBoolean(observed?.triad_passed, false)

      return {
        id: sourceId,
        kind: 'athena_policy_readiness',
        title: `ATHENA source ${sourceId}`,
        source: 'athena',
        status: getString(entry.policy_readiness, 'reference_only'),
        decisionClass: 'athena_policy_readiness',
        evidence: blockers.length > 0 ? `${sourceId}:${blockers.join(',')}` : sourceId,
        summary: blockers.length > 0
          ? `Blocked by ${blockers.join(', ')}. Observed ${confidenceLabel}, ${oppositionLabel}, triad ${triadPassed ? 'passed' : 'not passed'}.`
          : `Ready for operator review. Observed ${confidenceLabel}, ${oppositionLabel}.`,
        checklist: [
          'confirm this source remains reference-only until blockers are resolved',
          ...blockers.map((blocker) => `resolve blocker: ${blocker}`),
          'confirm opposition or corroboration work exists before implementation promotion',
        ],
        createdAtUtc: getString(entry.ts_utc, ''),
      }
    })

  return [...queueItems, ...missionItems, ...recommendationItems, ...hadesItems, ...athenaItems]
    .filter((item) => item.id !== 'unknown')
    .sort((left, right) => (right.createdAtUtc ?? '').localeCompare(left.createdAtUtc ?? ''))
}

function getCeoCouncilRuntime(bundle: ArdaBundle): {
  summary: Array<{ label: string; value: string }>
  sessions: Array<{ id: string; objective: string; loopClass: string; decisionClass: string; outcomeStatus: string }>
  validators: Array<{ label: string; value: string }>
  memoryLanes: Array<{ label: string; value: string }>
} {
  const runtime = asRecord(bundle.ceoCouncilRuntime)
  const summary = asRecord(runtime?.summary)
  const sessions = asArray(runtime?.sessions)
    .map((item) => asRecord(item))
    .filter((item): item is JsonRecord => item !== null)
    .map((item) => ({
      id: getString(item.session_id, 'unknown'),
      objective: getString(item.objective, 'Untitled council session'),
      loopClass: getString(item.loop_class, 'lightweight'),
      decisionClass: getString(item.decision_class, 'unknown'),
      outcomeStatus: getString(item.outcome_status, 'open'),
    }))
  const validatorCounts = asRecord(summary?.validator_invocation_counts)
  const memoryLaneUsage = asRecord(summary?.memory_lane_usage)

  return {
    summary: [
      { label: 'Sessions', value: `${getNumber(summary?.total_sessions, 0)}` },
      { label: 'Triad', value: `${getNumber(summary?.triad_sessions, 0)}` },
      { label: 'Lightweight', value: `${getNumber(summary?.lightweight_sessions, 0)}` },
      { label: 'Escalations', value: `${getNumber(summary?.human_escalations, 0)}` },
      { label: 'Promoted Private', value: `${getNumber(summary?.promoted_private_memory_total, 0)}` },
    ],
    sessions,
    validators: Object.entries(validatorCounts ?? {})
      .map(([label, value]) => ({ label, value: `${getNumber(value, 0)}` }))
      .sort((left, right) => Number(right.value) - Number(left.value))
      .slice(0, 6),
    memoryLanes: Object.entries(memoryLaneUsage ?? {})
      .map(([label, value]) => ({ label, value: `${getNumber(value, 0)}` }))
      .sort((left, right) => Number(right.value) - Number(left.value))
      .slice(0, 6),
  }
}

function getTaskLifecycleRuntime(bundle: ArdaBundle): {
  summary: Array<{ label: string; value: string }>
  pipeline: string
  disposalCandidates: Array<{ id: string; title: string; owner: string; marker: string; nextPhase: string }>
} {
  const runtime = asRecord(bundle.taskLifecycleRuntime)
  const summary = asRecord(runtime?.summary)
  const contract = asRecord(runtime?.contract)
  const disposalCandidates = asArray(runtime?.disposal_candidates)
    .map((item) => asRecord(item))
    .filter((item): item is JsonRecord => item !== null)
    .map((item) => ({
      id: getString(item.id, 'unknown'),
      title: getString(item.title, 'Untitled task'),
      owner: getString(item.owner, 'unknown'),
      marker: getString(item.disposal_marker, '↝'),
      nextPhase: getString(item.next_phase, 'hades_disposal_review'),
    }))

  return {
    summary: [
      { label: 'Queued', value: `${getNumber(summary?.queued_total, 0)}` },
      { label: 'Active', value: `${getNumber(summary?.active_total, 0)}` },
      { label: 'Completed', value: `${getNumber(summary?.completed_total, 0)}` },
      { label: 'Disposal Review', value: `${getNumber(summary?.disposal_review_total, 0)}` },
      { label: 'Archive Ready', value: `${getNumber(summary?.archive_ready_total, 0)}` },
    ],
    pipeline: getString(contract?.pipeline, 'plan -> task_emission -> task_retrieval -> bounded_execution -> completion_evidence -> hades_disposal_review -> archive_or_retention'),
    disposalCandidates,
  }
}

function getFleetHealth(bundle: ArdaBundle) {
  const operator = getOperatorRuntimeSurface(bundle)
  const summary = asRecord(operator?.summary)
  const fleet = asRecord(operator?.fleet)
  const intentionalOfflineTargets = asArray(operator?.intentional_offline_targets)
    .map((target) => asRecord(target))
    .filter((target): target is JsonRecord => target !== null)
    .map((target) => ({
      displayName: getString(target.display_name, getString(target.target_id, 'unknown')),
      providerId: getString(target.provider_id, 'unknown'),
    }))
  const unexpectedOfflineTargets = asArray(operator?.unexpected_offline_targets)
    .map((target) => asRecord(target))
    .filter((target): target is JsonRecord => target !== null)
    .map((target) => ({
      displayName: getString(target.display_name, getString(target.target_id, 'unknown')),
      providerId: getString(target.provider_id, 'unknown'),
    }))

  return {
    totalTargets: getNumber(fleet?.targets_total, 0),
    liveTargets: getNumber(summary?.fleet_live_llm_nodes_total, 0),
    routableProviders: getNumber(summary?.fleet_routable_local_providers_total, 0),
    intentionalOffline: intentionalOfflineTargets.length,
    unexpectedOffline: getNumber(summary?.unexpected_offline_total, 0),
    intentionalOfflineTargets,
    unexpectedOfflineTargets,
  }
}

function getLaneOwnership(bundle: ArdaBundle) {
  const operator = getOperatorRuntimeSurface(bundle)
  const laneRoutes = asRecord(operator?.lane_routes)
  const labels: Record<string, string> = {
    interactive: 'Normal Chat',
    execution: 'High Code',
    background: 'Low Background',
  }
  return ['interactive', 'execution', 'background'].map((lane) => {
    const route = asRecord(laneRoutes?.[lane])
    return {
      lane,
      priority: labels[lane] ?? lane,
      route: route ? {
        providerId: getString(route.provider_id, 'unknown'),
        modelId: getString(route.model_id, 'unknown'),
        routeClass: getString(route.route_class, 'unknown'),
        reason: getString(route.reason, ''),
      } : null,
    }
  })
}

function getLaneHeadroom(bundle: ArdaBundle) {
  const operator = getOperatorRuntimeSurface(bundle)
  const laneHeadroom = asRecord(operator?.lane_headroom)
  const routableProviders = asArray(operator?.routable_providers)
    .map((provider) => asRecord(provider))
    .filter((provider): provider is JsonRecord => provider !== null)
  return routableProviders.map((provider) => {
    const providerId = getString(provider.provider_id, 'unknown')
    const softCaps = asRecord(provider.soft_caps)
    return {
      providerId,
      softCaps: {
        interactive: getNumber(softCaps?.interactive, 0),
        execution: getNumber(softCaps?.execution, 0),
        background: getNumber(softCaps?.background, 0),
      },
      laneHeadroom: {
        interactive: getNumber(asRecord(laneHeadroom?.interactive)?.[providerId], 0),
        execution: getNumber(asRecord(laneHeadroom?.execution)?.[providerId], 0),
        background: getNumber(asRecord(laneHeadroom?.background)?.[providerId], 0),
      },
    }
  })
}

function getLaneFitness(bundle: ArdaBundle) {
  const operator = getOperatorRuntimeSurface(bundle)
  const laneFitness = asRecord(operator?.lane_fitness)
  return Object.entries(laneFitness ?? {}).flatMap(([lane, providers]) => {
    const providerMap = asRecord(providers)
    return Object.entries(providerMap ?? {}).map(([providerId, state]) => {
      const record = asRecord(state)
      return {
        lane,
        providerId,
        avgLatencyMs: record ? getNumber(record.avg_latency_ms, NaN) : NaN,
        successCount: record ? getNumber(record.success_count, 0) : 0,
        failureCount: record ? getNumber(record.failure_count, 0) : 0,
      }
    })
  }).map((entry) => ({
    ...entry,
    avgLatencyMs: Number.isFinite(entry.avgLatencyMs) ? entry.avgLatencyMs : null,
  }))
}

function getRoutableProviderModels(provider: JsonRecord): RoutableProviderModel[] {
  return asArray(provider.models)
    .map((model) => {
      const modelRecord = asRecord(model)
      if (!modelRecord) {
        const id = getString(model)
        return id ? {
          id,
          contextWindow: null,
          healthy: true,
          isDefault: false,
          capableTasks: [],
        } : null
      }
      const contextWindow = getNumber(modelRecord.context_window, NaN)
      return {
        id: getString(modelRecord.id, 'unknown'),
        contextWindow: Number.isFinite(contextWindow) ? contextWindow : null,
        healthy: getBoolean(modelRecord.healthy, true),
        isDefault: getBoolean(modelRecord.is_default, false),
        capableTasks: asArray(modelRecord.capable_tasks).map((task) => getString(task)).filter(Boolean),
      }
    })
    .filter((model): model is RoutableProviderModel => model !== null)
}

function getProviderLatency(provider: JsonRecord): number | null {
  const latency = getNumber(provider.avg_latency_ms, NaN)
  return Number.isFinite(latency) ? latency : null
}

function getRoutableProviders(bundle: ArdaBundle): RoutableProviderEntry[] {
  const pressure = asRecord(bundle.charonRouter?.provider_pressure)
  const charonProviders = [
    ...asArray(pressure?.providers),
    ...(pressure?.local_fallback ? [pressure.local_fallback] : []),
  ]
    .map((provider) => asRecord(provider))
    .filter((provider): provider is JsonRecord => provider !== null)

  if (charonProviders.length > 0) {
    return charonProviders.map((provider) => ({
      providerId: getString(provider.id, 'unknown'),
      providerName: getString(provider.name, getString(provider.id, 'unknown')),
      accessTier: getString(provider.access_tier, 'unknown'),
      qualityBand: getString(provider.quality_band, 'unknown'),
      enabled: getBoolean(provider.enabled, false),
      healthy: getBoolean(provider.healthy, false),
      models: getRoutableProviderModels(provider),
      avgLatencyMs: getProviderLatency(provider),
      activeConnections: getNumber(provider.active_connections, 0),
    }))
  }

  const operator = getOperatorRuntimeSurface(bundle)
  return asArray(operator?.routable_providers)
    .map((provider) => asRecord(provider))
    .filter((provider): provider is JsonRecord => provider !== null)
    .map((provider) => {
      const providerId = getString(provider.provider_id, 'unknown')
      return {
        providerId,
        providerName: providerId,
        accessTier: 'operator_projection',
        qualityBand: 'unknown',
        enabled: true,
        healthy: true,
        models: getRoutableProviderModels(provider),
        avgLatencyMs: getProviderLatency(provider),
        activeConnections: getNumber(provider.active_connections, 0),
      }
    })
}

function getRuntimeDrift(bundle: ArdaBundle) {
  const runtimeDrift = asRecord(bundle.fleetRuntimeDrift)
  const items = asArray(runtimeDrift?.items)
    .map((entry) => asRecord(entry))
    .filter((entry): entry is JsonRecord => entry !== null)
    .map((entry) => {
      const drift = asRecord(entry.drift)
      return {
        nodeId: getString(entry.node_id, 'unknown'),
        displayName: getString(entry.display_name, getString(entry.node_id, 'unknown')),
        providerId: getString(entry.provider_id, ''),
        declaredModel: getString(entry.declared_model, ''),
        declaredContextWindow: Number.isFinite(getNumber(entry.declared_context_window, NaN))
          ? getNumber(entry.declared_context_window, NaN)
          : null,
        charonContextWindow: Number.isFinite(getNumber(entry.charon_context_window, NaN))
          ? getNumber(entry.charon_context_window, NaN)
          : null,
        actualProcessContextWindow: Number.isFinite(getNumber(entry.actual_process_context_window, NaN))
          ? getNumber(entry.actual_process_context_window, NaN)
          : null,
        declaredVsCharon: getBoolean(drift?.declared_vs_charon, false),
        declaredVsLocalProcess: getBoolean(drift?.declared_vs_local_process, false),
        localRuntimeStatus: getString(entry.local_runtime_status, ''),
      }
    })

  return {
    totalNodes: items.length,
    driftedNodes: items.filter((item) => item.declaredVsCharon || item.declaredVsLocalProcess).length,
    items,
  }
}

function getKnowledgeMap(bundle: ArdaBundle): {
  summary: Array<{ label: string; value: string }>
  entries: Array<{
    path: string
    title: string
    classification: string
    canonicalHome: string
    authority: string
    domain: string
    glyph: string
  }>
  digest: Array<{
    sourceId: string
    title: string
    status: string
    sourceType: string
    tags: string[]
    summary: string
  }>
  deepGraph: Array<{
    sourceId: string
    confidence: string
    triadPassed: boolean
    nodeCount: number
    edgeCount: number
    labels: string[]
  }>
  policyReadiness: Array<{
    sourceId: string
    readiness: string
    confidence: string
    blockers: string[]
    triadPassed: boolean
  }>
  policySummary: {
    status: string
    policyReadyTotal: number
    referenceOnlyTotal: number
    reviewPressureTotal: number
    nextOperatorAction: string
    promotionPreviewAvailable: boolean
    governanceGate: string
  }
  missingProjections: Array<{
    sectionId: string
    sectionTitle: string
    owner: string
    missing: string[]
  }>
} {
  const records = bundle.knowledgeTriage
  const counts = records.reduce<Record<string, number>>((acc, record) => {
    const classification = getString(record.classification, 'unknown')
    acc[classification] = (acc[classification] ?? 0) + 1
    return acc
  }, {})
  const priority = ['active', 'memory_seed', 'product_seed', 'delete_candidate', 'superseded', 'archive', 'reference']
  const summary = [
    { label: 'Total', value: `${records.length}` },
    ...priority
      .filter((classification) => counts[classification] !== undefined)
      .map((classification) => ({ label: classification, value: `${counts[classification]}` })),
    { label: 'Digest', value: `${bundle.athenaDigest.length}` },
    { label: 'Deep Graph', value: `${bundle.athenaDeepGraph.length}` },
    { label: 'Policy Readiness', value: `${bundle.athenaPolicyReadiness.length}` },
  ]
  const athenaPolicySummary = asRecord(bundle.athenaRuntime?.policy_readiness_summary)
  const policySummary = {
    status: getString(athenaPolicySummary?.status, 'unknown'),
    policyReadyTotal: getNumber(athenaPolicySummary?.policy_ready_total, 0),
    referenceOnlyTotal: getNumber(athenaPolicySummary?.reference_only_total, 0),
    reviewPressureTotal: getNumber(athenaPolicySummary?.review_pressure_total, 0),
    nextOperatorAction: getString(athenaPolicySummary?.next_operator_action, 'refresh_athena_digest'),
    promotionPreviewAvailable: getBoolean(athenaPolicySummary?.promotion_preview_available, false),
    governanceGate: getString(athenaPolicySummary?.governance_gate, 'human_review_required'),
  }
  const entries = records
    .filter((record) => getString(record.classification, '') !== 'delete_candidate')
    .slice(0, 10)
    .map((record) => {
      const soterion = asRecord(record.soterion)
      return {
        path: getString(record.path, 'unknown'),
        title: getString(record.title, getString(record.path, 'Untitled')),
        classification: getString(record.classification, 'unknown'),
        canonicalHome: getString(record.canonical_home, 'unknown'),
        authority: getString(record.authority, 'unknown'),
        domain: getString(record.domain, 'unknown'),
        glyph: getString(soterion?.glyph, primarySigilForSource('athena')),
      }
    })
  const digest = bundle.athenaDigest.slice(-10).reverse().map((record) => {
    const shallow = asRecord(record.shallow)
    const tags = asArray(shallow?.relevance_tags)
      .map((tag) => getString(tag, ''))
      .filter((tag) => tag.length > 0)
    return {
      sourceId: getString(record.source_id, getString(record.id, 'unknown')),
      title: getString(shallow?.title, getString(record.url, getString(record.event, 'ATHENA digest event'))),
      status: getString(record.digest_status, getString(record.status, getString(record.event, 'unknown'))),
      sourceType: getString(record.source_type, getString(record.agent, 'unknown')),
      tags,
      summary: getString(shallow?.summary, getString(record.reason, 'No digest summary available.')),
    }
  })
  const deepGraph = bundle.athenaDeepGraph.slice(-10).reverse().map((record) => {
    const nodes = asArray(record.nodes)
    const edges = asArray(record.edges)
    const labels = nodes
      .map((node) => asRecord(node))
      .filter((node): node is JsonRecord => node !== null)
      .map((node) => getString(node.label, getString(node.id, '')))
      .filter((label) => label.length > 0)
      .slice(0, 4)
    return {
      sourceId: getString(record.source_id, 'unknown'),
      confidence: formatMetric(getNumber(record.confidence, 0)),
      triadPassed: getBoolean(record.triad_passed, false),
      nodeCount: nodes.length,
      edgeCount: edges.length,
      labels,
    }
  })
  const policyReadiness = bundle.athenaPolicyReadiness.slice(-10).reverse().map((record) => {
    const gate = asRecord(record.gate)
    const observed = asRecord(gate?.observed)
    const blockers = asArray(gate?.blockers)
      .map((blocker) => getString(blocker, ''))
      .filter((blocker) => blocker.length > 0)
    return {
      sourceId: getString(record.source_id, getString(gate?.source_id, 'unknown')),
      readiness: getString(record.policy_readiness, 'unknown'),
      confidence: formatMetric(getNumber(observed?.confidence, 0)),
      blockers,
      triadPassed: getBoolean(observed?.triad_passed, false),
    }
  })
  const missingProjections = bundle.sections
    .filter((section) => (section.missing_projections ?? []).length > 0)
    .map((section) => ({
      sectionId: section.id,
      sectionTitle: section.title,
      owner: section.owner,
      missing: section.missing_projections ?? [],
    }))
  return { summary, entries, digest, deepGraph, policyReadiness, policySummary, missingProjections }
}

function getOperatingSurfaceReports(
  bundle: ArdaBundle,
  reviewGateItems: ReviewGateItem[],
  fleetHealth: ReturnType<typeof getFleetHealth>,
  knowledgeMap: ReturnType<typeof getKnowledgeMap>,
): OperatingSurfaceLaneReport[] {
  const hadesNightly = asRecord(bundle.hadesNightlyOperations)
  const hadesArtifacts = asRecord(hadesNightly?.artifacts)
  const hadesCommands = asRecord(hadesNightly?.commands)
  const hadesOrganization = asRecord(hadesCommands?.hades_organization_maintenance)
  const athenaCounts = asRecord(asRecord(bundle.athenaRuntime?.knowledge)?.counts)
  const businessCounts = asRecord(asRecord(bundle.businessRuntime)?.counts)
  const configProfiles = asArray(bundle.configWalkthroughProfiles?.profiles)
  const sourceMapSections = bundle.sections
  const missingProjectionCount = sourceMapSections.reduce((total, section) => total + (section.missing_projections?.length ?? 0), 0)
  const pendingReviewCount = reviewGateItems.filter((item) => item.status.includes('pending') || item.status.includes('review')).length
  const executionAllowed = bundle.automationStatus?.execution_allowed === true
  const hadesStatus = getString(hadesNightly?.status, 'missing')
  const athenaReferenceOnly = knowledgeMap.policySummary.referenceOnlyTotal || getNumber(athenaCounts?.reference_only_recent, bundle.athenaDigest.length)
  const athenaPolicyReady = knowledgeMap.policySummary.policyReadyTotal || getNumber(athenaCounts?.policy_ready_recent, 0)
  const candidatePreviewTotal = getString(hadesOrganization?.stdout_tail, '').match(/candidate_preview_total=(\d+)/)?.[1] ?? 'unknown'
  const brokenLocalLinks = getString(hadesOrganization?.stdout_tail, '').match(/broken_local_links=(\d+)/)?.[1] ?? 'unknown'

  return [
    {
      lane: 'Now',
      status: executionAllowed && pendingReviewCount === 0 ? 'partial' : 'gap',
      current: `Automation posture is ${bundle.automationStatus?.posture ?? 'unknown'} and ${pendingReviewCount} review items need attention.`,
      gap: 'The first screen is still assembled from modules instead of a single operator answer for mode, attention, active work, and safe action.',
      next: 'Promote this review plus executive, decisions, and health summaries into a dedicated Now command surface.',
      evidence: ['automationStatus.ts', 'ExecutiveOverviewModule.tsx', 'ReviewGateWorkstation.tsx'],
    },
    {
      lane: 'Work',
      status: hadesStatus === 'pass' ? 'partial' : 'gap',
      current: `HADES latest nightly is ${hadesStatus}; organization plan preview reports ${candidatePreviewTotal} candidates.`,
      gap: 'Planning, recurring jobs, scheduled operations, and manual run controls are split across Systems, Planning, and Operations panels.',
      next: 'Create a Work lane that lists daily/project queues, scheduled jobs, blocked jobs, receipts, and safe run controls.',
      evidence: ['core/state/hades_nightly_operations.json', 'Planning module', getString(hadesArtifacts?.organization_plan, 'organization plan missing')],
    },
    {
      lane: 'Decisions',
      status: reviewGateItems.length > 0 ? 'partial' : 'gap',
      current: `${reviewGateItems.length} review packets are projected from Arandur, HADES, and ATHENA sources.`,
      gap: 'Decision packets exist, but they are nested under Governance Controls and not exposed as a top-level human augmentation lane.',
      next: 'Make Decisions a top-level view with policy reason, consequence, delegation, and evidence per packet.',
      evidence: ['ArandurApprovalWorkstation.tsx', 'ReviewGateWorkstation.tsx', 'data/hades/lifecycle_review_queue.jsonl'],
    },
    {
      lane: 'Knowledge',
      status: bundle.athenaRuntime ? (knowledgeMap.policySummary.reviewPressureTotal > 0 ? 'partial' : 'ready') : 'gap',
      current: `ATHENA shows ${athenaPolicyReady} policy-ready items, ${athenaReferenceOnly} reference-only items, and policy status ${knowledgeMap.policySummary.status}.`,
      gap: 'Knowledge data is present but largely lives inside Systems; MNEMOSYNE continuity and human ingestion are not unified here yet.',
      next: `Next operator action: ${knowledgeMap.policySummary.nextOperatorAction}. Split Knowledge into research status, memory continuity, source freshness, conflicts, citations, and review queues.`,
      evidence: ['core/state/athena_runtime.json', 'data/athena/digest.jsonl', 'KnowledgeMapPanel.tsx'],
    },
    {
      lane: 'Health',
      status: fleetHealth.unexpectedOffline === 0 ? 'partial' : 'gap',
      current: `${fleetHealth.liveTargets}/${fleetHealth.totalTargets} fleet targets live, ${fleetHealth.routableProviders} routable providers, ${fleetHealth.unexpectedOffline} unexpected offline.`,
      gap: 'Provider mesh, Charon routing, Hermes, systemd, fleet, and drift are displayed as system panels rather than one health posture.',
      next: 'Make Health summarize runtime/service/provider state first, with drilldowns for routing ownership and drift.',
      evidence: ['SystemsModule.tsx', 'core/state/operator_runtime_status.json', 'core/state/charon_router.json'],
    },
    {
      lane: 'Business',
      status: bundle.businessRuntime ? 'partial' : 'gap',
      current: `Business runtime has ${getNumber(businessCounts?.client_records_total, 0)} client records and ${getNumber(businessCounts?.state_keys_total, 0)} state keys.`,
      gap: 'Business exists as a reserved/runtime module but does not yet connect active projects, economics, commitments, and readiness.',
      next: 'Expand Business around active projects, JouleWork accounting, risks, opportunities, and customer-facing readiness.',
      evidence: ['BusinessModule.tsx', 'core/state/business_runtime.json', 'src/lib/serviceLibraryBooks.ts'],
    },
    {
      lane: 'Evidence',
      status: missingProjectionCount === 0 ? 'partial' : 'gap',
      current: `${sourceMapSections.length} source-map sections loaded, ${missingProjectionCount} missing projections, ${brokenLocalLinks} broken local links in latest HADES check.`,
      gap: 'Provenance badges exist, but audit reports, receipts, source map, freshness, and known gaps are not one trust surface.',
      next: 'Create an Evidence lane with source map, receipts, audits, freshness, and validation status as first-class objects.',
      evidence: ['core/state/system_source_map.json', getString(hadesArtifacts?.markdown_link_check, 'markdown link check missing'), 'DataSourceDetailsPanel.tsx'],
    },
    {
      lane: 'Settings',
      status: configProfiles.length > 0 ? 'partial' : 'gap',
      current: `${configProfiles.length} guided config profiles are available; setup readiness state is ${bundle.setupConsoleReadiness ? 'loaded' : 'missing'}.`,
      gap: 'Settings contains configuration and monitor controls, but onboarding is not yet a guided first-run operating path.',
      next: 'Promote setup readiness, provider/API setup, governance defaults, service checks, repair actions, and exportable status.',
      evidence: ['SettingsModule.tsx', 'src/lib/configWalkthrough.ts', 'core/state/setup_console_readiness.json'],
    },
  ]
}

function readStoredModuleOrder(): ModuleId[] {
  try {
    const raw = window.localStorage.getItem(MODULE_STORAGE_KEY)
    if (!raw) return DEFAULT_MODULE_ORDER
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return DEFAULT_MODULE_ORDER
    const ordered = parsed.filter((item): item is ModuleId => DEFAULT_MODULE_ORDER.includes(item as ModuleId))
    return ordered.length === DEFAULT_MODULE_ORDER.length ? ordered : DEFAULT_MODULE_ORDER
  } catch {
    return DEFAULT_MODULE_ORDER
  }
}

function moveModule(order: ModuleId[], moduleId: ModuleId, direction: 'up' | 'down'): ModuleId[] {
  const index = order.indexOf(moduleId)
  if (index === -1) return order
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= order.length) return order
  const next = [...order]
  const [item] = next.splice(index, 1)
  next.splice(targetIndex, 0, item)
  return next
}

function sectionToPanelLayout(sectionId: string | null): ModuleId[] {
  if (!sectionId) return ['executive_overview', 'section_focus']
  return PANEL_LAYOUTS[sectionId] ?? ['section_focus', 'systems']
}

function formatSectionStatus(section: ArdaSection | null): string {
  if (!section) return 'No focus'
  return `${section.status} / ${section.owner}`
}

function formatPanelStatus(sectionId: string | null, section: ArdaSection | null): string {
  if (section) return formatSectionStatus(section)
  if (!sectionId) return 'No focus'
  if (sectionId === 'systems_health') return 'Fleet command / local mesh'
  if (sectionId === 'routing_health') return 'Charon router / lane command'
  if (sectionId === 'settings') return 'System settings / operator controls'
  return 'Focused workstation'
}

function formatProviderLabel(value: string | null | undefined): string {
  if (!value) return 'n/a'
  return value.split('_').join(' ')
}

function asModuleId(value: string | null | undefined): ModuleId | null {
  if (!value) return null
  return DEFAULT_MODULE_ORDER.includes(value as ModuleId) ? (value as ModuleId) : null
}

function titleForSectionOrPanel(sectionId: string | null, sections: ArdaSection[]): string {
  if (!sectionId) return 'Focused Panel'
  return sections.find((section) => section.id === sectionId)?.title ?? PANEL_TITLES[sectionId] ?? sectionId
}

export default function App() {
  const searchParams = new URLSearchParams(window.location.search)
  const currentWindowId = searchParams.get('__windowId') ?? 'main'
  const currentWindowRole = searchParams.get('__windowRole')
  const showCustomWindowControls = currentWindowRole !== 'workstation'
  const { closeWindow, minimizeWindow, toggleFullscreen, startDragging } = useArdaWindowControls(currentWindowId)
  const initialWorkstationId = searchParams.get('__workstation')
  const initialSectionId = searchParams.get('__section')
  const initialView = (searchParams.get('__view') as ViewMode | null) ?? 'boardroom'
  const [theme, setTheme] = useState<ThemeId>('gibson2')
  const [activeSectionId, setActiveSectionId] = useState<string | null>(initialSectionId)
  const [moduleOrder, setModuleOrder] = useState<ModuleId[]>(() => readStoredModuleOrder())
  const onBundleLoaded = useCallback((nextBundle: ArdaBundle) => {
    setActiveSectionId((current) => current ?? nextBundle.sections[0]?.id ?? null)
  }, [])
  const { bundle, error, isLoading, refreshBundle } = useArdaBundle({
    source,
    onLoaded: onBundleLoaded,
  })
  const {
    snapshot: charonLiveSnapshot,
    error: charonLiveError,
    isLoading: charonLiveLoading,
  } = useCharonLiveSnapshot(5000)
  const {
    assignments: boardroomSceneSlotAssignments,
    setAssignments: setBoardroomSceneSlotAssignments,
    surfaceLayouts: boardroomSurfaceLayouts,
    updateSurfaceLayout: updateBoardroomSurfaceLayout,
    mode: boardroomSlotAssignmentMode,
    message: boardroomSlotAssignmentMessage,
    saveStatus: boardroomSlotSaveStatus,
  } = useBoardroomSlotAssignments(bundle?.rootPath)
  const {
    assignments: worldSceneSurfaceAssignments,
    surfaceLayouts: worldSurfaceLayouts,
    updateSurfaceLayout: updateWorldSurfaceLayout,
    mode: worldSurfaceAssignmentMode,
    message: worldSurfaceAssignmentMessage,
    saveStatus: worldSurfaceSaveStatus,
  } = useWorldSurfaceAssignments(bundle?.rootPath)
  useArdaActionAdapters(bundle)
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>(initialView)
  const [derivedBusy, setDerivedBusy] = useState(false)
  const [approvalDecisionClass, setApprovalDecisionClass] = useState('provider_reroute')
  const [approvalApprovers, setApprovalApprovers] = useState('aurelius,bacon')
  const [approvalEvidence, setApprovalEvidence] = useState('arda-hud')
  const [approvalNote, setApprovalNote] = useState('ARDA HUD approval')
  const [approvalBusy, setApprovalBusy] = useState(false)
  const [approvalMessage, setApprovalMessage] = useState<string | null>(null)
  const [refreshActionBusyId, setRefreshActionBusyId] = useState<SystemActionId | null>(null)
  const [refreshActionMessage, setRefreshActionMessage] = useState<string | null>(null)
  const [councilObjective, setCouncilObjective] = useState('Stabilize CEO council ingress and memory discipline')
  const [councilLoopClass, setCouncilLoopClass] = useState('lightweight')
  const [councilDecisionClass, setCouncilDecisionClass] = useState('routine_maintenance')
  const [councilParticipants, setCouncilParticipants] = useState('arandur,warden,steward')
  const [councilProposals, setCouncilProposals] = useState('use discord ingress,record sessions to runtime')
  const [councilObjections, setCouncilObjections] = useState('')
  const [councilValidators, setCouncilValidators] = useState('joulework,love_equation')
  const [councilMemoryLanes, setCouncilMemoryLanes] = useState('ceo_private_working,shared_executive')
  const [councilMemoryWrites, setCouncilMemoryWrites] = useState('Discord ingress is canonical only via Annunimas state')
  const [councilSynthesis, setCouncilSynthesis] = useState('Proceed with Discord as ingress, keep Annunimas state canonical, promote validated conclusions only.')
  const [councilTriadRequired, setCouncilTriadRequired] = useState(false)
  const [councilHumanEscalated, setCouncilHumanEscalated] = useState(false)
  const [councilPromotedPrivateMemory, setCouncilPromotedPrivateMemory] = useState(false)
  const [councilBusy, setCouncilBusy] = useState(false)
  const [councilMessage, setCouncilMessage] = useState<string | null>(null)
  const [panelModeKey, setPanelModeKey] = useState<string | null>(null)
  const [transitionLabel, setTransitionLabel] = useState<string | null>(null)
  const liveRuntime = useArdaRuntimePulse()
  const [floatingWorkstations, setFloatingWorkstations] = useState<FloatingWorkstationState[]>([])
  const [workstationModuleById, setWorkstationModuleById] = useState<Record<string, ModuleId>>(() => {
    if (!initialWorkstationId) return {}
    const stored = getStoredWorkstationState(initialWorkstationId)
    const activeModuleId = asModuleId(stored?.activeModuleId)
    return activeModuleId ? { [initialWorkstationId]: activeModuleId } : {}
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    initWindowBridge()
  }, [])

  useEffect(() => {
    const handleWorkstationSync = (event: Event) => {
      const detail = (event as CustomEvent<WorkstationBridgeState>).detail
      if (!detail?.workstationId || detail.sourceWindowId === currentWindowId) return
      const activeModuleId = asModuleId(detail.activeModuleId)
      if (activeModuleId) {
        setWorkstationModuleById((current) => ({
          ...current,
          [detail.workstationId]: activeModuleId,
        }))
      }
      if (detail.presentationMode === 'native_window' && detail.sourceZoneId && initialWorkstationId === detail.workstationId) {
        setPanelModeKey(detail.sourceZoneId)
        setActiveSectionId(detail.sourceZoneId)
      }
    }
    window.addEventListener('workstation-sync', handleWorkstationSync)
    return () => window.removeEventListener('workstation-sync', handleWorkstationSync)
  }, [currentWindowId, initialWorkstationId])

  useEffect(() => {
    window.localStorage.setItem(MODULE_STORAGE_KEY, JSON.stringify(moduleOrder))
  }, [moduleOrder])

  const workstationManifests = useMemo(
    () => [
      ...(bundle?.workstationManifests ?? []),
      ...getSurfaceAdapterWorkstationManifests(),
    ],
    [bundle?.workstationManifests],
  )
  const boardroomMonitors = BOARDROOM_MONITOR_SLOT_IDS.map((slotId) => boardroomSceneSlotAssignments[slotId])

  const sceneSlotAssignmentOptions = useMemo(() => {
    const manifestOptions = workstationManifests
      .filter((manifest) => manifest.source_zone_id !== 'settings')
      .map((manifest) => ({
        id: manifest.source_zone_id,
        label: manifest.title.replace(/\s+Workstation$/, ''),
      }))
    const fallbackOptions = BOARDROOM_MONITOR_OPTIONS.filter((option) => (
      !manifestOptions.some((manifestOption) => manifestOption.id === option.id)
    ))
    return [
      { id: '', label: 'Placeholder' },
      ...manifestOptions,
      ...fallbackOptions,
    ]
  }, [workstationManifests])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewMode === 'world' || viewMode === 'panel') {
          runSceneTransition('Returning To Boardroom', 'boardroom')
        } else {
          toggleFullscreen()
        }
      }
      if (e.key === 'ArrowLeft' && (viewMode === 'world' || viewMode === 'panel')) {
        runSceneTransition('Returning To Boardroom', 'boardroom')
      }
      if (e.altKey && e.key === '1') {
        e.preventDefault()
        runSceneTransition('Entering Boardroom', 'boardroom')
      }
      if (e.altKey && e.key === '2') {
        e.preventDefault()
        runSceneTransition('Entering World Mode', 'world')
      }
      if (e.altKey && e.key === '3' && activeSectionId) {
        e.preventDefault()
        runSceneTransition('Opening Focused Panel', 'panel')
      }
      if (e.key === 'Tab' && !e.altKey && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault()
        const views: ViewMode[] = ['boardroom', 'world', 'panel']
        const currentIndex = views.indexOf(viewMode)
        const nextIndex = (currentIndex + 1) % views.length
        const nextView = views[nextIndex]
        const label = nextView === 'boardroom' ? 'Entering Boardroom' 
          : nextView === 'world' ? 'Entering World Mode'
          : 'Opening Focused Panel'
        if (nextView === 'panel' && !activeSectionId) {
          return
        }
        runSceneTransition(label, nextView)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [viewMode, activeSectionId, toggleFullscreen])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('__view', viewMode)
    if (activeSectionId) {
      url.searchParams.set('__section', activeSectionId)
    } else {
      url.searchParams.delete('__section')
    }
    window.history.replaceState({}, '', url.toString())
  }, [activeSectionId, viewMode])

  const activeSection = useMemo(
    () => getSectionById(bundle?.sections ?? [], activeSectionId),
    [bundle, activeSectionId],
  )
  const activeSceneZone = useMemo(
    () => getSceneZoneById(bundle?.sceneZones ?? [], activeSectionId),
    [bundle, activeSectionId],
  )
  const activeWorkstationManifest = useMemo(
    () => getWorkstationManifestByZoneId(workstationManifests, activeSectionId),
    [workstationManifests, activeSectionId],
  )

  const agents = useMemo(() => (bundle ? getAgents(bundle) : []), [bundle])
  const docs = useMemo(() => (bundle ? getHumanDocs(bundle) : []), [bundle])
  const notes = useMemo(() => (bundle ? getHumanNotes(bundle) : []), [bundle])
  const packages = useMemo(() => (bundle ? getPackageTools(bundle) : []), [bundle])
  const packageEnablement = useMemo(
    () => (bundle ? getPackageEnablement(bundle) : { summary: [], tools: [] }),
    [bundle],
  )
  const packageRuntimeActivation = useMemo(() => (bundle ? getPackageRuntimeActivation(bundle) : []), [bundle])
  const stores = useMemo(() => (bundle ? getStorageStores(bundle) : []), [bundle])
  const outputTopology = useMemo(
    () => (bundle ? getOutputTopology(bundle) : { surfaces: [], candidates: [], counts: { dataJsonl: 0, humanMarkdown: 0, historySnapshots: 0 } }),
    [bundle],
  )
  const outputAccounting = useMemo(
    () => (bundle ? getOutputAccounting(bundle) : { mirrorRoot: 'data/accounting/output_mirror', mode: 'mirror_only_non_destructive', summary: [], candidates: [] }),
    [bundle],
  )
  const governance = useMemo(
    () => (bundle ? getGovernanceSummary(bundle) : { ready: false, weights: [], thresholds: [] }),
    [bundle],
  )
  const autonomyReadiness = useMemo(
    () => (bundle ? getAutonomyReadinessSummary(bundle) : { posture: 'unknown', checkpoint: [], evidence: [], nextUnlocks: [] }),
    [bundle],
  )
  const governanceSignals = useMemo(() => (bundle ? getGovernanceRuntimeSignals(bundle) : []), [bundle])
  const operationsFlow = useMemo(() => (bundle ? getOperationsFlowSummary(bundle) : []), [bundle])
  const paperclipAlignment = useMemo(
    () => (bundle ? getPaperclipAlignment(bundle) : { summary: [], domains: [], tasks: [], evidence: [] }),
    [bundle],
  )
  const escalationRuntime = useMemo(() => (bundle ? getEscalationRuntime(bundle) : { summary: [], reasons: [] }), [bundle])
  const operatorActions = useMemo(() => (bundle ? getOperatorActions(bundle) : { summary: [], actions: [] }), [bundle])
  const storagePressure = useMemo(
    () => (bundle ? getStoragePressureSummary(bundle) : { summary: [], roots: [], candidates: [] }),
    [bundle],
  )
  const queueSummary = useMemo(
    () => (bundle ? getQueueSummary(bundle) : { completed: 0, priorities: [], owners: [] }),
    [bundle],
  )
  const operatorRuntime = useMemo(() => (bundle ? getOperatorRuntimeSurface(bundle) : null), [bundle])
  const humanAugmentation = useMemo(
    () => (bundle ? getHumanAugmentationRuntime(bundle) : { summary: [], approvals: [] }),
    [bundle],
  )
  const arandurQueueWriteRequests = useMemo(
    () => (bundle ? getArandurQueueWriteRequests(bundle) : []),
    [bundle],
  )
  const reviewGateItems = useMemo(
    () => (bundle ? getReviewGateItems(bundle, arandurQueueWriteRequests) : []),
    [bundle, arandurQueueWriteRequests],
  )
  const operatorCockpit = useMemo(
    () => (bundle ? getOperatorCockpitSurface(bundle, reviewGateItems) : {
      queue: { openTotal: 0, items: [] },
      humanGates: { blockedTotal: 0, items: [] },
      warden: { effectiveAttention: 0, rawAttention: 0, repeatedNoise: 0, activeRepairFiles: 0, resolvedRepairFiles: 0 },
      chronos: { runnerStatus: 'missing', readyTaskCount: 0, scheduledTaskCount: 0, dueTasks: [] },
      hermes: { gatewayReceiptCount: 0, dispatchReceiptCount: 0, latestReceipts: [] },
      athena: { policyReady: 0, referenceOnly: 0, implementationReady: 0, latest: [] },
      charon: {
        providerCount: 0,
        availableProviderCount: 0,
        blockedProviderCount: 0,
        cooldownCount: 0,
        budgetPressureCount: 0,
        toolContextFloor: 0,
        warnings: [],
      },
      autonomyGate: { decision: 'unknown', cleanupPacketCount: 0, externalSourceBlockedCount: 0, reasons: [] },
      storageHygiene: { status: 'missing', cleanupCandidateCount: 0, deletedBytes: 0, warnings: [] },
      ledgerGaps: [],
    }),
    [bundle, reviewGateItems],
  )
  const ceoCouncil = useMemo(
    () => (bundle ? getCeoCouncilRuntime(bundle) : { summary: [], sessions: [], validators: [], memoryLanes: [] }),
    [bundle],
  )
  const taskLifecycle = useMemo(
    () => (bundle ? getTaskLifecycleRuntime(bundle) : { summary: [], pipeline: '', disposalCandidates: [] }),
    [bundle],
  )
  const fleetHealth = useMemo(
    () => (bundle ? getFleetHealth(bundle) : {
      totalTargets: 0,
      liveTargets: 0,
      routableProviders: 0,
      intentionalOffline: 0,
      unexpectedOffline: 0,
      intentionalOfflineTargets: [],
      unexpectedOfflineTargets: [],
    }),
    [bundle],
  )
  const laneOwnership = useMemo(() => (bundle ? getLaneOwnership(bundle) : []), [bundle])
  const laneHeadroom = useMemo(() => (bundle ? getLaneHeadroom(bundle) : []), [bundle])
  const laneFitness = useMemo(() => (bundle ? getLaneFitness(bundle) : []), [bundle])
  const routableProviders = useMemo(() => (bundle ? getRoutableProviders(bundle) : []), [bundle])
  const runtimeDrift = useMemo(() => (bundle ? getRuntimeDrift(bundle) : { totalNodes: 0, driftedNodes: 0, items: [] }), [bundle])
  const mostConstrainedLane = useMemo(() => {
    const flattened = laneHeadroom.flatMap((provider) =>
      Object.entries(provider.laneHeadroom).map(([lane, headroom]) => ({
        providerId: provider.providerId,
        lane,
        headroom,
        softCap: provider.softCaps[lane] ?? 0,
      })),
    )
    return flattened.reduce((lowest, entry) => {
      if (!lowest || entry.headroom < lowest.headroom) return entry
      return lowest
    }, null as null | { providerId: string; lane: string; headroom: number; softCap: number })
  }, [laneHeadroom])
  const hottestProvider = useMemo(() => {
    return routableProviders.reduce((highest, provider) => {
      if (!highest || provider.activeConnections > highest.activeConnections) return provider
      return highest
    }, null as null | RoutableProviderEntry)
  }, [routableProviders])
  const dominantLaneFitness = useMemo(() => {
    type FitnessLeader = {
      lane: string
      providerId: string
      avgLatencyMs: number | null
      successCount: number
      failureCount: number
      score: number
    }
    return laneFitness.reduce<FitnessLeader | null>((best, entry) => {
      const score = entry.successCount - entry.failureCount
      if (!best || score > best.score) return { ...entry, score }
      return best
    }, null)
  }, [laneFitness])
  const planShelf = useMemo(
    () => (bundle ? getPlanShelf(bundle) : { humanPlanRoot: 'human/plans', corePlanRoot: 'core/projects/Plans', plans: [] }),
    [bundle],
  )
  const boardroomHudInstruments = useMemo(
    () => deriveBoardroomHudInstruments({
      fleetHealth: {
        liveTargets: fleetHealth.liveTargets,
        totalTargets: fleetHealth.totalTargets,
        routableProviders: fleetHealth.routableProviders,
        unexpectedOffline: fleetHealth.unexpectedOffline,
        intentionalOffline: fleetHealth.intentionalOffline,
        runtimeDrift,
      },
      queue: {
        completed: queueSummary.completed,
        priorityBuckets: queueSummary.priorities.length,
        ownerBuckets: queueSummary.owners.length,
      },
      knowledge: {
        documents: docs.length,
        plans: planShelf.plans.length,
      },
      routing: {
        routableProviders: routableProviders.length,
        activeConnections: hottestProvider?.activeConnections ?? 0,
        constrainedHeadroom: mostConstrainedLane?.headroom ?? null,
      },
    }),
    [docs.length, fleetHealth, hottestProvider, mostConstrainedLane, planShelf.plans.length, queueSummary, routableProviders.length, runtimeDrift],
  )
  const worldDistricts = useMemo(
    () =>
      (bundle?.sceneZones ?? [])
        .filter((zone) => zone.scene === 'world')
        .map((zone) => ({
          id: zone.id,
          label: zone.title,
          status: zone.status,
          owner: zone.owner,
        })),
    [bundle],
  )
  const boardroomSceneZones = useMemo(
    () => (bundle?.sceneZones ?? []).filter((zone) => zone.scene === 'boardroom'),
    [bundle],
  )
  const boardroomSceneAnchors = useMemo(
    () => (bundle?.sceneAnchors ?? []).filter((anchor) => anchor.scene === 'boardroom'),
    [bundle],
  )
  const worldSceneZones = useMemo(
    () => (bundle?.sceneZones ?? []).filter((zone) => zone.scene === 'world'),
    [bundle],
  )
  const worldRuntimeZones = useMemo(
    () => worldSceneZones.map((zone): SceneZoneDefinition => ({
      id: zone.id,
      title: zone.title,
      scene: zone.scene,
      owner: zone.owner,
      status: zone.status,
      anchorIds: zone.anchor_ids,
      surfaceIds: zone.surface_ids,
      workstationIds: zone.workstation_ids,
      sourceIds: zone.source_ids,
    })),
    [worldSceneZones],
  )
  const worldSceneAnchors = useMemo(
    () => (bundle?.sceneAnchors ?? []).filter((anchor) => anchor.scene === 'world'),
    [bundle],
  )
  const worldRuntimeAnchors = useMemo(
    () => worldSceneAnchors.map((anchor): SceneAnchorDefinition => ({
      id: anchor.id,
      scene: anchor.scene,
      type: anchor.type,
      label: anchor.label,
      zoneId: anchor.zone_id,
      activationBehavior: anchor.activation_behavior,
      dataBinding: anchor.data_binding,
    })),
    [worldSceneAnchors],
  )
  const worldDistrictUrgencies = useMemo(
    () => (bundle ? calculateWorldDistrictUrgencies(worldRuntimeZones, bundle) : {}),
    [bundle, worldRuntimeZones],
  )
  const worldTerminals = useMemo(
    () => [
      { code: 'TRM-QUEUE', detail: `Completed queue items ${queueSummary.completed}` },
      { code: 'TRM-TOOLS', detail: `Observed tool surfaces ${getNumber(asRecord(bundle?.packageHealth?.summary)?.tools_total, 0)}` },
      { code: 'TRM-STATUS', detail: `System posture ${getString(asRecord(bundle?.world?.system)?.status, 'READY')}` },
    ],
    [bundle, queueSummary.completed],
  )

  const worldSystem = asRecord(bundle?.world?.system)
  const worldMetrics = asRecord(bundle?.world?.metrics)
  const humanCounts = asRecord(asRecord(bundle?.humanContext?.human_portal)?.counts)
  const packageSummary = asRecord(bundle?.packageHealth?.summary)
  const storageAudit = asRecord(bundle?.storagePressure?.audit_storage_pressure)
  const businessRuntime = asRecord(bundle?.businessRuntime)
  const personalRuntime = asRecord(bundle?.personalRuntime)
  const primaryEntrypoint = getString(bundle?.sourceMap?.arda_primary_entrypoint_recommended, 'core/state/arda_snapshot.json')
  const toolsObserved = getNumber(packageSummary?.tools_total, 0)
  const oversizeFiles = getNumber(storageAudit?.oversize_files_gte_100mb, 0)
  const systemStatus = getString(worldSystem?.status, 'READY')

  const snapshotTag = provenanceTag(bundle?.snapshot, 'Snapshot')
  const sourceMapTag = provenanceTag(bundle?.sourceMap, 'Source Map')
  const humanTag = provenanceTag(bundle?.humanContext, 'Human Context')
  const businessTag = provenanceTag(bundle?.businessRuntime, 'Business Runtime')
  const personalTag = provenanceTag(bundle?.personalRuntime, 'Personal Runtime')
  const queueTag = provenanceTag(bundle?.queueSummary, 'Queue Summary')
  const governanceTag = provenanceTag(bundle?.governanceRuntime, 'Governance Runtime')
  const operationsTag = provenanceTag(bundle?.operationsFlow, 'Operations Flow')
  const operatorTag = provenanceTag(bundle?.operatorRuntimeStatus, 'Operator Status')
  const runtimeSettingsTag = provenanceTag(bundle?.runtimeSettings, 'Runtime Settings')
  const planMapTag = provenanceTag(bundle?.planMap, 'Plan Map')
  const knowledgeMap = bundle
    ? getKnowledgeMap(bundle)
    : {
      summary: [{ label: 'Total', value: '0' }],
      entries: [],
      digest: [],
      deepGraph: [],
      policyReadiness: [],
      policySummary: {
        status: 'unknown',
        policyReadyTotal: 0,
        referenceOnlyTotal: 0,
        reviewPressureTotal: 0,
        nextOperatorAction: 'refresh_athena_digest',
        promotionPreviewAvailable: false,
        governanceGate: 'human_review_required',
      },
      missingProjections: [],
    }
  const actionDescriptors = getSystemActionDescriptors()
  const actionCapabilityStatuses = getSystemActionCapabilityStatuses({
    chronosRuntime: bundle?.chronosRuntime,
    providerIntelligence: bundle?.providerIntelligence,
    queueSummary: bundle?.queueSummary,
    setupConsoleReadiness: bundle?.setupConsoleReadiness,
    hadesNightlyOperations: bundle?.hadesNightlyOperations,
    athenaRuntime: bundle?.athenaRuntime,
    knowledgeTriage: bundle?.knowledgeTriage,
  })
  const sourceMapSections = bundle?.sections ?? []
  const activeSectionCoverage = activeSection ? sourceCoverageForSections([activeSection]) : undefined
  const humanRealmCoverage = sourceCoverageForPanel(sourceMapSections, 'human_realm')
  const governanceControlsCoverage = sourceCoverageForPanel(sourceMapSections, 'governance_controls')
  const operationsAndPackagesCoverage = sourceCoverageForPanel(sourceMapSections, 'operations_and_packages')
  const planningCoverage = sourceCoverageForPanel(sourceMapSections, 'planning')
  const executiveOverviewCoverage = sourceCoverageForPanel(sourceMapSections, 'executive_overview')
  const businessCoverage = sourceCoverageForPanel(sourceMapSections, 'business')
  const personalGrowthCoverage = sourceCoverageForPanel(sourceMapSections, 'personal_growth')
  const activeServiceSurfaceManifest = getSurfaceAdapterManifest(panelModeKey ?? activeSectionId)
  const operatingSurfaceReports = bundle
    ? getOperatingSurfaceReports(bundle, reviewGateItems, fleetHealth, knowledgeMap)
    : []
  const commandConsoleSurface = bundle
    ? getCommandConsoleSurface(bundle, reviewGateItems)
    : null
  const operatingSurfaceReportByLane = Object.fromEntries(
    operatingSurfaceReports.map((report) => [report.lane, report]),
  ) as Partial<Record<OperatingSurfaceNavKey, OperatingSurfaceLaneReport>>
  const operatingSurfaceNavItems = OPERATING_SURFACE_NAV.map((item) => ({
    ...item,
    report: operatingSurfaceReportByLane[item.lane],
  }))
  const nowReport = operatingSurfaceReportByLane.Now
  const workReport = operatingSurfaceReportByLane.Work
  const decisionsReport = operatingSurfaceReportByLane.Decisions
  const healthReport = operatingSurfaceReportByLane.Health
  const liveRuntimeRailStatus = liveRuntime?.status?.toLowerCase() === 'healthy'
    ? 'healthy'
    : liveRuntime
      ? 'warning'
      : 'idle'

  const moduleRegistry: Record<ModuleId, { title: string; node: ReactNode }> = {
    operating_surface: {
      title: 'Operating Surface Review',
      node: (
        <div className="split-stack">
          <OperatingSurfacePlanModule
            reports={operatingSurfaceReports}
            actionDescriptors={actionDescriptors}
            capabilityStatuses={actionCapabilityStatuses}
            liveRuntime={liveRuntime}
            remoteConfidenceSnapshot={bundle?.remoteConfidenceSnapshot ?? null}
            safeLocalWorkCyclePreflight={bundle?.safeLocalWorkCyclePreflight ?? null}
            commandConsole={commandConsoleSurface}
            sourceCoverage={sourceCoverageForPanel(sourceMapSections, 'executive_overview')}
            tag={sourceMapTag}
            actionBusyId={refreshActionBusyId}
            actionMessage={refreshActionMessage}
            onRunRefreshAction={(actionId) => void submitRefreshAction(actionId)}
          />
          <WorldTerminalActionContractPanel
            actionDescriptors={actionDescriptors}
            capabilityStatuses={actionCapabilityStatuses}
            busyActionId={refreshActionBusyId}
            message={refreshActionMessage}
            onRunAction={(actionId) => void submitRefreshAction(actionId)}
          />
        </div>
      ),
    },
    executive_overview: {
      title: 'Executive Overview',
        node: (
          <ExecutiveOverviewModule
            authority={getString(bundle?.snapshot?.authority, 'arda_snapshot_projection')}
            loveEquation={formatMetric(getNumber(worldMetrics?.love_equation, 0))}
            activeTasks={formatMetric(getNumber(worldMetrics?.active_tasks, 0))}
            schemaVersion={getString(bundle?.snapshot?.schema_version, 'annunimas.core.state.v1')}
            sourceCoverage={executiveOverviewCoverage}
            tag={snapshotTag}
          />
        ),
    },
    section_focus: {
      title: activeSection?.title ?? 'Section Focus',
        node: (
          activeSection ? (
            <SectionFocusModule
              title={activeSection.title}
              eyebrow={activeSection.owner}
              accent={statusTone(activeSection.status)}
              status={activeSection.status}
              owner={activeSection.owner}
              panelCount={activeWorkstationManifest?.module_ids.length ?? activeSection.arda_panels.length}
              sourceCount={activeSceneZone?.source_ids.length ?? activeSection.primary_sources.length}
              panels={activeSection.arda_panels}
              primarySources={activeSection.primary_sources}
              sourceCoverage={activeSectionCoverage}
              sourceProvenance={bundle?.sourceProvenance ?? []}
              tag={sourceMapTag}
            />
          ) : (
          <ModuleCard title="Section Focus" eyebrow="No active section" accent="cyan">
            <div className="empty-state">No section available.</div>
          </ModuleCard>
        )
      ),
    },
    human_realm: {
      title: 'Human Realm',
        node: (
          <HumanRealmModule
            docs={docs}
            notes={notes}
            planShelf={planShelf}
            counts={{
              docs: getNumber(humanCounts?.docs_total, 0),
              notes: getNumber(humanCounts?.notes_total, 0),
              summaries: getNumber(humanCounts?.summaries_total, 0),
              arandur: getNumber(humanCounts?.arandur_docs_total, 0),
            }}
            sourceCoverage={humanRealmCoverage}
            sourceProvenance={bundle?.sourceProvenance ?? []}
            tag={humanTag}
          />
        ),
    },
    systems: {
      title: 'Systems',
        node: (
          <SystemsModule
            agents={agents.map((agent) => ({
              ...agent,
              trustScore: formatPercent(agent.trustScore),
            }))}
            fleetHealth={fleetHealth}
            laneOwnership={laneOwnership}
            laneHeadroom={laneHeadroom}
            laneFitness={laneFitness}
            routableProviders={routableProviders}
            charonLiveSnapshot={charonLiveSnapshot}
            charonLiveError={charonLiveError}
            charonLiveLoading={charonLiveLoading}
            storagePressure={bundle?.storagePressure ?? null}
            automationStatus={bundle?.automationStatus ?? null}
            setupConsoleReadiness={bundle?.setupConsoleReadiness ?? null}
            onboardingGuidedSession={bundle?.onboardingGuidedSession ?? null}
            onboardingPrivateConfigStage={bundle?.onboardingPrivateConfigStage ?? null}
            onboardingServicePlan={bundle?.onboardingServicePlan ?? null}
            auditReadiness={bundle?.auditReadiness ?? null}
            operatorCockpit={operatorCockpit}
            runtimeDrift={runtimeDrift}
            knowledgeMap={knowledgeMap}
            sourceCoverage={sourceCoverageForPanel(sourceMapSections, 'systems')}
            sourceProvenance={bundle?.sourceProvenance ?? []}
            actionDescriptors={actionDescriptors}
            capabilityStatuses={actionCapabilityStatuses}
            actionBusyId={refreshActionBusyId}
            actionMessage={refreshActionMessage}
            onRunAction={(actionId) => void submitRefreshAction(actionId)}
            tag={operatorTag}
          />
        ),
    },
    service_embed: {
      title: activeServiceSurfaceManifest?.title ?? 'Service Surface',
      node: (
        <ServiceEmbedModule manifest={activeServiceSurfaceManifest} />
      ),
    },
    media_library: {
      title: 'ARDA Media Library',
      node: (
        <MediaLibraryModule rootPath={bundle?.rootPath ?? null} />
      ),
    },
    governance_controls: {
      title: 'Governance Controls',
        node: (
          <ModuleCard
            title="Governance Controls"
            eyebrow="Adjustable weights"
            accent="ember"
            tag={governanceTag}
            actions={<SourceCoverageBadge coverage={governanceControlsCoverage} />}
          >
          <div className="split-stack">
            <div>
              <div className="module-subtitle"><Shield size={14} /> Weights</div>
              <LineList items={governance.weights.slice(0, 8).map((item) => ({ label: item.label, value: formatMetric(item.value) }))} />
            </div>
            <div>
              <div className="module-subtitle"><FolderKanban size={14} /> Thresholds</div>
              <LineList items={governance.thresholds.map((item) => ({ label: item.label, value: formatMetric(item.value) }))} />
            </div>
          </div>
          <div className="split-stack" style={{ marginTop: 16 }}>
            <div>
              <div className="module-subtitle"><Shield size={14} /> Human Augmentation</div>
              <LineList items={humanAugmentation.summary.map((item) => ({ label: item.label, value: item.value }))} />
              <div className="document-list compact" style={{ marginTop: 12 }}>
                {humanAugmentation.approvals.slice(0, 4).map((approval) => (
                  <article className="document-list__item" key={approval.id}>
                    <strong>{approval.decisionClass}</strong>
                    <span>{approval.approvers} / {approval.status}</span>
                    <p>{approval.note}</p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <div className="module-subtitle"><FolderKanban size={14} /> Issue Approval</div>
              <div style={{ display: 'grid', gap: 10 }}>
                <select
                  value={approvalDecisionClass}
                  onChange={(event) => setApprovalDecisionClass(event.target.value)}
                  className="rounded border border-[#334155] bg-[#0f1720] px-3 py-2 text-sm text-[#dbe7f3]"
                >
                  <option value="provider_reroute">provider_reroute</option>
                  <option value="strategy_change">strategy_change</option>
                  <option value="pricing_change">pricing_change</option>
                  <option value="customer_commitment">customer_commitment</option>
                  <option value="destructive_delete">destructive_delete</option>
                </select>
                <input
                  value={approvalApprovers}
                  onChange={(event) => setApprovalApprovers(event.target.value)}
                  placeholder="approvers: aurelius,bacon"
                  className="rounded border border-[#334155] bg-[#0f1720] px-3 py-2 text-sm text-[#dbe7f3]"
                />
                <input
                  value={approvalEvidence}
                  onChange={(event) => setApprovalEvidence(event.target.value)}
                  placeholder="evidence: ticket-123,boardroom-note"
                  className="rounded border border-[#334155] bg-[#0f1720] px-3 py-2 text-sm text-[#dbe7f3]"
                />
                <input
                  value={approvalNote}
                  onChange={(event) => setApprovalNote(event.target.value)}
                  placeholder="note"
                  className="rounded border border-[#334155] bg-[#0f1720] px-3 py-2 text-sm text-[#dbe7f3]"
                />
                <button
                  onClick={() => void submitHumanAugmentationApproval()}
                  disabled={approvalBusy}
                  className="rounded border border-[#ff9933] bg-[#ff9933]/10 px-3 py-2 text-sm font-semibold text-[#ffb86b] transition-colors hover:bg-[#ff9933]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {approvalBusy ? 'Recording...' : 'Record Approval'}
                </button>
                {approvalMessage ? <div className="text-[11px] text-[#b8c4d4]">{approvalMessage}</div> : null}
              </div>
            </div>
          </div>
          <div className="split-stack" style={{ marginTop: 16 }}>
            <div>
              <div className="module-subtitle"><Shield size={14} /> Autonomy Readiness</div>
              <LineList items={[
                { label: 'Posture', value: autonomyReadiness.posture },
                ...autonomyReadiness.checkpoint.slice(0, 4),
              ]} />
              <div className="document-list compact" style={{ marginTop: 12 }}>
                {autonomyReadiness.evidence.slice(0, 4).map((item) => (
                  <article className="document-list__item" key={`${item.phase}-${item.title}`}>
                    <strong>{item.phase} · {item.title}</strong>
                    <span>{item.status}</span>
                    <p>{item.source}</p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <div className="module-subtitle"><FolderKanban size={14} /> Next Unlocks</div>
              <div className="document-list compact">
                {autonomyReadiness.nextUnlocks.length > 0 ? autonomyReadiness.nextUnlocks.map((unlock) => (
                  <article className="document-list__item" key={unlock.title}>
                    <strong>{unlock.title}</strong>
                    <span>{unlock.status}</span>
                    <p>{unlock.requires || 'No additional requirements recorded.'}</p>
                  </article>
                )) : (
                  <article className="document-list__item">
                    <strong>No unlocks recorded</strong>
                    <p>Autonomy remains governed by the current checkpoint posture.</p>
                  </article>
                )}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <ReviewGateWorkstation
              approvals={humanAugmentation.approvals}
              items={reviewGateItems}
              busy={approvalBusy}
              message={approvalMessage}
              sourceProvenance={bundle?.sourceProvenance ?? []}
              decisionApprovers={approvalApprovers}
              onApprove={(item) => void submitReviewGateDecision(item, 'approved')}
              onReject={(item) => void submitReviewGateDecision(item, 'rejected')}
            />
          </div>
          <div className="split-stack" style={{ marginTop: 16 }}>
            <div>
              <div className="module-subtitle"><Sparkles size={14} /> CEO Council</div>
              <LineList items={ceoCouncil.summary.map((item) => ({ label: item.label, value: item.value }))} />
              <div className="document-list compact" style={{ marginTop: 12 }}>
                {ceoCouncil.sessions.length > 0 ? ceoCouncil.sessions.slice(0, 4).map((session) => (
                  <article className="document-list__item" key={session.id}>
                    <strong>{session.objective}</strong>
                    <span>{session.loopClass} / {session.decisionClass}</span>
                    <p>{session.outcomeStatus}</p>
                  </article>
                )) : (
                  <article className="document-list__item">
                    <strong>No council sessions yet</strong>
                    <p>Discord ingress and council recording are ready for first live sessions.</p>
                  </article>
                )}
              </div>
            </div>
            <div>
              <div className="module-subtitle"><BookOpenText size={14} /> Validator Garage</div>
              <LineList items={ceoCouncil.validators.length > 0 ? ceoCouncil.validators : [{ label: 'Pending', value: '0' }]} />
              <div className="module-subtitle" style={{ marginTop: 16 }}><UserRound size={14} /> Memory Lanes</div>
              <LineList items={ceoCouncil.memoryLanes.length > 0 ? ceoCouncil.memoryLanes : [{ label: 'Pending', value: '0' }]} />
            </div>
          </div>
          <div className="split-stack" style={{ marginTop: 16 }}>
            <div>
              <div className="module-subtitle"><FolderKanban size={14} /> Record Council Session</div>
              <div style={{ display: 'grid', gap: 10 }}>
                <input
                  value={councilObjective}
                  onChange={(event) => setCouncilObjective(event.target.value)}
                  placeholder="objective"
                  className="rounded border border-[#334155] bg-[#0f1720] px-3 py-2 text-sm text-[#dbe7f3]"
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <select
                    value={councilLoopClass}
                    onChange={(event) => setCouncilLoopClass(event.target.value)}
                    className="rounded border border-[#334155] bg-[#0f1720] px-3 py-2 text-sm text-[#dbe7f3]"
                  >
                    <option value="lightweight">lightweight</option>
                    <option value="triad">triad</option>
                  </select>
                  <select
                    value={councilDecisionClass}
                    onChange={(event) => setCouncilDecisionClass(event.target.value)}
                    className="rounded border border-[#334155] bg-[#0f1720] px-3 py-2 text-sm text-[#dbe7f3]"
                  >
                    <option value="routine_maintenance">routine_maintenance</option>
                    <option value="provider_reroute">provider_reroute</option>
                    <option value="strategy_change">strategy_change</option>
                    <option value="customer_commitment">customer_commitment</option>
                    <option value="destructive_delete">destructive_delete</option>
                  </select>
                </div>
                <input
                  value={councilParticipants}
                  onChange={(event) => setCouncilParticipants(event.target.value)}
                  placeholder="participants: arandur,warden,steward"
                  className="rounded border border-[#334155] bg-[#0f1720] px-3 py-2 text-sm text-[#dbe7f3]"
                />
                <input
                  value={councilProposals}
                  onChange={(event) => setCouncilProposals(event.target.value)}
                  placeholder="proposals: comma separated"
                  className="rounded border border-[#334155] bg-[#0f1720] px-3 py-2 text-sm text-[#dbe7f3]"
                />
                <input
                  value={councilObjections}
                  onChange={(event) => setCouncilObjections(event.target.value)}
                  placeholder="objections: comma separated"
                  className="rounded border border-[#334155] bg-[#0f1720] px-3 py-2 text-sm text-[#dbe7f3]"
                />
                <input
                  value={councilValidators}
                  onChange={(event) => setCouncilValidators(event.target.value)}
                  placeholder="validators: joulework,love_equation"
                  className="rounded border border-[#334155] bg-[#0f1720] px-3 py-2 text-sm text-[#dbe7f3]"
                />
                <input
                  value={councilMemoryLanes}
                  onChange={(event) => setCouncilMemoryLanes(event.target.value)}
                  placeholder="memory lanes: ceo_private_working,shared_executive"
                  className="rounded border border-[#334155] bg-[#0f1720] px-3 py-2 text-sm text-[#dbe7f3]"
                />
                <textarea
                  value={councilMemoryWrites}
                  onChange={(event) => setCouncilMemoryWrites(event.target.value)}
                  placeholder="memory writes: one per line, optionally lane:content"
                  rows={3}
                  className="rounded border border-[#334155] bg-[#0f1720] px-3 py-2 text-sm text-[#dbe7f3]"
                />
                <textarea
                  value={councilSynthesis}
                  onChange={(event) => setCouncilSynthesis(event.target.value)}
                  placeholder="synthesis"
                  rows={3}
                  className="rounded border border-[#334155] bg-[#0f1720] px-3 py-2 text-sm text-[#dbe7f3]"
                />
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#b8c4d4' }}>
                    <input type="checkbox" checked={councilTriadRequired} onChange={(event) => setCouncilTriadRequired(event.target.checked)} />
                    Triad required
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#b8c4d4' }}>
                    <input type="checkbox" checked={councilHumanEscalated} onChange={(event) => setCouncilHumanEscalated(event.target.checked)} />
                    Human escalated
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#b8c4d4' }}>
                    <input type="checkbox" checked={councilPromotedPrivateMemory} onChange={(event) => setCouncilPromotedPrivateMemory(event.target.checked)} />
                    Promoted private memory
                  </label>
                </div>
                <button
                  onClick={() => void submitCeoCouncilSession()}
                  disabled={councilBusy}
                  className="rounded border border-[#6ee7b7] bg-[#6ee7b7]/10 px-3 py-2 text-sm font-semibold text-[#9ff5ce] transition-colors hover:bg-[#6ee7b7]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {councilBusy ? 'Recording...' : 'Record Council Session'}
                </button>
                {councilMessage ? <div className="text-[11px] text-[#b8c4d4]">{councilMessage}</div> : null}
              </div>
            </div>
          </div>
        </ModuleCard>
      ),
    },
    hermes_dashboard: {
      title: 'Hermes Dashboard',
      node: (
        <HermesDashboardModule
          summary={packageEnablement.summary}
          tools={packageEnablement.tools}
          runtimeSurfaces={packageRuntimeActivation}
          auditReadiness={bundle?.auditReadiness ?? null}
          sourceProvenance={bundle?.sourceProvenance ?? []}
          tag="Hermes: ARDA native"
        />
      ),
    },
    operations_and_packages: {
      title: 'Operations And Packages',
        node: (
          <ModuleCard
            title="Operations And Packages"
            eyebrow="Dependency observation"
            accent="cyan"
            tag={operationsTag}
            actions={<SourceCoverageBadge coverage={operationsAndPackagesCoverage} />}
          >
          <div className="split-stack">
            <div>
              <div className="module-subtitle"><Bot size={14} /> Critical Tools</div>
              <div className="document-list compact">
                {packages.map((tool) => (
                  <article className="document-list__item" key={tool.tool}>
                    <strong>{tool.tool}</strong>
                    <span>{tool.repo}</span>
                    <p>{tool.status} / {tool.version}</p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <div className="module-subtitle"><Sparkles size={14} /> Enablement — live bundle or design intent</div>
              <LineList items={packageEnablement.summary.length > 0
                ? packageEnablement.summary.map((item) => ({ label: item.label, value: item.value }))
                : [{ label: 'Hermes registry', value: 'DESIGN INTENT — awaiting live tool registry adapter' }]}
              />
              <div className="document-list compact" style={{ marginTop: 12 }}>
                {(packageEnablement.tools.length > 0 ? packageEnablement.tools : [{
                  tool: 'Hermes capability registry',
                  lane: 'operator_tools',
                  state: 'planned',
                  readiness: 'DESIGN INTENT — not live registry data',
                  nextAction: 'replace with Hermes config/tool registry adapter',
                }]).slice(0, 4).map((tool) => (
                  <article className="document-list__item" key={`enable-${tool.tool}`}>
                    <strong>{tool.tool}</strong>
                    <span>{tool.lane} / {tool.state}</span>
                    <p>{tool.readiness} / {tool.nextAction}</p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <div className="module-subtitle"><TerminalSquare size={14} /> Runtime Activation — live bundle or design intent</div>
              <div className="document-list compact">
                {(packageRuntimeActivation.length > 0 ? packageRuntimeActivation : [{
                  tool: 'Hermes dashboard surface',
                  status: 'planned',
                  detail: 'DESIGN INTENT — live runtime status adapter pending',
                  ok: 'unknown',
                }]).map((tool) => (
                  <article className="document-list__item" key={`runtime-${tool.tool}`}>
                    <strong>{tool.tool}</strong>
                    <span>{tool.status} / {tool.ok}</span>
                    <p>{tool.detail}</p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <div className="module-subtitle"><Briefcase size={14} /> Storage</div>
              <div className="document-list compact">
                {stores.map((store) => (
                  <article className="document-list__item" key={store.path}>
                    <strong>{store.path.split('/').slice(-2).join('/')}</strong>
                    <span>{store.changed ? 'compacted' : 'stable'}</span>
                    <p>{Math.round(store.bytesAfter / 1024)} KB</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="split-stack" style={{ marginTop: 16 }}>
            <div>
              <div className="module-subtitle"><Activity size={14} /> Governance Runtime</div>
              <LineList items={governanceSignals.map((item) => ({ label: item.label, value: item.value }))} />
              <div className="token-cloud" style={{ marginTop: 12 }}>
                <span className="token-chip">JSONL {outputTopology.counts.dataJsonl}</span>
                <span className="token-chip">Human MD {outputTopology.counts.humanMarkdown}</span>
                <span className="token-chip">History {outputTopology.counts.historySnapshots}</span>
              </div>
            </div>
            <div>
              <div className="module-subtitle"><TerminalSquare size={14} /> Output Topology</div>
              <div className="document-list compact">
                {outputTopology.candidates.slice(0, 4).map((candidate) => (
                  <article className="document-list__item" key={candidate.path}>
                    <strong>{candidate.path}</strong>
                    <span>{candidate.priority} / {candidate.action}</span>
                    <p>{candidate.reason} / JW {formatMetric(candidate.estimatedJoulework)}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="module-subtitle"><Shield size={14} /> Operations Flow</div>
            <LineList items={operationsFlow.map((item) => ({ label: item.label, value: item.value }))} />
          </div>
          <div style={{ marginTop: 16 }}>
            <OperationsActionContractPanel
              actionDescriptors={actionDescriptors}
              capabilityStatuses={actionCapabilityStatuses}
              busyActionId={refreshActionBusyId}
              message={refreshActionMessage}
              onRunAction={(actionId) => void submitRefreshAction(actionId)}
            />
          </div>
          <div className="split-stack" style={{ marginTop: 16 }}>
            <div>
              <div className="module-subtitle"><Sparkles size={14} /> Paperclip Alignment</div>
              <LineList items={paperclipAlignment.summary.map((item) => ({ label: item.label, value: item.value }))} />
              <div className="token-cloud" style={{ marginTop: 12 }}>
                {paperclipAlignment.domains.map((item) => (
                  <span className="token-chip" key={item.label}>{item.label}: {item.value}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="module-subtitle"><BookOpenText size={14} /> Evidence State</div>
              <div className="document-list compact">
                {paperclipAlignment.evidence.slice(0, 6).map((item) => (
                  <article className="document-list__item" key={item.sourceId}>
                    <strong>{item.sourceId}</strong>
                    <span>{item.readiness}</span>
                    <p>confidence {item.confidence}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="module-subtitle"><FolderKanban size={14} /> Comparative Tasks</div>
            <div className="document-list compact">
              {paperclipAlignment.tasks.map((task) => (
                <article className="document-list__item" key={`${task.owner}-${task.title}`}>
                  <strong>{task.title}</strong>
                  <span>{task.owner}</span>
                  <p>{task.status}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="split-stack" style={{ marginTop: 16 }}>
            <div>
              <div className="module-subtitle"><Activity size={14} /> Escalation Runtime</div>
              <LineList items={escalationRuntime.summary.map((item) => ({ label: item.label, value: item.value }))} />
            </div>
            <div>
              <div className="module-subtitle"><Shield size={14} /> Reason Buckets</div>
              <LineList items={escalationRuntime.reasons.map((item) => ({ label: item.label, value: item.value }))} />
            </div>
          </div>
          <div className="split-stack" style={{ marginTop: 16 }}>
            <div>
              <div className="module-subtitle"><UserRound size={14} /> Human Needed</div>
              <LineList items={operatorActions.summary.map((item) => ({ label: item.label, value: item.value }))} />
            </div>
            <div>
              <div className="module-subtitle"><BookOpenText size={14} /> Action Queue</div>
              <div className="document-list compact">
                {operatorActions.actions.map((item) => (
                  <article className="document-list__item" key={`${item.owner}-${item.title}`}>
                    <strong>{item.title}</strong>
                    <span>{item.owner} / {item.status}</span>
                    <p>{item.note}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="split-stack" style={{ marginTop: 16 }}>
            <div>
              <div className="module-subtitle"><FolderKanban size={14} /> Output Accounting</div>
              <LineList items={outputAccounting.summary.map((item) => ({ label: item.label, value: item.value }))} />
              <div className="token-cloud" style={{ marginTop: 12 }}>
                <span className="token-chip">{outputAccounting.mode}</span>
                <span className="token-chip">{outputAccounting.mirrorRoot}</span>
              </div>
            </div>
            <div>
              <div className="module-subtitle"><Briefcase size={14} /> Mirror Results</div>
              <div className="document-list compact">
                {outputAccounting.candidates.slice(0, 4).map((candidate) => (
                  <article className="document-list__item" key={candidate.path}>
                    <strong>{candidate.path}</strong>
                    <span>{candidate.status}</span>
                    <p>{candidate.mirrorPath} / {candidate.bytes} MB / skip {candidate.skippedFiles} / gzip {candidate.compressedFiles}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="split-stack" style={{ marginTop: 16 }}>
            <div>
              <div className="module-subtitle"><Activity size={14} /> Storage Pressure</div>
              <LineList items={storagePressure.summary.map((item) => ({ label: item.label, value: item.value }))} />
            </div>
            <div>
              <div className="module-subtitle"><TerminalSquare size={14} /> Reclaim Candidates</div>
              <div className="document-list compact">
                {storagePressure.candidates.map((candidate) => (
                  <article className="document-list__item" key={candidate.path}>
                    <strong>{candidate.path}</strong>
                    <span>{candidate.action}</span>
                    <p>{candidate.bytes}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="module-subtitle"><Briefcase size={14} /> Workspace Roots</div>
            <div className="document-list compact">
              {storagePressure.roots.map((root) => (
                <article className="document-list__item" key={root.path}>
                  <strong>{root.path}</strong>
                  <span>{root.classification}</span>
                  <p>{root.bytes}</p>
                </article>
              ))}
            </div>
          </div>
        </ModuleCard>
      ),
    },
    planning: {
      title: 'Planning',
        node: (
          <ModuleCard
            title="Planning"
            eyebrow="Task ledger"
            accent="gold"
            tag={queueTag}
            actions={<SourceCoverageBadge coverage={planningCoverage} />}
          >
          <div className="split-stack">
            <div>
              <div className="module-subtitle"><FolderKanban size={14} /> Priority Load</div>
              <LineList items={queueSummary.priorities.map((item) => ({ label: item.label, value: `${item.value}` }))} />
            </div>
            <div>
              <div className="module-subtitle"><Sparkles size={14} /> Owner Spread</div>
              <LineList items={queueSummary.owners.map((item) => ({ label: item.label, value: `${item.value}` }))} />
            </div>
          </div>
          <QueueProvenancePanel records={bundle?.sourceProvenance ?? []} queueFederation={bundle?.queueFederation ?? null} />
          <PlanningActionContractPanel
            actionDescriptors={actionDescriptors}
            capabilityStatuses={actionCapabilityStatuses}
            busyActionId={refreshActionBusyId}
            message={refreshActionMessage}
            onRunAction={(actionId) => void submitRefreshAction(actionId)}
          />
          <div className="split-stack" style={{ marginTop: 16 }}>
            <div>
              <div className="module-subtitle"><BookOpenText size={14} /> Human Plan Shelf</div>
              <div className="document-list compact">
                <article className="document-list__item">
                  <strong>{planShelf.humanPlanRoot}</strong>
                  <p>Readable plan root for graph and operator thought.</p>
                </article>
                {planShelf.plans.slice(0, 3).map((plan) => (
                  <article className="document-list__item" key={`human-plan-${plan.id}`}>
                    <strong>{plan.title}</strong>
                    <span>{plan.humanPlanPath}</span>
                    <p>{plan.owner} / open tasks {plan.openTaskCount}</p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <div className="module-subtitle"><TerminalSquare size={14} /> Core Quick Refs</div>
              <div className="document-list compact">
                <article className="document-list__item">
                  <strong>{planShelf.corePlanRoot}</strong>
                  <p>Sovereign quick-reference root for runtime and task linkage.</p>
                </article>
                {planShelf.plans.slice(0, 3).map((plan) => (
                  <article className="document-list__item" key={`core-plan-${plan.id}`}>
                    <strong>{plan.owner}</strong>
                    <span>{plan.coreQuickRefPath}</span>
                    <p>{plan.title}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="split-stack" style={{ marginTop: 16 }}>
            <div>
              <div className="module-subtitle"><Activity size={14} /> Lifecycle Contract</div>
              <LineList items={taskLifecycle.summary.map((item) => ({ label: item.label, value: item.value }))} />
              <p style={{ marginTop: 12, fontSize: 12, lineHeight: 1.5, color: '#b8c4d4' }}>
                {taskLifecycle.pipeline}
              </p>
            </div>
            <div>
              <div className="module-subtitle"><TerminalSquare size={14} /> HADES Review Queue</div>
              <div className="document-list compact">
                {taskLifecycle.disposalCandidates.length > 0 ? taskLifecycle.disposalCandidates.slice(0, 5).map((candidate) => (
                  <article className="document-list__item" key={candidate.id}>
                    <strong>{candidate.title}</strong>
                    <span>{candidate.owner} / {candidate.nextPhase}</span>
                    <p>{candidate.marker} ready for disposal review</p>
                  </article>
                )) : (
                  <article className="document-list__item">
                    <strong>No disposal candidates</strong>
                    <p>Completed work marked with ↝ will surface here for HADES review.</p>
                  </article>
                )}
              </div>
            </div>
          </div>
        </ModuleCard>
      ),
    },
    learning_loop: {
      title: 'Learning Loop',
      node: <LearningLoopSurfaceWrapper tag={sourceMapTag} />,
    },
    business: {
      title: 'Business',
        node: (
          <BusinessModule
            mode={getString(businessRuntime?.mode, 'unknown')}
            clientCount={getNumber(asRecord(businessRuntime?.counts)?.client_records_total, 0)}
            stateKeyCount={getNumber(asRecord(businessRuntime?.counts)?.state_keys_total, 0)}
            companyViewTitle={getString(asRecord(businessRuntime?.company_view)?.title, 'Company View')}
            companyViewPreview={getString(asRecord(businessRuntime?.company_view)?.body_preview, 'Business readable context will appear here as the business layer matures.')}
            clientPaths={asArray(asRecord(businessRuntime?.highlights)?.client_paths).map((value) => getString(value)).filter(Boolean)}
            stateKeys={asArray(asRecord(businessRuntime?.highlights)?.state_keys).map((value) => getString(value)).filter(Boolean)}
            sourceCoverage={businessCoverage}
            sourceProvenance={bundle?.sourceProvenance ?? []}
            tag={businessTag}
          />
        ),
    },
    personal_growth: {
      title: 'Personal Growth',
        node: (
          <PersonalGrowthModule
            name={getString(asRecord(personalRuntime?.identity)?.name, 'Daniel')}
            role={getString(asRecord(personalRuntime?.identity)?.role, 'Founder / Principal')}
            location={getString(asRecord(personalRuntime?.identity)?.location, 'Unknown')}
            priorities={asArray(asRecord(personalRuntime?.highlights)?.priorities).map((value) => getString(value)).filter(Boolean)}
            values={asArray(asRecord(personalRuntime?.highlights)?.values).map((value) => getString(value)).filter(Boolean)}
            researchDomains={asArray(personalRuntime?.research_domains).map((value) => getString(value)).filter(Boolean)}
            creativeDomains={asArray(personalRuntime?.creative_domains).map((value) => getString(value)).filter(Boolean)}
            personalDocsTotal={getNumber(asRecord(personalRuntime?.counts)?.personal_docs_total, 0)}
            onboardPreview={getString(asRecord(personalRuntime?.onboard)?.body_preview, 'Personal and sovereign human context will appear here as the personal layer matures.')}
            sourceCoverage={personalGrowthCoverage}
            sourceProvenance={bundle?.sourceProvenance ?? []}
            tag={personalTag}
          />
        ),
    },
    culture_and_art: {
      title: 'Culture And Art',
      node: (
        <ModuleCard title="Culture And Art" eyebrow="Reserved module" accent="violet">
          <div className="document-list compact">
            <article className="document-list__item">
              <strong>Purpose</strong>
              <p>Creative systems, media, aesthetic references, and cultural memory will be surfaced here.</p>
            </article>
          </div>
        </ModuleCard>
      ),
    },
    settings: {
      title: 'Settings',
      node: (
        <SettingsModule
          theme={theme}
          editMode={editMode}
          viewMode={viewMode}
          themeOptions={THEMES}
          monitorAssignments={BOARDROOM_SCENE_SLOT_IDS.map((slotId) => {
            const sourceZoneId = boardroomSceneSlotAssignments[slotId]
            const adapter = getSurfaceAdapterManifest(sourceZoneId)
            const surfaceLayout = boardroomSurfaceLayouts[slotId]
            const isMonitor = BOARDROOM_MONITOR_SLOT_IDS.includes(slotId as typeof BOARDROOM_MONITOR_SLOT_IDS[number])
            return {
              slot: slotId,
              label: sceneSlotAssignmentOptions.find((option) => option.id === sourceZoneId)?.label ?? sourceZoneId,
              sourceZoneId,
              componentId: adapter?.id ?? `${sourceZoneId}_workstation`,
              role: isMonitor ? 'upper_monitor' as const : 'desk_surface' as const,
              adapterType: surfaceLayout?.adapter_type,
              previewMode: surfaceLayout?.preview.mode ?? 'component_grid',
              focusMode: surfaceLayout?.focus.mode ?? 'native_window',
              refreshMs: surfaceLayout?.preview.refresh_ms,
              widgetCount: surfaceLayout?.preview.widgets.length,
              embedUrl: surfaceLayout?.embed.url,
              surfaceLayout,
            }
          })}
          worldSurfaceAssignments={WORLD_SCENE_SURFACE_IDS.map((surfaceId) => {
            const sourceZoneId = worldSceneSurfaceAssignments[surfaceId]
            const surfaceLayout = worldSurfaceLayouts[surfaceId]
            const isTerminal = WORLD_TERMINAL_SURFACE_IDS.includes(surfaceId as typeof WORLD_TERMINAL_SURFACE_IDS[number])
            return {
              slot: surfaceId,
              label: surfaceId
                .split('_')
                .filter(Boolean)
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(' '),
              sourceZoneId,
              componentId: `${surfaceId}_surface`,
              role: isTerminal ? 'world_terminal' as const : 'world_district' as const,
              adapterType: surfaceLayout?.adapter_type,
              previewMode: surfaceLayout?.preview.mode,
              focusMode: surfaceLayout?.focus.mode,
              refreshMs: surfaceLayout?.preview.refresh_ms,
              widgetCount: surfaceLayout?.preview.widgets.length,
              embedUrl: surfaceLayout?.embed.url,
              surfaceLayout,
            }
          })}
          futureDomains={[
            { title: 'Business', status: 'reserved in module contract' },
            { title: 'Personal Growth', status: 'reserved in module contract' },
            { title: 'Culture And Art', status: 'reserved in module contract' },
          ]}
          configWalkthrough={bundle?.configWalkthroughProfiles ?? null}
          rootPath={bundle?.rootPath ?? null}
          onConfigApplied={() => void refreshBundle()}
          onUpdateSurfaceLayout={(slotId, updater) => updateBoardroomSurfaceLayout(slotId as typeof BOARDROOM_SCENE_SLOT_IDS[number], updater)}
          onUpdateWorldSurfaceLayout={(surfaceId, updater) => updateWorldSurfaceLayout(surfaceId as WorldSceneSurfaceId, updater)}
          onToggleEditMode={() => setEditMode((current) => !current)}
        />
      ),
    },
  }
  const moduleTitles = Object.fromEntries(
    (Object.entries(moduleRegistry) as Array<[ModuleId, { title: string; node: ReactNode }]>).map(([id, config]) => [id, config.title]),
  ) as Record<ModuleId, string>
  const panelLayout: ModuleId[] = panelModeKey === 'settings'
    ? ['settings']
    : sectionToPanelLayout(panelModeKey ?? activeSectionId)
  const activePanelModules = panelLayout.map((moduleId) => ({
    id: moduleId,
    title: moduleRegistry[moduleId].title,
    node: moduleRegistry[moduleId].node,
  }))
  const activePanelWorkstationManifest = initialWorkstationId
    ? getWorkstationManifestById(workstationManifests, initialWorkstationId)
    : getWorkstationManifestByZoneId(workstationManifests, panelModeKey ?? activeSectionId)
  const activePanelWorkstationId = activePanelWorkstationManifest?.id ?? initialWorkstationId ?? null

  const buildWorkstationModules = (manifest: ArdaWorkstationManifest | null) => {
    const sourceZoneId = manifest?.source_zone_id ?? null
    if (sourceZoneId === 'settings') {
      return [{
        id: 'settings' as ModuleId,
        title: moduleRegistry.settings.title,
        node: moduleRegistry.settings.node,
      }]
    }
    const layout = (manifest?.module_ids.length ? manifest.module_ids : sectionToPanelLayout(sourceZoneId))
      .filter((moduleId): moduleId is ModuleId => moduleId in moduleRegistry)
    return layout.map((moduleId) => ({
      id: moduleId,
      title: moduleRegistry[moduleId].title,
      node: moduleRegistry[moduleId].node,
    }))
  }
  const boardroomDeskSurfaces = {
    left: {
      label: 'Fleet Guard',
      title: `${fleetHealth.liveTargets}/${fleetHealth.totalTargets} live`,
      value: `${fleetHealth.routableProviders} routable / ${fleetHealth.unexpectedOffline} unexpected offline`,
      status: fleetHealth.unexpectedOffline > 0 ? 'attention' : 'stable',
      metrics: [
        { label: 'Live', value: `${fleetHealth.liveTargets}` },
        { label: 'Routable', value: `${fleetHealth.routableProviders}` },
        { label: 'Offline', value: `${fleetHealth.intentionalOffline}/${fleetHealth.unexpectedOffline}` },
      ],
      trace: [
        `UNEXPECTED :: ${fleetHealth.unexpectedOffline}`,
        `INTENTIONAL :: ${fleetHealth.intentionalOffline}`,
      ],
      tag: operatorTag,
    },
    right: {
      label: 'Charon Router',
      title: `${laneOwnership[0]?.route?.providerId ?? 'unassigned'} / ${laneOwnership[1]?.route?.providerId ?? 'unassigned'}`,
      value: `${laneOwnership[2]?.route?.providerId ?? 'unassigned'} background / ${laneFitness.length} learned lanes`,
      status: getBoolean(asRecord(operatorRuntime?.summary)?.charon_http_ok, false) ? 'online' : 'check',
      metrics: [
        { label: 'Chat', value: laneOwnership[0]?.route?.providerId ?? 'n/a' },
        { label: 'Code', value: laneOwnership[1]?.route?.providerId ?? 'n/a' },
        { label: 'Bg', value: laneOwnership[2]?.route?.providerId ?? 'n/a' },
      ],
      trace: [
        `FITNESS :: ${laneFitness.length}`,
        `MODE :: ${viewMode.toUpperCase()}`,
      ],
      tag: sourceMapTag,
    },
  }
  const consoleWidgets = [
    { label: 'Mode', value: editMode ? 'Edit' : 'Command' },
    { label: 'Fleet', value: `${fleetHealth.liveTargets}/${fleetHealth.totalTargets} Live` },
    {
      label: 'Pressure',
      value: mostConstrainedLane
        ? `${mostConstrainedLane.lane.toUpperCase()} ${Math.round(mostConstrainedLane.headroom * 100)}%`
        : 'No Data',
    },
  ]
  const consoleSwitches = [
    {
      label: 'Router',
      value: getBoolean(asRecord(operatorRuntime?.summary)?.charon_http_ok, false) ? 'ONLINE' : 'CHECK',
    },
    {
      label: 'Local Mesh',
      value: hottestProvider
        ? `${formatProviderLabel(hottestProvider.providerId).toUpperCase()} ${hottestProvider.activeConnections} INFLIGHT`
        : (fleetHealth.unexpectedOffline > 0 ? 'DEGRADED' : 'SYNCED'),
    },
    {
      label: 'Recovery',
      value: fleetHealth.unexpectedOfflineTargets[0]?.displayName ?? dominantLaneFitness?.providerId ?? 'CLEAR',
    },
  ]
  const consoleDials = [
    { label: 'Inspect', value: 'FLEET', hotspotId: 'systems_table' },
    { label: 'Route', value: 'CHARON', hotspotId: 'operations' },
    { label: 'Hermes', value: 'TOOLS', hotspotId: 'hermes_dashboard' },
    { label: 'Mesh', value: 'NETWORK', hotspotId: 'network' },
  ]
  const boardroomUpperMonitors = [
    ...boardroomMonitors.map((sectionId, index) => {
      if (sectionId === 'systems_health') {
      return {
        label: `Slot ${String.fromCharCode(65 + index)}`,
        title: 'Fleet Systems',
          detail: `${fleetHealth.liveTargets}/${fleetHealth.totalTargets} live / ${fleetHealth.routableProviders} routable`,
          status: fleetHealth.unexpectedOffline > 0 ? 'attention' : 'live',
          metrics: [
            { label: 'Live', value: `${fleetHealth.liveTargets}` },
            { label: 'Route', value: `${fleetHealth.routableProviders}` },
            { label: 'Off', value: `${fleetHealth.unexpectedOffline}` },
          ],
        trace: [
          `PLANNED :: ${fleetHealth.intentionalOffline}`,
          `RECOVERY :: ${fleetHealth.unexpectedOfflineTargets[0]?.displayName ?? 'CLEAR'}`,
        ],
        tag: operatorTag,
      }
      }
      if (sectionId === 'routing_health') {
      return {
        label: `Slot ${String.fromCharCode(65 + index)}`,
        title: 'Charon Routing',
          detail: `${laneOwnership[0]?.route?.providerId ?? 'unassigned'} / ${laneOwnership[1]?.route?.providerId ?? 'unassigned'}`,
          status: getBoolean(asRecord(operatorRuntime?.summary)?.charon_http_ok, false) ? 'live' : 'check',
          metrics: [
            { label: 'Chat', value: formatProviderLabel(laneOwnership[0]?.route?.providerId) },
            { label: 'Code', value: formatProviderLabel(laneOwnership[1]?.route?.providerId) },
            { label: 'Bg', value: formatProviderLabel(laneOwnership[2]?.route?.providerId) },
          ],
        trace: [
          `PRESSURE :: ${mostConstrainedLane ? `${mostConstrainedLane.lane} ${Math.round(mostConstrainedLane.headroom * 100)}%` : 'n/a'}`,
          `FITNESS :: ${dominantLaneFitness ? `${dominantLaneFitness.lane} -> ${dominantLaneFitness.providerId}` : 'learning'}`,
        ],
        tag: sourceMapTag,
      }
      }
      if (sectionId === 'human_realm') {
      return {
        label: `Slot ${String.fromCharCode(65 + index)}`,
        title: 'Human Realm',
          detail: `${getNumber(humanCounts?.docs_total, 0)} docs / ${getNumber(humanCounts?.notes_total, 0)} notes`,
          status: 'live',
          metrics: [
            { label: 'Docs', value: `${getNumber(humanCounts?.docs_total, 0)}` },
            { label: 'Notes', value: `${getNumber(humanCounts?.notes_total, 0)}` },
            { label: 'Arandur', value: `${getNumber(humanCounts?.arandur_docs_total, 0)}` },
          ],
        trace: docs.slice(0, 2).map((doc) => doc.title),
        tag: humanTag,
      }
      }
      if (sectionId === 'planning_and_queue') {
      return {
        label: `Slot ${String.fromCharCode(65 + index)}`,
        title: 'Planning',
          detail: `${queueSummary.completed} completed / ${queueSummary.priorities.length} priorities`,
          status: 'live',
          metrics: [
            { label: 'Done', value: `${queueSummary.completed}` },
            { label: 'Priorities', value: `${queueSummary.priorities.length}` },
            { label: 'Owners', value: `${queueSummary.owners.length}` },
          ],
        trace: queueSummary.owners.slice(0, 2).map((owner) => `${owner.label}:${owner.value}`),
        tag: queueTag,
      }
      }
      if (sectionId === 'business_ops') {
      return {
        label: `Slot ${String.fromCharCode(65 + index)}`,
        title: 'Business',
          detail: `${getString(businessRuntime?.mode, 'unknown')} / ${getNumber(asRecord(businessRuntime?.counts)?.client_records_total, 0)} client records`,
          status: 'ready',
          metrics: [
            { label: 'Clients', value: `${getNumber(asRecord(businessRuntime?.counts)?.client_records_total, 0)}` },
            { label: 'Keys', value: `${getNumber(asRecord(businessRuntime?.counts)?.state_keys_total, 0)}` },
            { label: 'Mode', value: getString(businessRuntime?.mode, 'unknown') },
          ],
        trace: asArray(asRecord(businessRuntime?.highlights)?.client_paths)
          .map((value) => getString(value))
          .filter(Boolean)
          .slice(0, 2),
        tag: businessTag,
      }
      }
      if (sectionId === 'personal_growth') {
      return {
        label: `Slot ${String.fromCharCode(65 + index)}`,
        title: 'Personal',
          detail: `${getString(asRecord(personalRuntime?.identity)?.name, 'Daniel')} / ${getNumber(asRecord(personalRuntime?.counts)?.personal_docs_total, 0)} docs`,
          status: 'ready',
          metrics: [
            { label: 'Docs', value: `${getNumber(asRecord(personalRuntime?.counts)?.personal_docs_total, 0)}` },
            { label: 'Research', value: `${getNumber(asRecord(personalRuntime?.counts)?.research_domains_total, 0)}` },
            { label: 'Creative', value: `${getNumber(asRecord(personalRuntime?.counts)?.creative_domains_total, 0)}` },
          ],
        trace: asArray(asRecord(personalRuntime?.highlights)?.priorities)
          .map((value) => getString(value))
          .filter(Boolean)
          .slice(0, 2),
        tag: personalTag,
      }
      }

      const section = bundle?.sections.find((candidate) => candidate.id === sectionId) ?? null
      const zone = bundle?.sceneZones.find((candidate) => candidate.id === sectionId) ?? null
      const workstationManifest =
        workstationManifests.find((candidate) => candidate.source_zone_id === sectionId) ?? null
      return {
        label: `Slot ${String.fromCharCode(65 + index)}`,
        title: section?.title ?? 'Unassigned',
        detail: formatSectionStatus(section),
        status: section?.status ?? 'idle',
        metrics: [
          { label: 'Workstation', value: `${workstationManifest?.module_ids.length ?? section?.arda_panels.length ?? 0}` },
          { label: 'Sources', value: `${zone?.source_ids.length ?? section?.primary_sources.length ?? 0}` },
          { label: 'Owner', value: section?.owner ?? 'none' },
        ],
        trace: (workstationManifest?.module_ids ?? section?.arda_panels ?? []).slice(0, 2),
        tag: sourceMapTag,
      }
    }),
  ]
  const regenerateDerivedState = async () => {
    setDerivedBusy(true)
    try {
      await refreshBundle()
    } finally {
      setDerivedBusy(false)
    }
  }

  const submitRefreshAction = async (actionId: SystemActionId) => {
    setRefreshActionBusyId(actionId)
    setRefreshActionMessage(null)
    try {
      const result = await executeSystemAction(actionId, {
        source: 'external',
        persona: 'frankyrache',
        mood: 'deploying',
        payload: {
          requested_from: 'arda_operating_surface_refresh_action_flow',
        },
      })
      setRefreshActionMessage(result.ok ? `${actionId} refreshed via ${result.provider}` : `${actionId} failed: ${result.message}`)
      if (result.ok) {
        refreshBundle()
      }
    } finally {
      setRefreshActionBusyId(null)
    }
  }

  const submitReviewGateDecision = async (item: ReviewGateItem, status: 'approved' | 'rejected') => {
    setApprovalBusy(true)
    setApprovalMessage(null)
    const decisionRecord = buildReviewGateDecisionRecordPreview(item, approvalApprovers)
    try {
      const result = await executeSystemAction('approve_human_augmentation', {
        source: 'external',
        persona: 'frankyrache',
        mood: status === 'approved' ? 'success' : 'warning',
        payload: {
          numenor_path: bundle?.rootPath,
          decision_class: decisionRecord.decisionClass,
          command_signature: decisionRecord.commandSignature,
          approvers: decisionRecord.approvers,
          evidence: decisionRecord.evidence,
          note: status === 'approved' ? decisionRecord.approvalNote : decisionRecord.rejectionNote,
          status,
        },
      })
      setApprovalMessage(result.ok ? `${status} ${item.id} via ${result.provider}` : `Review gate decision failed: ${result.message}`)
      if (result.ok) {
        refreshBundle()
      }
    } finally {
      setApprovalBusy(false)
    }
  }

  const submitHumanAugmentationApproval = async () => {
    setApprovalBusy(true)
    setApprovalMessage(null)
    try {
      const result = await executeSystemAction('approve_human_augmentation', {
        source: 'external',
        persona: 'frankyrache',
        mood: 'success',
        payload: {
          numenor_path: bundle?.rootPath,
          decision_class: approvalDecisionClass,
          approvers: approvalApprovers,
          evidence: approvalEvidence,
          note: approvalNote,
        },
      })
      setApprovalMessage(result.ok ? `Recorded via ${result.provider}` : `Approval failed: ${result.message}`)
      if (result.ok) {
        refreshBundle()
      }
    } finally {
      setApprovalBusy(false)
    }
  }

  const submitCeoCouncilSession = async () => {
    setCouncilBusy(true)
    setCouncilMessage(null)
    try {
      const result = await executeSystemAction('record_ceo_council_session', {
        source: 'external',
        persona: 'frankyrache',
        mood: 'success',
        payload: {
          numenor_path: bundle?.rootPath,
          objective: councilObjective,
          loop_class: councilLoopClass,
          decision_class: councilDecisionClass,
          participants: councilParticipants,
          proposals: councilProposals,
          objections: councilObjections,
          validators: councilValidators,
          memory_lanes: councilMemoryLanes,
          memory_writes: councilMemoryWrites,
          synthesis: councilSynthesis,
          triad_required: councilTriadRequired,
          human_escalated: councilHumanEscalated,
          promoted_private_memory: councilPromotedPrivateMemory,
        },
      })
      setCouncilMessage(result.ok ? `Recorded via ${result.provider}` : `Council session failed: ${result.message}`)
      if (result.ok) {
        refreshBundle()
      }
    } finally {
      setCouncilBusy(false)
    }
  }

  const openWorkstationWindow = (manifest: ArdaWorkstationManifest | null) => {
    if (!manifest) return
    const activeModuleId = workstationModuleById[manifest.id] ?? manifest.module_ids[0] ?? null
    syncWorkstationState({
      workstationId: manifest.id,
      sourceZoneId: manifest.source_zone_id,
      originAnchorId: manifest.entry_anchor_id,
      presentationMode: 'native_window',
      activeModuleId: activeModuleId ?? undefined,
      sourceWindowId: currentWindowId,
    })
    const url = new URL(window.location.href)
    url.searchParams.set('__view', 'panel')
    url.searchParams.set('__section', manifest.source_zone_id)
    url.searchParams.set('__workstation', manifest.id)
    url.searchParams.set('__anchor', manifest.entry_anchor_id)
    windowManager.open({
      id: `arda-workstation-${manifest.id}`,
      title: `ARDA Workstation — ${manifest.title}`,
      width: 1440,
      height: 900,
      position: 'center',
      url: url.toString(),
      windowRole: 'workstation',
      workstationId: manifest.id,
      sourceZoneId: manifest.source_zone_id,
      originAnchorId: manifest.entry_anchor_id,
      presentationMode: 'native_window',
    })
  }

  const spawnFloatingWorkstation = (zoneId: string | null) => {
    const manifest = getWorkstationManifestByZoneId(workstationManifests, zoneId)
    if (!manifest) return
    setActiveSectionId(manifest.source_zone_id)
    setPanelModeKey(manifest.source_zone_id)
    setViewMode('boardroom')
    setFloatingWorkstations((current) => {
      const existing = current.find((entry) => entry.manifestId === manifest.id)
      const nextZ = current.reduce((max, item) => Math.max(max, item.zIndex), FLOATING_WORKSTATION_BASE_Z_INDEX) + 1
      if (existing) {
        syncWorkstationState({
          workstationId: manifest.id,
          sourceZoneId: manifest.source_zone_id,
          originAnchorId: manifest.entry_anchor_id,
          presentationMode: 'in_scene',
          activeModuleId: workstationModuleById[manifest.id] ?? manifest.module_ids[0] ?? undefined,
          layout: { zIndex: nextZ },
          sourceWindowId: currentWindowId,
        })
        return current.map((entry) => entry.manifestId === manifest.id ? { ...entry, zIndex: nextZ } : entry)
      }

      const centeredLayout = getFloatingWorkstationCenteredLayout()
      const nextEntry = {
        id: `scene-${manifest.id}`,
        manifestId: manifest.id,
        sourceZoneId: manifest.source_zone_id,
        originAnchorId: manifest.entry_anchor_id,
        title: manifest.title,
        presentationMode: 'in_scene' as const,
        ...centeredLayout,
        zIndex: nextZ,
      }
      syncWorkstationState({
        workstationId: nextEntry.manifestId,
        sourceZoneId: nextEntry.sourceZoneId,
        originAnchorId: nextEntry.originAnchorId,
        presentationMode: 'in_scene',
        activeModuleId: workstationModuleById[nextEntry.manifestId] ?? manifest.module_ids[0] ?? undefined,
        layout: {
          x: nextEntry.x,
          y: nextEntry.y,
          width: nextEntry.width,
          height: nextEntry.height,
          zIndex: nextEntry.zIndex,
        },
        sourceWindowId: currentWindowId,
      })
      return [
        ...current,
        nextEntry,
      ]
    })
  }

  const tileFloatingWorkstations = () => {
    setFloatingWorkstations((current) => {
      const tiled = current.map((entry, index) => {
        const layout = getFloatingWorkstationTileLayout(index, current.length)
        return {
          ...entry,
          ...layout,
          zIndex: Math.max(entry.zIndex, FLOATING_WORKSTATION_BASE_Z_INDEX + index + 1),
        }
      })
      tiled.forEach((entry) => {
        const manifest = getWorkstationManifestById(workstationManifests, entry.manifestId)
        syncWorkstationState({
          workstationId: entry.manifestId,
          sourceZoneId: entry.sourceZoneId,
          originAnchorId: entry.originAnchorId,
          presentationMode: 'in_scene',
          activeModuleId: workstationModuleById[entry.manifestId] ?? manifest?.module_ids[0] ?? undefined,
          layout: {
            x: entry.x,
            y: entry.y,
            width: entry.width,
            height: entry.height,
            zIndex: entry.zIndex,
          },
          sourceWindowId: currentWindowId,
        })
      })
      return tiled
    })
  }

  const handleBoardroomMonitorOpen = (monitorId: string) => {
    if (monitorId === 'desk-left') {
      spawnFloatingWorkstation('systems_health')
      return
    }
    if (monitorId === 'desk-right') {
      spawnFloatingWorkstation('routing_health')
      return
    }
    if (monitorId.startsWith('upper-')) {
      const index = Number.parseInt(monitorId.replace('upper-', ''), 10)
      const sectionId = boardroomMonitors[index] ?? null
      if (sectionId) {
        spawnFloatingWorkstation(sectionId)
      }
    }
  }

  const focusFloatingWorkstation = (id: string) => {
    setFloatingWorkstations((current) => {
      const nextZ = current.reduce((max, item) => Math.max(max, item.zIndex), FLOATING_WORKSTATION_BASE_Z_INDEX) + 1
      const workstation = current.find((entry) => entry.id === id)
      if (workstation) {
        syncWorkstationState({
          workstationId: workstation.manifestId,
          sourceZoneId: workstation.sourceZoneId,
          originAnchorId: workstation.originAnchorId,
          presentationMode: workstation.presentationMode,
          activeModuleId: workstationModuleById[workstation.manifestId],
          layout: { zIndex: nextZ },
          sourceWindowId: currentWindowId,
        })
      }
      return current.map((entry) => entry.id === id ? { ...entry, zIndex: nextZ } : entry)
    })
  }

  const moveFloatingWorkstation = (id: string, x: number, y: number) => {
    setFloatingWorkstations((current) =>
      current.map((entry) => {
        if (entry.id !== id) return entry
        const next = {
          ...entry,
          x: Math.max(24, Math.min(x, window.innerWidth - entry.width - 24)),
          y: Math.max(24, Math.min(y, window.innerHeight - entry.height - 24)),
        }
        syncWorkstationState({
          workstationId: next.manifestId,
          sourceZoneId: next.sourceZoneId,
          originAnchorId: next.originAnchorId,
          presentationMode: next.presentationMode,
          activeModuleId: workstationModuleById[next.manifestId],
          layout: { x: next.x, y: next.y, width: next.width, height: next.height, zIndex: next.zIndex },
          sourceWindowId: currentWindowId,
        })
        return next
      }),
    )
  }

  const resizeFloatingWorkstation = (id: string, width: number, height: number) => {
    setFloatingWorkstations((current) =>
      current.map((entry) => {
        if (entry.id !== id) return entry
        const next = {
          ...entry,
          width: Math.max(300, Math.min(width, window.innerWidth - entry.x - 48)),
          height: Math.max(200, Math.min(height, window.innerHeight - entry.y - 48)),
        }
        syncWorkstationState({
          workstationId: next.manifestId,
          sourceZoneId: next.sourceZoneId,
          originAnchorId: next.originAnchorId,
          presentationMode: next.presentationMode,
          activeModuleId: workstationModuleById[next.manifestId],
          layout: { x: next.x, y: next.y, width: next.width, height: next.height, zIndex: next.zIndex },
          sourceWindowId: currentWindowId,
        })
        return next
      }),
    )
  }

  const closeFloatingWorkstation = (id: string) => {
    setFloatingWorkstations((current) => current.filter((entry) => entry.id !== id))
  }

  const closeAllFloatingWorkstations = () => {
    setFloatingWorkstations([])
  }

  const popoutFloatingWorkstation = (id: string) => {
    const workstation = floatingWorkstations.find((entry) => entry.id === id)
    if (!workstation) return
    const manifest = getWorkstationManifestById(workstationManifests, workstation.manifestId)
    openWorkstationWindow(manifest)
    closeFloatingWorkstation(id)
  }

  const setWorkstationActiveModule = (workstationId: string, moduleId: ModuleId) => {
    setWorkstationModuleById((current) => ({
      ...current,
      [workstationId]: moduleId,
    }))
    const manifest = getWorkstationManifestById(workstationManifests, workstationId)
    syncWorkstationState({
      workstationId,
      sourceZoneId: manifest?.source_zone_id,
      originAnchorId: manifest?.entry_anchor_id,
      presentationMode: initialWorkstationId === workstationId ? 'native_window' : 'in_scene',
      activeModuleId: moduleId,
      sourceWindowId: currentWindowId,
    })
  }

  const runSceneTransition = (label: string, nextView: ViewMode, nextPanelModeKey: string | null = null) => {
    setTransitionLabel(label)
    window.setTimeout(() => {
      setPanelModeKey(nextPanelModeKey)
      setViewMode(nextView)
    }, 220)
    window.setTimeout(() => {
      setTransitionLabel(null)
    }, 760)
  }

  const openOperatingSurfaceLane = (panelModeKey: string, lane: OperatingSurfaceNavKey) => {
    const sectionId = panelModeKey === 'settings' ? activeSectionId : panelModeKey
    setActiveSectionId(sectionId)
    runSceneTransition(`Opening ${lane}`, 'panel', panelModeKey)
  }

  const handleOpenHermesDashboard = () => {
    spawnFloatingWorkstation('hermes_dashboard')
  }

  const handleHotspotActivate = (hotspotId: string): boolean => {
    if (hotspotId === 'city_window') {
      runSceneTransition('Entering World Mode', 'world')
      return true
    }

    if (hotspotId === 'governance_console') {
      spawnFloatingWorkstation('governance_guardhouse')
      return true
    }

    if (hotspotId === 'human_stack') {
      spawnFloatingWorkstation('human_realm')
      return true
    }

    if (hotspotId === 'systems_table') {
      spawnFloatingWorkstation('sovereign_world')
      return true
    }

    if (hotspotId === 'operations') {
      spawnFloatingWorkstation('planning_and_queue')
      return true
    }

    if (hotspotId === 'hermes_dashboard') {
      handleOpenHermesDashboard()
      return true
    }

    if (hotspotId === 'network') {
      spawnFloatingWorkstation('routing_and_comms')
      return true
    }

    return false
  }

  const handleSceneAnchorActivate = (anchorId: string) => {
    const anchor = (bundle?.sceneAnchors ?? []).find((candidate) => candidate.id === anchorId) ?? null
    if (!anchor) {
      if (!handleHotspotActivate(anchorId)) {
        spawnFloatingWorkstation(anchorId)
      }
      return
    }

    if (anchor.activation_behavior === 'transition_world') {
      runSceneTransition('Entering World Mode', 'world')
      return
    }
    if (anchor.activation_behavior === 'transition_boardroom') {
      runSceneTransition('Returning To Boardroom', 'boardroom')
      return
    }
    if (anchor.activation_behavior === 'open_workstation' || anchor.activation_behavior === 'open_terminal') {
      spawnFloatingWorkstation(anchor.zone_id)
      return
    }

    setActiveSectionId(anchor.zone_id)
  }

  const renderFloatingWorkstation = (workstation: (typeof floatingWorkstations)[number]) => {
    const manifest = getWorkstationManifestById(workstationManifests, workstation.manifestId)
    const section = bundle?.sections.find((candidate) => candidate.id === workstation.sourceZoneId) ?? null
    return (
      <SceneWorkstation
        key={workstation.id}
        id={workstation.id}
        title={workstation.title}
        subtitle={formatPanelStatus(workstation.sourceZoneId, section)}
        x={workstation.x}
        y={workstation.y}
        width={workstation.width}
        height={workstation.height}
        zIndex={workstation.zIndex}
        modules={buildWorkstationModules(manifest)}
        activeModuleId={workstationModuleById[workstation.manifestId] ?? null}
        onFocus={focusFloatingWorkstation}
        onClose={closeFloatingWorkstation}
        onPopout={popoutFloatingWorkstation}
        onMove={moveFloatingWorkstation}
        onResize={resizeFloatingWorkstation}
        onActiveModuleChange={(_id, moduleId) => setWorkstationActiveModule(workstation.manifestId, moduleId)}
      />
    )
  }

  const floatingWorkstationSceneOverlay = floatingWorkstations.length > 0
    ? floatingWorkstations.map(renderFloatingWorkstation)
    : null

  return (
    <div className={`arda-app arda-app--${viewMode}`}>
      {showCustomWindowControls ? (
        <div className="window-controls" data-tauri-drag-region>
          <button
            className="window-control-btn"
            onClick={minimizeWindow}
            title="Minimize"
          >
            <Minus size={14} />
          </button>
          <button
            className="window-control-btn"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
          >
            <Maximize2 size={14} />
          </button>
          <button
            className="window-control-btn window-control-btn--close"
            onClick={closeWindow}
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}
      <div className="keyboard-hints">
        <span className="kbd">Tab</span> Navigate
        <span className="kbd">Esc</span> Back
        <span className="kbd">Alt+1/2/3</span> Views
      </div>
      <div className="arda-background" />
      {error ? <div className="arda-error">{error}</div> : null}
      {isLoading && !bundle ? <div className="arda-loading">Loading core-state bundle...</div> : null}

      <nav className="operating-surface-rail" aria-label="ARDA operating surface navigation">
        <div className="operating-surface-rail__brief">
          <span className="operating-surface-rail__eyebrow">Operating Surface</span>
          <strong>Now: {nowReport?.status ?? 'loading'}</strong>
          <span title={nowReport?.current ?? 'Waiting for core-state bundle.'}>
            {nowReport?.current ?? 'Waiting for core-state bundle.'}
          </span>
        </div>
        <div className="operating-surface-rail__attention" aria-label="Current operator attention">
          <span>Work: {workReport?.status ?? 'loading'}</span>
          <span>Decisions: {decisionsReport?.status ?? 'loading'}</span>
          <span>Health: {healthReport?.status ?? 'loading'}</span>
          <RuntimeModeBadge status={runtimeModeStatus} />
          <span
            className={`operating-surface-rail__pulse operating-surface-rail__pulse--${liveRuntimeRailStatus}`}
            title={liveRuntime
              ? `${liveRuntime.source} event ${liveRuntime.sequence} at ${liveRuntime.lastEventIso}`
              : 'Waiting for live runtime channel pulse'}
          >
            Pulse: {liveRuntime ? `${liveRuntime.status} #${liveRuntime.sequence}` : 'idle'}
          </span>
        </div>
        <div className="operating-surface-rail__lanes">
          {operatingSurfaceNavItems.map((item) => {
            const status = item.report?.status ?? 'partial'
            const isActive = panelModeKey === item.panelModeKey

            return (
              <button
                type="button"
                key={item.lane}
                className={`operating-surface-rail__lane operating-surface-rail__lane--${status}`}
                onClick={() => openOperatingSurfaceLane(item.panelModeKey, item.lane)}
                aria-label={`Open ${item.lane}: ${item.subtitle}. Status ${status}.`}
                aria-current={isActive ? 'page' : undefined}
                data-status={status}
                title={`${item.lane}: ${item.subtitle} — ${item.report?.current ?? 'waiting for report'}`}
              >
                <span>{item.lane}</span>
                <small>{item.subtitle}</small>
              </button>
            )
          })}
        </div>
      </nav>

      {viewMode === 'boardroom' ? (
        <>
          <BoardroomViewport
            active
            debug={editMode}
            zones={boardroomSceneZones.map((zone): import('./scene/systems/runtimeTypes').SceneZoneDefinition => ({
              id: zone.id,
              title: zone.title,
              scene: zone.scene,
              owner: zone.owner,
              status: zone.status,
              anchorIds: zone.anchor_ids,
              surfaceIds: zone.surface_ids,
              workstationIds: zone.workstation_ids,
              sourceIds: zone.source_ids,
            }))}
            anchors={boardroomSceneAnchors.map((anchor): import('./scene/systems/runtimeTypes').SceneAnchorDefinition => ({
              id: anchor.id,
              scene: anchor.scene,
              type: anchor.type,
              label: anchor.label,
              zoneId: anchor.zone_id,
              activationBehavior: anchor.activation_behavior,
              dataBinding: anchor.data_binding,
            }))}
            workstations={workstationManifests.map((workstation): import('./scene/systems/runtimeTypes').WorkstationManifestDefinition => ({
              id: workstation.id,
              title: workstation.title,
              sourceZoneId: workstation.source_zone_id,
              entryAnchorId: workstation.entry_anchor_id,
              moduleIds: workstation.module_ids,
              presentationModes: workstation.presentation_modes,
            }))}
            slotAssignments={boardroomSceneSlotAssignments}
            surfaceLayouts={boardroomSurfaceLayouts}
            sourceProvenance={bundle?.sourceProvenance ?? []}
            instruments={boardroomHudInstruments}
            presenceState={bundle?.agentPresenceState}
            presenceStatus={bundle?.agentPresenceStatus}
            sceneOverlay={floatingWorkstationSceneOverlay}
            onActivate={handleSceneAnchorActivate}
            onOpenWorkstation={spawnFloatingWorkstation}
            onOpenHermesDashboard={handleOpenHermesDashboard}
            onOpenSettings={() => spawnFloatingWorkstation('settings')}
          />
          {floatingWorkstations.length > 0 ? (
            <div className="workstation-dock">
              <div className="workstation-dock__header">
                <div className="workstation-dock__label">Open Workstations</div>
                <button type="button" className="workstation-dock__tile" onClick={tileFloatingWorkstations}>
                  Tile
                </button>
              </div>
              <div className="workstation-dock__items">
                {floatingWorkstations
                  .slice()
                  .sort((a, b) => b.zIndex - a.zIndex)
                  .map((workstation) => (
                    <div className="workstation-dock__item" key={`dock-${workstation.id}`}>
                      <button
                        type="button"
                        className="workstation-dock__focus"
                        onClick={() => focusFloatingWorkstation(workstation.id)}
                      >
                        {workstation.title}
                      </button>
                      <button
                        type="button"
                        className="workstation-dock__close"
                        onClick={() => closeFloatingWorkstation(workstation.id)}
                        aria-label={`Close ${workstation.title}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
              </div>
              <button type="button" className="workstation-dock__clear" onClick={closeAllFloatingWorkstations}>
                Clear All
              </button>
            </div>
          ) : null}
          {editMode ? (
            <section className="boardroom-edit-overlay">
              <div className="boardroom-edit-console">
                <div className="boardroom-edit-console__header">
                  <span className="boardroom-edit-console__eyebrow">Operator Edit</span>
                  <strong className="boardroom-edit-console__title">Scene Slot Assignment</strong>
                  <span className="module-subtitle">
                    Persistence: {boardroomSlotAssignmentMode} / {boardroomSlotSaveStatus} — {boardroomSlotAssignmentMessage}
                  </span>
                  <span className="module-subtitle">
                    World surfaces: {worldSurfaceAssignmentMode} / {worldSurfaceSaveStatus} — {worldSurfaceAssignmentMessage}
                  </span>
                </div>
                <div className="monitor-config">
                  {BOARDROOM_SCENE_SLOT_IDS.map((slotId) => (
                    <label className="monitor-config__row" key={slotId}>
                      <span className="monitor-config__label">{slotId}</span>
                      <select
                        className="monitor-config__select"
                        value={boardroomSceneSlotAssignments[slotId]}
                        onChange={(event) => {
                          setBoardroomSceneSlotAssignments((current) => ({
                            ...current,
                            [slotId]: event.target.value,
                          }))
                        }}
                      >
                        {sceneSlotAssignmentOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
                <div className="boardroom-edit-console__lists">
                  <div>
                    <div className="module-subtitle">Section Focus</div>
                    <LineList
                      items={(bundle?.sections ?? []).slice(0, 8).map((section) => ({
                        label: section.title,
                        value: section.status,
                      }))}
                    />
                  </div>
                  <div>
                    <div className="module-subtitle">Panel Order</div>
                    <LineList
                      items={moduleOrder.map((moduleId, index) => ({
                        label: `${index + 1}. ${moduleTitles[moduleId]}`,
                        value: moduleId,
                      }))}
                    />
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      {viewMode === 'world' ? (
        <WorldRuntimeViewport
          active
          debug={editMode}
          zones={worldRuntimeZones}
          anchors={worldRuntimeAnchors}
          districtUrgencies={worldDistrictUrgencies}
          surfaceLayouts={worldSurfaceLayouts}
          presenceState={bundle?.agentPresenceState}
          onExit={() => {
            runSceneTransition('Returning To Boardroom', 'boardroom')
          }}
          onOpenPanel={(sourceZoneId) => {
            if (sourceZoneId) {
              setActiveSectionId(sourceZoneId)
              setPanelModeKey(sourceZoneId)
            }
            runSceneTransition('Opening Focused Panel', 'panel')
          }}
        />
      ) : null}

      {viewMode === 'panel' ? (
        <PanelWorkspace
          title={panelModeKey === 'settings' ? 'Settings' : titleForSectionOrPanel(panelModeKey ?? activeSectionId, bundle?.sections ?? [])}
          subtitle="Detailed modules for the active section. Open externally for multi-monitor command flow."
          modules={activePanelModules}
          activeModuleId={activePanelWorkstationId ? (workstationModuleById[activePanelWorkstationId] ?? null) : null}
          onActiveModuleChange={activePanelWorkstationId ? (moduleId) => setWorkstationActiveModule(activePanelWorkstationId, moduleId) : undefined}
          onOpenExternal={panelModeKey === 'settings' || panelModeKey === 'hermes_dashboard'
            ? undefined
            : () => openWorkstationWindow(getWorkstationManifestByZoneId(workstationManifests, panelModeKey ?? activeSectionId))}
          onBack={() => runSceneTransition('Returning To Boardroom', 'boardroom')}
        />
      ) : null}
      <SceneTransitionOverlay active={transitionLabel !== null} label={transitionLabel ?? ''} />
    </div>
  )
}

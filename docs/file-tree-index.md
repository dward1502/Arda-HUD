# ARDA HUD File Tree Index

Generated: 2026-06-27T19:44:32-07:00

## Git status
```
 M src/App.tsx
?? SPRAWL_REDUCTION_NOTES.md
?? docs/file-tree-index.md
?? src/lib/ardaSurfaces.ts
?? src/lib/operatingSurfaceDerivation.ts
?? src/lib/providerRouting.ts
?? src/lib/reviewGateDerivation.ts
?? src/lib/settingsLayout.ts
?? src/types/
```

## Source tree
```
- docs/App.tsx-refactor-audit.md
- docs/archived/ARCHIVED_MYTHOS_SPEC.md
- docs/archived/ARDA_AUDIT.md
- docs/archived/ARDA_PRD.md
- docs/arda-hud-audit-issues.md
- docs/contracts/ARDA_ASSET_PERFORMANCE_BUDGET.md
- docs/contracts/ARDA_BOARDROOM_SLOT_ASSIGNMENT_CONTRACT.md
- docs/contracts/ARDA_DATA_PROVENANCE_CONTRACT.md
- docs/contracts/ARDA_WORLD_DISTRICT_CONTRACT.md
- docs/file-tree-index.md
- docs/plans/2026-06-25-app-tsx-refactor-handoff-plan.md
- docs/plans/2026-06-25-css-styling-organization-plan.md
- docs/plans/2026-06-26-arda-universal-workstation-recovery-plan.md
- src/App.tsx
- src/assets/INDEX.md
- src/assets/react.svg
- src/assets/scene/ASSET_PIPELINE_CONTRACT.md
- src/assets/scene/hologram/.gitkeep
- src/assets/scene/README.md
- src/assets/scene/systems/sceneMaterials.ts
- src/assets/scene/world/.gitkeep
- src/components/arda/BoardroomEditOverlay.tsx
- src/components/arda/core/ArdaErrorBoundary.tsx
- src/components/arda/core/ArdaHeader.tsx
- src/components/arda/core/LayoutEditor.tsx
- src/components/arda/core/OperatingSurfaceRail.tsx
- src/components/arda/core/PanelWorkspace.tsx
- src/components/arda/core/PresencePanel.tsx
- src/components/arda/core/RuntimeModeBadge.tsx
- src/components/arda/core/SceneBackdrop.tsx
- src/components/arda/core/SceneTransitionOverlay.tsx
- src/components/arda/core/SceneWorkstation.tsx
- src/components/arda/core/SignalField.tsx
- src/components/arda/core/types.ts
- src/components/arda/hooks/useArdaActionAdapters.ts
- src/components/arda/hooks/useArdaBundle.ts
- src/components/arda/hooks/useArdaPanelUpdates.ts
- src/components/arda/hooks/useArdaRuntimePulse.ts
- src/components/arda/hooks/useArdaWindowControls.ts
- src/components/arda/hooks/useBoardroomSlotAssignments.ts
- src/components/arda/hooks/useCharonLiveSnapshot.ts
- src/components/arda/hooks/useLearningLoopData.test.ts
- src/components/arda/hooks/useLearningLoopData.ts
- src/components/arda/hooks/useWorldSurfaceAssignments.ts
- src/components/arda/index.ts
- src/components/arda/ModuleCard.tsx
- src/components/arda/modules/ArandurApprovalWorkstation.test.tsx
- src/components/arda/modules/ArandurApprovalWorkstation.tsx
- src/components/arda/modules/BusinessModule.tsx
- src/components/arda/modules/DataFreshnessBadge.test.tsx
- src/components/arda/modules/DataFreshnessBadge.tsx
- src/components/arda/modules/DataSourceDetailsPanel.tsx
- src/components/arda/modules/ExecutiveOverviewModule.tsx
- src/components/arda/modules/HermesDashboardModule.test.tsx
- src/components/arda/modules/HermesDashboardModule.tsx
- src/components/arda/modules/HumanRealmModule.test.tsx
- src/components/arda/modules/HumanRealmModule.tsx
- src/components/arda/modules/LearningLoopSurface.module.css
- src/components/arda/modules/LearningLoopSurface.test.tsx
- src/components/arda/modules/LearningLoopSurface.tsx
- src/components/arda/modules/LearningLoopSurfaceWrapper.test.tsx
- src/components/arda/modules/LearningLoopSurfaceWrapper.tsx
- src/components/arda/modules/LowerTrafficCoverageBadges.test.tsx
- src/components/arda/modules/MediaLibraryModule.tsx
- src/components/arda/modules/OperatingSurfacePlanModule.test.tsx
- src/components/arda/modules/OperatingSurfacePlanModule.tsx
- src/components/arda/modules/OperationsActionContractPanel.test.tsx
- src/components/arda/modules/OperationsActionContractPanel.tsx
- src/components/arda/modules/PersonalGrowthModule.tsx
- src/components/arda/modules/PlanningActionContractPanel.test.tsx
- src/components/arda/modules/PlanningActionContractPanel.tsx
- src/components/arda/modules/QueueProvenancePanel.test.tsx
- src/components/arda/modules/QueueProvenancePanel.tsx
- src/components/arda/modules/ReviewGateWorkstation.test.tsx
- src/components/arda/modules/ReviewGateWorkstation.tsx
- src/components/arda/modules/SectionFocusModule.test.tsx
- src/components/arda/modules/SectionFocusModule.tsx
- src/components/arda/modules/ServiceEmbedModule.tsx
- src/components/arda/modules/SettingsModule.tsx
- src/components/arda/modules/SourceActionContractPanel.test.tsx
- src/components/arda/modules/SourceActionContractPanel.tsx
- src/components/arda/modules/SourceCoverageBadge.tsx
- src/components/arda/modules/SourceFreshnessStrip.tsx
- src/components/arda/modules/SourceRefreshAffordance.test.tsx
- src/components/arda/modules/SourceRefreshAffordance.tsx
- src/components/arda/modules/SystemsModule.tsx
- src/components/arda/modules/WorldTerminalActionContractPanel.test.tsx
- src/components/arda/modules/WorldTerminalActionContractPanel.tsx
- src/components/arda/primitives/LineList.tsx
- src/components/arda/primitives/MetricPill.tsx
- src/components/arda/SectionRail.tsx
- src/components/arda/ThemeSwitcher.tsx
- src/components/arda/types.ts
- src/components/arda/WindowControls.tsx
- src/components/arda/WorkstationDock.tsx
- src/components/INDEX.md
- src/components/kit/A2AFeed.tsx
- src/components/kit/AlertBanner.tsx
- src/components/kit/CommandFeed.tsx
- src/components/kit/CyberButton.tsx
- src/components/kit/CyberInput.tsx
- src/components/kit/DataTable.tsx
- src/components/kit/Divider.tsx
- src/components/kit/JouleWorkCard.tsx
- src/components/kit/MeterBar.tsx
- src/components/kit/NavList.tsx
- src/components/kit/PanelShell.tsx
- src/components/kit/SectionHeader.tsx
- src/components/kit/StatBlock.tsx
- src/components/kit/StatusBadge.test.tsx
- src/components/kit/StatusBadge.tsx
- src/components/kit/Tag.tsx
- src/index.css
- src/INDEX.md
- src/lib/ardaBundleTypes.ts
- src/lib/ardaHudSettings.ts
- src/lib/ardaPanelWatch.ts
- src/lib/ardaPresenceSchema.test.ts
- src/lib/ardaPresenceSchema.ts
- src/lib/ardaProvenance.test.ts
- src/lib/ardaProvenance.ts
- src/lib/ardaReaders.ts
- src/lib/ardaRuntimeMode.ts
- src/lib/ardaSource.remoteConfidence.test.ts
- src/lib/ardaSource.ts
- src/lib/ardaSurfaces.ts
- src/lib/ardaTypes.ts
- src/lib/automationStatus.test.ts
- src/lib/automationStatus.ts
- src/lib/avatarPersona.ts
- src/lib/boardroomSlotSettings.test.ts
- src/lib/boardroomSlotSettings.ts
- src/lib/charonLive.ts
- src/lib/configWalkthrough.ts
- src/lib/endpointConfig.test.ts
- src/lib/endpointConfig.ts
- src/lib/hermesDashboardLauncher.ts
- src/lib/hudEventSchema.ts
- src/lib/INDEX.md
- src/lib/ingest/examples.ts
- src/lib/ingest/index.ts
- src/lib/ingest/parser.ts
- src/lib/ingest/registry.ts
- src/lib/ingest/sources.test.ts
- src/lib/ingest/sources.ts
- src/lib/ingest/types.ts
- src/lib/jsonParse.test.ts
- src/lib/jsonParse.ts
- src/lib/learningLoopLoader.test.ts
- src/lib/learningLoopLoader.ts
- src/lib/mediaLibrarySurface.test.ts
- src/lib/mediaLibrarySurface.ts
- src/lib/operatingSurfaceDerivation.ts
- src/lib/providerRouting.ts
- src/lib/queueHealthProjection.ts
- src/lib/reviewGateDerivation.ts
- src/lib/serviceLibraryBooks.test.ts
- src/lib/serviceLibraryBooks.ts
- src/lib/settingsLayout.ts
- src/lib/soterionRender.ts
- src/lib/sourceActionContract.test.ts
- src/lib/sourceActionContract.ts
- src/lib/surfaceAdapterManifests.test.ts
- src/lib/surfaceAdapterManifests.ts
- src/lib/systemActionBus.test.ts
- src/lib/systemActionBus.ts
- src/lib/tauriGuard.test.ts
- src/lib/tauriGuard.ts
- src/lib/weathertop.ts
- src/lib/worldSurfaceSettings.test.ts
- src/lib/worldSurfaceSettings.ts
- src/main.tsx
- src/scene/ARDA_SCENE_CONTRACTS.md
- src/scene/boardroom/AgentPresenceOrbit.tsx
- src/scene/boardroom/BOARDROOM_CONTRACT.md
- src/scene/boardroom/boardroomHudInstruments.test.ts
- src/scene/boardroom/boardroomHudInstruments.ts
- src/scene/boardroom/BoardroomMissionCue.test.ts
- src/scene/boardroom/BoardroomMissionCue.tsx
- src/scene/boardroom/boardroomMonitorModels.test.ts
- src/scene/boardroom/boardroomMonitorModels.ts
- src/scene/boardroom/boardroomSpatialLayout.test.ts
- src/scene/boardroom/boardroomSpatialLayout.ts
- src/scene/boardroom/boardroomSurfacePreviewModel.ts
- src/scene/boardroom/BOARDROOM_TUNING.md
- src/scene/boardroom/BoardroomViewport.tsx
- src/scene/boardroom/boardroomVisualRefinement.test.ts
- src/scene/boardroom/boardroomVisualRefinement.ts
- src/scene/boardroom/PresenceAvatar.tsx
- src/scene/boardroom/README.md
- src/scene/INDEX.md
- src/scene/README.md
- src/scene/shaders/SHADER_CONTRACT.md
- src/scene/systems/assetPerformanceBudget.test.ts
- src/scene/systems/assetPerformanceBudget.ts
- src/scene/systems/ATMOSPHERE_CONTRACT.md
- src/scene/systems/CAMERA_CONTRACT.md
- src/scene/systems/companionDisplayState.test.ts
- src/scene/systems/companionDisplayState.ts
- src/scene/systems/companionHandoffFixture.ts
- src/scene/systems/CONTRACTS.md
- src/scene/systems/INTERACTION_CONTRACT.md
- src/scene/systems/LIGHTING_CONTRACT.md
- src/scene/systems/MATERIAL_CONTRACT.md
- src/scene/systems/PRESENCE_CONTRACT.md
- src/scene/systems/presenceState.test.ts
- src/scene/systems/presenceState.ts
- src/scene/systems/presenceTypes.ts
- src/scene/systems/runtimeTypes.ts
- src/scene/systems/sceneAssets.test.ts
- src/scene/systems/sceneAssets.ts
- src/scene/systems/sceneMaterials.ts
- src/scene/systems/SceneRuntimeCard.tsx
- src/scene/systems/SCENE_RUNTIME_CONTRACT.md
- src/scene/workstations/adapters/annunimasAdapter.test.ts
- src/scene/workstations/adapters/annunimasAdapter.ts
- src/scene/workstations/sceneSlotWorkstationTemplates.test.ts
- src/scene/workstations/sceneSlotWorkstationTemplates.ts
- src/scene/workstations/SLOT_COMPONENT_CONTRACT.md
- src/scene/workstations/viewModels.test.ts
- src/scene/workstations/viewModels.ts
- src/scene/workstations/WORKSTATION_CONTRACT.md
- src/scene/workstations/workstationRoles.test.ts
- src/scene/workstations/workstationRoles.ts
- src/scene/world/README.md
- src/scene/world/WORLD_CONTRACT.md
- src/scene/world/worldDistrictContracts.test.ts
- src/scene/world/worldDistrictContracts.ts
- src/scene/world/WorldDistrictPresenceCue.test.ts
- src/scene/world/WorldDistrictPresenceCue.tsx
- src/scene/world/worldDistrictPresentation.test.ts
- src/scene/world/worldDistrictPresentation.ts
- src/scene/world/worldDistrictUrgency.test.ts
- src/scene/world/worldDistrictUrgency.ts
- src/scene/world/worldDistrictWorkflows.test.ts
- src/scene/world/worldDistrictWorkflows.ts
- src/scene/world/worldTerminalSurfacePreviewModel.test.ts
- src/scene/world/worldTerminalSurfacePreviewModel.ts
- src/scene/world/WorldTerminalSurfacePreview.tsx
- src/scene/world/WorldViewport.tsx
- src/styles/INDEX.md
- src/styles/tokens/nightcity.tokens.ts
- src/test/INDEX.md
- src/test/setup.smoke.test.ts
- src/test/setup.ts
- src/types/constants.ts
- src/utils/INDEX.md
- src/utils/multiWindow.test.ts
- src/utils/multiWindow.ts
- src/vite-env.d.ts
- src/workstations/adapters/genericControlSystemAdapter.test.ts
- src/workstations/adapters/genericControlSystemAdapter.ts
```

## App.tsx extracted symbol check
```
src/App.tsx: 2720 lines
163: function clampFloatingWorkstationValue(value: number, min: number, max: number): number {
167: function getFloatingWorkstationViewport() {
177: function getFloatingWorkstationTileLayout(index: number, total: number) {
214: function getFloatingWorkstationCenteredLayout() {
259: function isDerivedRecord(record: JsonRecord | null): boolean {
263: function provenanceTag(record: JsonRecord | null, label: string): string {
268: function statusTone(status: string): 'gold' | 'cyan' | 'ember' | 'mint' | 'violet' {
278: function sourceCoverageForSections(sections: ArdaSection[]): SourceCoverageBadgeState | undefined {
281: const missingCount = sections.reduce((count, section) => count + (section.missing_projections?.length ?? 0), 0)
289: function sourceCoverageForPanel(sections: ArdaSection[], panelId: ModuleId): SourceCoverageBadgeState | undefined {
290: const mappedSections = sections.filter((section) => section.arda_panels.includes(panelId))
298: function getOperatorActions(bundle: ArdaBundle): {
327: function FleetFocusedWorkstationView({ fleetViewModel }: { fleetViewModel: FleetViewModel | null }) {
338: const primaryProvider = fleetViewModel.providers.find((provider) => provider.enabled && provider.healthy)
341: const offlineMetric = fleetViewModel.metrics.find((metric) => metric.id === 'unexpected_offline')
403: const onBundleLoaded = useCallback((nextBundle: ArdaBundle) => {
479: const handleWorkstationSync = (event: Event) => {
513: const boardroomMonitors = BOARDROOM_MONITOR_SLOT_IDS.map((slotId) => boardroomSceneSlotAssignments[slotId])
515: const sceneSlotAssignmentOptions = useMemo(() => {
522: const fallbackOptions = BOARDROOM_MONITOR_OPTIONS.filter((option) => (
533: const handleKeyDown = (e: KeyboardEvent) => {
599: const agents = useMemo(() => (bundle ? getAgents(bundle) : []), [bundle])
600: const docs = useMemo(() => (bundle ? getHumanDocs(bundle) : []), [bundle])
601: const notes = useMemo(() => (bundle ? getHumanNotes(bundle) : []), [bundle])
602: const packages = useMemo(() => (bundle ? getPackageTools(bundle) : []), [bundle])
607: const packageRuntimeActivation = useMemo(() => (bundle ? getPackageRuntimeActivation(bundle) : []), [bundle])
608: const stores = useMemo(() => (bundle ? getStorageStores(bundle) : []), [bundle])
625: const governanceSignals = useMemo(() => (bundle ? getGovernanceRuntimeSignals(bundle) : []), [bundle])
626: const operationsFlow = useMemo(() => (bundle ? getOperationsFlowSummary(bundle) : []), [bundle])
631: const escalationRuntime = useMemo(() => (bundle ? getEscalationRuntime(bundle) : { summary: [], reasons: [] }), [bundle])
632: const operatorActions = useMemo(() => (bundle ? getOperatorActions(bundle) : { summary: [], actions: [] }), [bundle])
641: const operatorRuntime = useMemo(() => (bundle ? getOperatorRuntimeSurface(bundle) : null), [bundle])
697: const fleetViewModel = useMemo(() => (bundle ? createAnnunimasFleetViewModel(bundle) : null), [bundle])
702: const runtimeDrift = useMemo(() => (bundle ? getRuntimeDrift(bundle) : { totalNodes: 0, driftedNodes: 0, items: [] }), [bundle])
703: const mostConstrainedLane = useMemo(() => {
704: const flattened = laneHeadroom.flatMap((provider) =>
717: const hottestProvider = useMemo(() => {
723: const dominantLaneFitness = useMemo(() => {
907: const operatingSurfaceNavItems = OPERATING_SURFACE_NAV.map((item) => ({
1774: const activePanelModules = panelLayout.map((moduleId) => ({
1784: const buildWorkstationModules = (manifest: ArdaWorkstationManifest | null) => {
1989: const section = bundle?.sections.find((candidate) => candidate.id === sectionId) ?? null
1990: const zone = bundle?.sceneZones.find((candidate) => candidate.id === sectionId) ?? null
2008: const regenerateDerivedState = async () => {
2017: const submitRefreshAction = async (actionId: SystemActionId) => {
2038: const submitReviewGateDecision = async (item: ReviewGateItem, status: 'approved' | 'rejected') => {
2066: const submitHumanAugmentationApproval = async () => {
2091: const submitCeoCouncilSession = async () => {
2125: const openWorkstationWindow = (manifest: ArdaWorkstationManifest | null) => {
2156: const spawnFloatingWorkstation = (zoneId: string | null) => {
2163: const existing = current.find((entry) => entry.manifestId === manifest.id)
2164: const nextZ = current.reduce((max, item) => Math.max(max, item.zIndex), FLOATING_WORKSTATION_BASE_Z_INDEX) + 1
2211: const tileFloatingWorkstations = () => {
2213: const tiled = current.map((entry, index) => {
2243: const handleBoardroomMonitorOpen = (monitorId: string) => {
2261: const focusFloatingWorkstation = (id: string) => {
2263: const nextZ = current.reduce((max, item) => Math.max(max, item.zIndex), FLOATING_WORKSTATION_BASE_Z_INDEX) + 1
2264: const workstation = current.find((entry) => entry.id === id)
2280: const moveFloatingWorkstation = (id: string, x: number, y: number) => {
2303: const resizeFloatingWorkstation = (id: string, width: number, height: number) => {
2326: const closeFloatingWorkstation = (id: string) => {
2330: const closeAllFloatingWorkstations = () => {
2334: const popoutFloatingWorkstation = (id: string) => {
2335: const workstation = floatingWorkstations.find((entry) => entry.id === id)
2342: const setWorkstationActiveModule = (workstationId: string, moduleId: ModuleId) => {
2358: const runSceneTransition = (label: string, nextView: ViewMode, nextPanelModeKey: string | null = null) => {
2369: const openOperatingSurfaceLane = (panelModeKey: string, lane: OperatingSurfaceNavKey) => {
2375: const handleOpenHermesDashboard = () => {
2379: const handleHotspotActivate = (hotspotId: string): boolean => {
2418: const handleSceneAnchorActivate = (anchorId: string) => {
2419: const anchor = (bundle?.sceneAnchors ?? []).find((candidate) => candidate.id === anchorId) ?? null
2443: const renderFloatingWorkstation = (workstation: (typeof floatingWorkstations)[number]) => {
2445: const section = bundle?.sections.find((candidate) => candidate.id === workstation.sourceZoneId) ?? null
```

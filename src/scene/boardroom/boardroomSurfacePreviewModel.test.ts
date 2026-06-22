import { describe, expect, it } from 'vitest'
import type { BoardroomSurfaceLayout } from '../../lib/boardroomSlotSettings'
import { deriveBoardroomSurfacePreviewModel } from './boardroomSurfacePreviewModel'

describe('boardroom surface preview model', () => {
  it('projects surface layout widgets into deterministic preview widgets', () => {
    const layout: BoardroomSurfaceLayout = {
      enabled: true,
      adapter_type: 'component_grid',
      preview: {
        mode: 'component_grid',
        refresh_ms: 3000,
        widgets: [
          {
            id: 'routing.metrics',
            kind: 'metric_strip',
            title: 'Routing Metrics',
            data_binding: 'routing.summary',
            grid_area: 'top',
          },
          {
            id: 'routing.stream',
            kind: 'particle_stream',
            title: 'Route Flow',
            data_binding: 'routing.health',
            grid_area: 'main',
          },
          {
            id: 'routing.status',
            kind: 'status_grid',
            title: 'Provider Status',
            data_binding: 'routing.status',
            grid_area: 'side',
          },
        ],
      },
      focus: {
        mode: 'native_window',
        target: 'routing_and_comms',
        refresh_ms: 1000,
      },
      embed: {
        url: null,
        allow_inline: false,
      },
    }

    const model = deriveBoardroomSurfacePreviewModel({ title: 'Routing Providers', layout })

    expect(model).toMatchObject({
      title: 'Routing Providers',
      eyebrow: 'COMPONENT GRID',
      glyph: 'GRID',
      tone: 'cyan',
      status: 'nominal',
      refreshMs: 3000,
    })
    expect(model.widgets.map((widget) => widget.kind)).toEqual(['metric_strip', 'particle_stream', 'status_grid'])
    expect(model.widgets[0].values).toHaveLength(4)
    expect(model.widgets[0].values).toEqual(deriveBoardroomSurfacePreviewModel({ title: 'Routing Providers', layout }).widgets[0].values)
  })

  it('marks blocked inline iframe previews as attention surfaces', () => {
    const layout: BoardroomSurfaceLayout = {
      enabled: true,
      adapter_type: 'service_embed',
      preview: {
        mode: 'inline_embed',
        refresh_ms: 5000,
        widgets: [
          {
            id: 'grafana.inline',
            kind: 'iframe_preview',
            title: 'Grafana',
            data_binding: 'service.grafana',
            grid_area: 'main',
          },
        ],
      },
      focus: {
        mode: 'native_window',
        target: 'service_grafana',
        refresh_ms: 5000,
      },
      embed: {
        url: 'http://127.0.0.1:3000',
        allow_inline: false,
      },
    }

    const model = deriveBoardroomSurfacePreviewModel({ title: 'Grafana', layout })

    expect(model.status).toBe('attention')
    expect(model.tone).toBe('violet')
    expect(model.widgets[0].status).toBe('attention')
  })

  it('labels mixed media and session widgets for monitor previews', () => {
    const layout: BoardroomSurfaceLayout = {
      enabled: true,
      adapter_type: 'media_viewer',
      preview: {
        mode: 'media_thumbnail',
        refresh_ms: 4000,
        widgets: [
          {
            id: 'library.markdown',
            kind: 'markdown_doc',
            title: 'Runbook',
            data_binding: 'human/plans/runbook.md',
            grid_area: 'top',
          },
          {
            id: 'library.pdf',
            kind: 'pdf_doc',
            title: 'Spec Packet',
            data_binding: 'docs/spec.pdf',
            grid_area: 'main',
          },
          {
            id: 'library.image',
            kind: 'image_asset',
            title: 'Reference Image',
            data_binding: 'data/media/reference.png',
            grid_area: 'side',
          },
          {
            id: 'agent.vm',
            kind: 'remote_session',
            title: 'Agent Desktop',
            data_binding: 'beelink.vm.blender',
            grid_area: 'main',
          },
        ],
      },
      focus: {
        mode: 'native_window',
        target: 'media_library',
        refresh_ms: 1000,
      },
      embed: {
        url: null,
        allow_inline: false,
      },
    }

    const model = deriveBoardroomSurfacePreviewModel({ title: 'Media Library', layout })

    expect(model.tone).toBe('gold')
    expect(model.widgets.map((widget) => widget.mediaLabel)).toEqual(['MD', 'PDF', 'IMG', 'VM'])
    expect(model.widgets.map((widget) => widget.status)).toEqual(['nominal', 'nominal', 'nominal', 'nominal'])
  })

  it('marks remote session previews as attention when they cannot focus into a native window', () => {
    const layout: BoardroomSurfaceLayout = {
      enabled: true,
      adapter_type: 'remote_desktop',
      preview: {
        mode: 'remote_preview',
        refresh_ms: 2000,
        widgets: [
          {
            id: 'agent.vm',
            kind: 'remote_session',
            title: 'Agent Desktop',
            data_binding: 'beelink.vm.comfyui',
            grid_area: 'main',
          },
        ],
      },
      focus: {
        mode: 'in_scene_workstation',
        target: 'agent_session',
        refresh_ms: 1000,
      },
      embed: {
        url: null,
        allow_inline: false,
      },
    }

    const model = deriveBoardroomSurfacePreviewModel({ title: 'Agent Session', layout })

    expect(model.status).toBe('attention')
    expect(model.widgets[0]).toMatchObject({
      mediaLabel: 'VM',
      status: 'attention',
    })
  })

  it('attaches matching source provenance and raises stale projections to attention', () => {
    const layout: BoardroomSurfaceLayout = {
      enabled: true,
      adapter_type: 'component_grid',
      preview: {
        mode: 'component_grid',
        refresh_ms: 3000,
        widgets: [
          {
            id: 'planning.metrics',
            kind: 'metric_strip',
            title: 'Queue Metrics',
            data_binding: 'planning_and_queue.summary',
            grid_area: 'top',
          },
        ],
      },
      focus: {
        mode: 'native_window',
        target: 'planning_and_queue',
        refresh_ms: 1000,
      },
      embed: {
        url: null,
        allow_inline: false,
      },
    }

    const model = deriveBoardroomSurfacePreviewModel({
      title: 'Planning',
      layout,
      sourceProvenance: [
        {
          domainId: 'planning_and_queue:core/projects/tasks/queue.jsonl',
          label: 'Planning And Queue / Task Queue',
          sourcePaths: ['core/projects/tasks/queue.jsonl'],
          generatedAtUtc: '2026-06-01T00:00:00.000Z',
          observedAtUtc: null,
          state: 'stale',
          sourceKind: 'manual',
        },
      ],
    })

    expect(model.status).toBe('attention')
    expect(model.provenance).toMatchObject({
      state: 'stale',
      label: 'Planning And Queue / Task Queue',
      sourcePath: 'core/projects/tasks/queue.jsonl',
      refreshSafety: 'approval_required',
    })
  })
})

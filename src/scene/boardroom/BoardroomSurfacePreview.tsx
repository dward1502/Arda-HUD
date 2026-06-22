import { Html } from '@react-three/drei'
import type { CSSProperties } from 'react'
import type { BoardroomSurfaceLayout } from '../../lib/boardroomSlotSettings'
import type { ArdaSourceProvenance } from '../../lib/ardaProvenance'
import type { BoardroomPreviewMode } from './boardroomSpatialLayout'
import { deriveBoardroomSurfacePreviewModel, type BoardroomSurfacePreviewWidgetModel } from './boardroomSurfacePreviewModel'

function MetricStripWidget({ widget }: { widget: BoardroomSurfacePreviewWidgetModel }) {
  return (
    <span className="surface-preview-widget surface-preview-widget--metric">
      <b>{widget.title}</b>
      <span>
        {widget.values.slice(0, 3).map((value, index) => (
          <i key={`${widget.id}-metric-${index}`} style={{ '--metric-level': `${Math.max(0.14, value) * 100}%` } as CSSProperties} />
        ))}
      </span>
    </span>
  )
}

function ParticleStreamWidget({ widget }: { widget: BoardroomSurfacePreviewWidgetModel }) {
  return (
    <span className="surface-preview-widget surface-preview-widget--particles">
      <b>{widget.title}</b>
      <span>
        {widget.values.map((value, index) => (
          <i
            key={`${widget.id}-particle-${index}`}
            style={{
              '--particle-x': `${12 + value * 76}%`,
              '--particle-y': `${18 + widget.values[(index + 1) % widget.values.length] * 58}%`,
            } as CSSProperties}
          />
        ))}
      </span>
    </span>
  )
}

function StatusGridWidget({ widget }: { widget: BoardroomSurfacePreviewWidgetModel }) {
  return (
    <span className="surface-preview-widget surface-preview-widget--status">
      <b>{widget.title}</b>
      <span>
        {widget.values.map((value, index) => (
          <i
            key={`${widget.id}-status-${index}`}
            className={value > 0.72 ? 'is-hot' : value > 0.44 ? 'is-watch' : 'is-ready'}
          />
        ))}
      </span>
    </span>
  )
}

function SparklineWidget({ widget }: { widget: BoardroomSurfacePreviewWidgetModel }) {
  const points = widget.values.map((value, index) => `${index * 33},${80 - value * 64}`).join(' ')
  return (
    <span className="surface-preview-widget surface-preview-widget--sparkline">
      <b>{widget.title}</b>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <polyline points={points} />
      </svg>
    </span>
  )
}

function TextFeedWidget({ widget }: { widget: BoardroomSurfacePreviewWidgetModel }) {
  return (
    <span className="surface-preview-widget surface-preview-widget--text">
      <b>{widget.title}</b>
      <span>{widget.binding}</span>
    </span>
  )
}

function MediaPreviewWidget({ widget }: { widget: BoardroomSurfacePreviewWidgetModel }) {
  return (
    <span className="surface-preview-widget surface-preview-widget--media">
      <b>{widget.title}</b>
      <span>
        <i>{widget.mediaLabel}</i>
        <small>{widget.binding}</small>
      </span>
    </span>
  )
}

function DataStreamWidget({ widget }: { widget: BoardroomSurfacePreviewWidgetModel }) {
  return (
    <span className="surface-preview-widget surface-preview-widget--data-stream">
      <b>{widget.title}</b>
      <span>
        {widget.values.map((value, index) => (
          <i
            key={`${widget.id}-stream-${index}`}
            style={{ '--stream-level': `${Math.max(0.18, value) * 100}%` } as CSSProperties}
          />
        ))}
      </span>
    </span>
  )
}

function SessionPreviewWidget({ widget }: { widget: BoardroomSurfacePreviewWidgetModel }) {
  return (
    <span className="surface-preview-widget surface-preview-widget--session">
      <b>{widget.title}</b>
      <span>
        <i>{widget.mediaLabel}</i>
        <small>{widget.status}</small>
      </span>
    </span>
  )
}

function BoardroomSurfaceWidget({ widget }: { widget: BoardroomSurfacePreviewWidgetModel }) {
  if (widget.kind === 'metric_strip') return <MetricStripWidget widget={widget} />
  if (widget.kind === 'particle_stream') return <ParticleStreamWidget widget={widget} />
  if (widget.kind === 'status_grid') return <StatusGridWidget widget={widget} />
  if (widget.kind === 'sparkline') return <SparklineWidget widget={widget} />
  if (['media_tile', 'iframe_preview', 'markdown_doc', 'pdf_doc', 'image_asset', 'video_asset', 'document_asset'].includes(widget.kind)) {
    return <MediaPreviewWidget widget={widget} />
  }
  if (widget.kind === 'data_stream') return <DataStreamWidget widget={widget} />
  if (widget.kind === 'agent_comms' || widget.kind === 'remote_session') return <SessionPreviewWidget widget={widget} />
  return <TextFeedWidget widget={widget} />
}

export default function BoardroomSurfacePreview({
  title,
  layout,
  previewMode,
  sourceProvenance,
  onActivate,
}: {
  title: string
  layout: BoardroomSurfaceLayout
  previewMode: BoardroomPreviewMode
  sourceProvenance?: ArdaSourceProvenance[]
  onActivate: () => void
}) {
  const model = deriveBoardroomSurfacePreviewModel({ title, layout, sourceProvenance })
  const className = [
    'boardroom-surface-preview',
    `boardroom-surface-preview--${previewMode}`,
    `boardroom-surface-preview--${model.tone}`,
    `boardroom-surface-preview--${model.status}`,
  ].join(' ')

  return (
    <Html
      center
      transform
      distanceFactor={previewMode === 'monitor_surface' ? 4.1 : 5.6}
      position={[0, 0, previewMode === 'monitor_surface' ? 0.12 : 0.28]}
    >
      <button type="button" className={className} onClick={onActivate} aria-label={`Open ${model.title}`}>
        <span className="boardroom-surface-preview__header">
          <span>
            <b>{model.eyebrow}</b>
            <strong>{model.title}</strong>
          </span>
          <i>{model.glyph}</i>
        </span>
        <span className="boardroom-surface-preview__widgets">
          {model.widgets.slice(0, 4).map((widget) => (
            <BoardroomSurfaceWidget key={widget.id} widget={widget} />
          ))}
        </span>
        <span className="boardroom-surface-preview__footer">
          <span>{model.provenance ? `${model.provenance.state} ${model.provenance.sourceKind}` : model.status}</span>
          <small>{Math.round(model.refreshMs / 100) / 10}s</small>
        </span>
        {model.provenance ? (
          <span className={`boardroom-surface-preview__provenance boardroom-surface-preview__provenance--${model.provenance.refreshSafety}`}>
            <span>{model.provenance.label}</span>
            <small>{model.provenance.refreshSafety.replace(/_/g, ' ')}</small>
          </span>
        ) : null}
      </button>
    </Html>
  )
}

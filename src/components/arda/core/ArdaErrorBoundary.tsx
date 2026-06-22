import React from 'react'

interface ArdaErrorBoundaryProps {
  children: React.ReactNode
}

interface ArdaErrorBoundaryState {
  hasError: boolean
  message: string
}

export default class ArdaErrorBoundary extends React.Component<ArdaErrorBoundaryProps, ArdaErrorBoundaryState> {
  constructor(props: ArdaErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: unknown): ArdaErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Unknown render failure',
    }
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('ARDA_HUD render failure', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="arda-failsafe">
          <div className="arda-failsafe__eyebrow">Failsafe Surface</div>
          <h1>ARDA_HUD recovered from a render fault.</h1>
          <p>{this.state.message}</p>
          <button
            className="arda-failsafe__button"
            onClick={() => window.location.reload()}
            type="button"
          >
            Reload Surface
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

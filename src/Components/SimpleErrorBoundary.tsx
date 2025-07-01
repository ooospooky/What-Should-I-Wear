import { Component, ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Error Boundary:", error);
  }

  // TODO: better error UI and with Tailwind css
  render() {
    if (this.state.hasError) {
      return (
        <div
          className="result"
          style={{ "--view-height": `${window.innerHeight}px` }}
        >
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h2>載入失敗</h2>
            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <button
                className="backBtn"
                onClick={() => (window.location.href = "/home")}
              >
                &larr;&nbsp;BACK
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

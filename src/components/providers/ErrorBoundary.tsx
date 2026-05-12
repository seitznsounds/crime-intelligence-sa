"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { ErrorState } from "@/components/ui/StatusStates";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <ErrorState 
            title="Module Crash Detected"
            description={this.state.error?.message || "A critical error occurred in this intelligence module. State has been preserved where possible."}
            actionLabel="Reset System State"
            onAction={() => this.setState({ hasError: false })}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

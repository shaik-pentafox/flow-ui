import { Component, type ReactNode } from "react";
import { Label } from "../ui/label";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallbackMsg?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Label className="text-red-600">{this.props.fallbackMsg ?? "Something went wrong in this component."}</Label>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

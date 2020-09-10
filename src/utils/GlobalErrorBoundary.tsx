import React, { Component } from 'react';
import UncaughtError from '@/pages/exception/UncaughtError';

class ProdGlobalErrorBoundary extends Component<{}, { hasError: boolean }> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    return this.state.hasError ? <UncaughtError /> : this.props.children;
  }
}

const GlobalErrorBoundary: React.FC = ({ children }) =>
  __DEV__ ? <>{children}</> : <ProdGlobalErrorBoundary>{children}</ProdGlobalErrorBoundary>;

export default GlobalErrorBoundary;

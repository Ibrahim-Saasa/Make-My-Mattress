/**
 * Error Boundary Component
 * Catches errors in the component tree and displays user-friendly error UI
 */

import React, { Component, ReactNode, ErrorInfo } from "react";
import { AppError, ErrorCode, ErrorSeverity } from "../src/utils/errorTypes";
import { errorLogger } from "../src/utils/errorLogger";

interface IErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: AppError, errorInfo: ErrorInfo) => void;
  fallback?: (error: AppError, retry: () => void) => ReactNode;
}

interface IErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

type ErrorBoundaryProps = IErrorBoundaryProps;
type ErrorBoundaryState = IErrorBoundaryState;

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  declare props: ErrorBoundaryProps;
  declare state: ErrorBoundaryState;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const appError =
      error instanceof AppError
        ? error
        : new AppError(
            ErrorCode.UNKNOWN_ERROR,
            "Something went wrong. Please try refreshing the page.",
            error.message,
            500,
            ErrorSeverity.HIGH,
            false,
            undefined,
            error,
          );

    (this as any).setState({
      error: appError,
      errorInfo,
    });

    // Log the error
    errorLogger.logError(appError, {
      metadata: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(appError, errorInfo);
    }
  }

  handleRetry = (): void => {
    (this as any).setState((prevState: ErrorBoundaryState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Default error UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback Component
 */
interface DefaultErrorFallbackProps {
  error: AppError;
  onRetry: () => void;
}

export const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({
  error,
  onRetry,
}) => {
  const isProduction = import.meta.env.VITE_PROD || false;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border-t-4 border-red-500">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0 4v2M12 3a9 9 0 110 18 9 9 0 010-18z"
              />
            </svg>
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Oops!
        </h1>

        {/* Error Message */}
        <p className="text-center text-gray-700 mb-6 leading-relaxed">
          {error.userMessage}
        </p>

        {/* Error Code (Development Only) */}
        {!isProduction && (
          <div className="bg-gray-100 rounded p-4 mb-6 font-mono text-sm text-gray-600 break-words">
            <p className="font-bold mb-1">Error Code: {error.code}</p>
            {error.statusCode && <p>Status: {error.statusCode}</p>}
          </div>
        )}

        {/* Suggested Actions */}
        <div className="space-y-3 mb-6">
          {error.retryable && (
            <>
              <p className="text-sm text-gray-600 font-semibold">
                You can try:
              </p>
              <ul className="text-sm text-gray-600 space-y-2 ml-4">
                <li className="list-disc">Refreshing the page</li>
                <li className="list-disc">Checking your internet connection</li>
                <li className="list-disc">Trying again in a few moments</li>
              </ul>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {error.retryable && (
            <button
              onClick={onRetry}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          )}
          <button
            onClick={() => (window.location.href = "/")}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Go Home
          </button>
        </div>

        {/* Support Contact (Optional) */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Still having issues?{" "}
          <a
            href="mailto:support@makemymattress.com"
            className="text-blue-500 hover:underline"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

/**
 * Hook to use error boundary functionality in functional components
 */
export const useErrorHandler = () => {
  return (error: Error, context?: Record<string, any>) => {
    const appError =
      error instanceof AppError
        ? error
        : new AppError(
            ErrorCode.UNKNOWN_ERROR,
            "An error occurred",
            error.message,
            500,
            ErrorSeverity.MEDIUM,
            false,
            { metadata: context },
          );

    errorLogger.logError(appError);
    throw appError;
  };
};

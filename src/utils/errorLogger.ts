/**
 * Error Logging Service
 * Handles centralized error logging, reporting, and analytics
 */

import { AppError, ErrorCode, ErrorSeverity, ErrorContext } from "./errorTypes";

export interface ErrorLog {
  id: string;
  code: ErrorCode;
  userMessage: string;
  developerMessage: string;
  statusCode: number;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: ErrorContext;
  stackTrace?: string;
  url?: string;
  userAgent?: string;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private errorLogs: ErrorLog[] = [];
  private maxLogs = 100; // Keep last 100 errors in memory
  private isProduction = import.meta.env.PROD;

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * Setup global error handlers for uncaught errors
   */
  private setupGlobalErrorHandlers(): void {
    // Handle uncaught exceptions
    window.addEventListener("error", (event: ErrorEvent) => {
      this.logError(
        new AppError(
          ErrorCode.UNKNOWN_ERROR,
          "An unexpected error occurred. Please refresh the page.",
          event.error?.message || "Uncaught error",
          500,
          ErrorSeverity.CRITICAL,
          false,
          undefined,
          event.error,
        ),
      );
    });

    // Handle unhandled promise rejections
    window.addEventListener(
      "unhandledrejection",
      (event: PromiseRejectionEvent) => {
        this.logError(
          new AppError(
            ErrorCode.UNKNOWN_ERROR,
            "An unexpected error occurred. Please try again.",
            `Unhandled promise rejection: ${event.reason}`,
            500,
            ErrorSeverity.HIGH,
            true,
            undefined,
            event.reason instanceof Error
              ? event.reason
              : new Error(String(event.reason)),
          ),
        );
      },
    );
  }

  /**
   * Log an error
   */
  logError(error: AppError | Error, context?: ErrorContext): ErrorLog {
    const errorLog: ErrorLog = {
      id: this.generateErrorId(),
      code: error instanceof AppError ? error.code : ErrorCode.UNKNOWN_ERROR,
      userMessage:
        error instanceof AppError
          ? error.userMessage
          : "An unexpected error occurred. Please try again.",
      developerMessage: error.message,
      statusCode: error instanceof AppError ? error.statusCode : 500,
      severity: error instanceof AppError ? error.severity : ErrorSeverity.HIGH,
      timestamp: new Date(),
      context:
        context || (error instanceof AppError ? error.context : undefined),
      stackTrace: error.stack,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    };

    // Store in memory
    this.errorLogs.push(errorLog);
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs.shift();
    }

    // Send to backend/monitoring service in production
    if (this.isProduction) {
      this.sendToMonitoringService(errorLog);
    } else {
      // Log to console in development
      console.error("[AppError]", errorLog);
    }

    // Store in localStorage for debugging
    this.persistErrorToLocalStorage(errorLog);

    return errorLog;
  }

  /**
   * Send error to external monitoring service (Sentry, DataDog, etc.)
   */
  private sendToMonitoringService(errorLog: ErrorLog): void {
    // This would integrate with your monitoring service
    // Example: Sentry.captureException(errorLog)
    fetch("/api/logs/errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(errorLog),
    }).catch((err) => {
      console.error("Failed to send error log:", err);
    });
  }

  /**
   * Persist error to localStorage for debugging
   */
  private persistErrorToLocalStorage(errorLog: ErrorLog): void {
    try {
      const existing = localStorage.getItem("app_error_logs");
      const logs = existing ? JSON.parse(existing) : [];
      logs.push(errorLog);
      // Keep only last 10 errors
      if (logs.length > 10) logs.shift();
      localStorage.setItem("app_error_logs", JSON.stringify(logs));
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }

  /**
   * Get all logged errors
   */
  getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs];
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): ErrorLog[] {
    return this.errorLogs.filter((log) => log.severity === severity);
  }

  /**
   * Get errors by code
   */
  getErrorsByCode(code: ErrorCode): ErrorLog[] {
    return this.errorLogs.filter((log) => log.code === code);
  }

  /**
   * Clear error logs
   */
  clearLogs(): void {
    this.errorLogs = [];
    try {
      localStorage.removeItem("app_error_logs");
    } catch {
      // Silently fail
    }
  }

  /**
   * Export error logs
   */
  exportLogs(): string {
    return JSON.stringify(this.errorLogs, null, 2);
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const errorLogger = ErrorLogger.getInstance();

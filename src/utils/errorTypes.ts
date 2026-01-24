/**
 * Error Classification System
 * Centralized error definitions for the application
 */

export enum ErrorCode {
  // Network Errors
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  CONNECTION_REFUSED = "CONNECTION_REFUSED",

  // Authentication Errors
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",

  // Validation Errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",

  // Business Logic Errors
  INSUFFICIENT_INVENTORY = "INSUFFICIENT_INVENTORY",
  PRICE_MISMATCH = "PRICE_MISMATCH",
  ORDER_PROCESSING_FAILED = "ORDER_PROCESSING_FAILED",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  SHIPPING_UNAVAILABLE = "SHIPPING_UNAVAILABLE",

  // Server Errors
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  DUPLICATE_RESOURCE = "DUPLICATE_RESOURCE",

  // Database Errors
  DATABASE_ERROR = "DATABASE_ERROR",
  QUERY_FAILED = "QUERY_FAILED",

  // File Errors
  FILE_UPLOAD_FAILED = "FILE_UPLOAD_FAILED",
  FILE_SIZE_EXCEEDED = "FILE_SIZE_EXCEEDED",
  INVALID_FILE_TYPE = "INVALID_FILE_TYPE",

  // Integration Errors
  THIRD_PARTY_API_ERROR = "THIRD_PARTY_API_ERROR",
  EXTERNAL_SERVICE_FAILURE = "EXTERNAL_SERVICE_FAILURE",

  // Unknown Error
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export enum ErrorSeverity {
  LOW = "LOW", // User notification, no action required
  MEDIUM = "MEDIUM", // Retry recommended, user may need assistance
  HIGH = "HIGH", // Critical error, immediate action required
  CRITICAL = "CRITICAL", // System-level failure
}

export interface ErrorContext {
  userId?: string;
  userRole?: string;
  endpoint?: string;
  method?: string;
  timestamp?: Date;
  requestId?: string;
  metadata?: Record<string, any>;
}

export class AppError extends Error {
  public code: ErrorCode;
  public severity: ErrorSeverity;
  public statusCode: number;
  public retryable: boolean;
  public userMessage: string;
  public developerMessage: string;
  public context?: ErrorContext;
  public originalError?: Error;

  constructor(
    code: ErrorCode,
    userMessage: string,
    developerMessage: string,
    statusCode: number = 500,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    retryable: boolean = false,
    context?: ErrorContext,
    originalError?: Error,
  ) {
    super(developerMessage);
    this.name = "AppError";
    this.code = code;
    this.userMessage = userMessage;
    this.developerMessage = developerMessage;
    this.statusCode = statusCode;
    this.severity = severity;
    this.retryable = retryable;
    this.context = context;
    this.originalError = originalError;

    // Maintains proper stack trace
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      code: this.code,
      userMessage: this.userMessage,
      developerMessage: this.developerMessage,
      statusCode: this.statusCode,
      severity: this.severity,
      retryable: this.retryable,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
}

// Utility function to convert HTTP status codes to AppError
export function httpStatusToErrorCode(statusCode: number): ErrorCode {
  switch (statusCode) {
    case 400:
      return ErrorCode.VALIDATION_ERROR;
    case 401:
      return ErrorCode.UNAUTHORIZED;
    case 403:
      return ErrorCode.FORBIDDEN;
    case 404:
      return ErrorCode.RESOURCE_NOT_FOUND;
    case 409:
      return ErrorCode.DUPLICATE_RESOURCE;
    case 422:
      return ErrorCode.INVALID_INPUT;
    case 429:
      return ErrorCode.TIMEOUT_ERROR;
    case 500:
      return ErrorCode.INTERNAL_SERVER_ERROR;
    case 503:
      return ErrorCode.SERVICE_UNAVAILABLE;
    default:
      return ErrorCode.UNKNOWN_ERROR;
  }
}

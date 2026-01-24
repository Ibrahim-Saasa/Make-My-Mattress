/**
 * Error Recovery & Retry Logic
 * Handles automatic recovery from transient errors
 */

import { AppError, ErrorCode } from "./errorTypes";
import { errorLogger } from "./errorLogger";

export interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableErrorCodes: ErrorCode[];
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  retryableErrorCodes: [
    ErrorCode.TIMEOUT_ERROR,
    ErrorCode.CONNECTION_REFUSED,
    ErrorCode.NETWORK_ERROR,
    ErrorCode.SERVICE_UNAVAILABLE,
    ErrorCode.INTERNAL_SERVER_ERROR,
  ],
};

export class RetryHandler {
  /**
   * Execute a function with automatic retry logic
   */
  static async executeWithRetry<T>(
    fn: () => Promise<T>,
    config: Partial<RetryConfig> = {},
  ): Promise<T> {
    const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Check if error is retryable
        const isRetryable =
          error instanceof AppError
            ? finalConfig.retryableErrorCodes.includes(error.code) &&
              error.retryable
            : true;

        if (!isRetryable || attempt === finalConfig.maxAttempts) {
          throw error;
        }

        // Calculate delay with exponential backoff
        const delay = this.calculateBackoffDelay(
          attempt,
          finalConfig.initialDelayMs,
          finalConfig.maxDelayMs,
          finalConfig.backoffMultiplier,
        );

        console.warn(
          `[RetryHandler] Attempt ${attempt} failed, retrying in ${delay}ms...`,
          lastError,
        );

        // Add jitter to prevent thundering herd
        const jitter = Math.random() * delay * 0.1;
        await this.sleep(delay + jitter);
      }
    }

    throw lastError;
  }

  /**
   * Execute function with timeout
   */
  static async executeWithTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs: number = 30000,
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new AppError(
                ErrorCode.TIMEOUT_ERROR,
                "Request took too long. Please try again.",
                `Request timeout after ${timeoutMs}ms`,
                408,
                undefined,
                true,
              ),
            ),
          timeoutMs,
        ),
      ),
    ]);
  }

  /**
   * Execute function with retry and timeout
   */
  static async executeWithRetryAndTimeout<T>(
    fn: () => Promise<T>,
    retryConfig?: Partial<RetryConfig>,
    timeoutMs: number = 30000,
  ): Promise<T> {
    return this.executeWithRetry(
      () => this.executeWithTimeout(fn, timeoutMs),
      retryConfig,
    );
  }

  /**
   * Calculate exponential backoff delay
   */
  private static calculateBackoffDelay(
    attempt: number,
    initialDelay: number,
    maxDelay: number,
    multiplier: number,
  ): number {
    const exponentialDelay = initialDelay * Math.pow(multiplier, attempt - 1);
    return Math.min(exponentialDelay, maxDelay);
  }

  /**
   * Sleep utility
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Batch retry handler for concurrent operations
 */
export class BatchRetryHandler {
  static async executeWithRetry<T>(
    operations: Array<() => Promise<T>>,
    config: Partial<RetryConfig> = {},
  ): Promise<(T | Error)[]> {
    return Promise.all(
      operations.map((op) =>
        RetryHandler.executeWithRetry(op, config).catch((err) => err),
      ),
    );
  }

  /**
   * Execute with fail-fast strategy
   */
  static async executeFastFail<T>(
    operations: Array<() => Promise<T>>,
    config: Partial<RetryConfig> = {},
  ): Promise<T[]> {
    return Promise.all(
      operations.map((op) => RetryHandler.executeWithRetry(op, config)),
    );
  }

  /**
   * Execute with partial failure tolerance
   */
  static async executeWithTolerance<T>(
    operations: Array<() => Promise<T>>,
    minSuccessRate: number = 0.5,
    config: Partial<RetryConfig> = {},
  ): Promise<{ results: (T | Error)[]; successCount: number }> {
    const results = await this.executeWithRetry(operations, config);
    const successCount = results.filter((r) => !(r instanceof Error)).length;
    const successRate = successCount / operations.length;

    if (successRate < minSuccessRate) {
      throw new AppError(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Too many operations failed. Please try again.",
        `Success rate ${successRate} below threshold ${minSuccessRate}`,
        500,
        undefined,
        true,
      );
    }

    return { results, successCount };
  }
}

/**
 * Circuit breaker pattern for preventing cascading failures
 */
export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime: number | null = null;
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;

  constructor(failureThreshold: number = 5, resetTimeoutMs: number = 60000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeoutMs = resetTimeoutMs;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - (this.lastFailureTime || 0) > this.resetTimeoutMs) {
        this.state = "HALF_OPEN";
      } else {
        throw new AppError(
          ErrorCode.SERVICE_UNAVAILABLE,
          "Service is temporarily unavailable. Please try again later.",
          "Circuit breaker is OPEN",
          503,
          undefined,
          true,
        );
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
    }
  }

  getState(): "CLOSED" | "OPEN" | "HALF_OPEN" {
    return this.state;
  }

  reset(): void {
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = "CLOSED";
  }
}

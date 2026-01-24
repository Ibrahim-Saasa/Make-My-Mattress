/**
 * API Service with Error Handling
 * Drop-in replacement for your fetch calls
 */

import {
  AppError,
  ErrorCode,
  ErrorSeverity,
  httpStatusToErrorCode,
} from "../src/utils/errorTypes";
import { errorLogger } from "../src/utils/errorLogger";
import { RetryHandler, CircuitBreaker } from "../src/utils/errorRecovery";

export interface APIRequestOptions extends RequestInit {
  timeout?: number;
  retryable?: boolean;
  maxRetries?: number;
}

export class APIService {
  private baseURL: string;
  private defaultTimeout = 30000; // 30 seconds
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();

  constructor(baseURL: string = "") {
    this.baseURL = baseURL;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: APIRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    options?: APIRequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    options?: APIRequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: any,
    options?: APIRequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: APIRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }

  /**
   * Core request handler with error handling, retry, and circuit breaker
   */
  private async request<T>(
    endpoint: string,
    options: APIRequestOptions = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const timeout = options.timeout ?? this.defaultTimeout;
    const method = options.method ?? "GET";
    const maxRetries = options.maxRetries ?? 3;
    const retryable = options.retryable !== false;

    // Get or create circuit breaker for this endpoint
    const circuitBreaker = this.getCircuitBreaker(endpoint);

    try {
      return await circuitBreaker.execute(() =>
        RetryHandler.executeWithRetryAndTimeout(
          async () => {
            // Create AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            try {
              // Extract custom properties that aren't part of RequestInit
              const {
                timeout: _,
                retryable: __,
                maxRetries: ___,
                ...fetchOptions
              } = options;

              const response = await fetch(url, {
                ...fetchOptions,
                headers: {
                  "Content-Type": "application/json",
                  ...options.headers,
                },
                signal: controller.signal,
              });

              clearTimeout(timeoutId);

              // Handle non-OK responses
              if (!response.ok) {
                const contentType = response.headers.get("content-type");
                let errorMessage = `HTTP ${response.status}`;
                let errorData: any = {};

                // Try to parse error response
                if (contentType?.includes("application/json")) {
                  try {
                    errorData = await response.json();
                    errorMessage =
                      errorData.message || errorData.error || errorMessage;
                  } catch {
                    // Failed to parse JSON
                  }
                }

                throw new AppError(
                  httpStatusToErrorCode(response.status),
                  this.getUserMessage(response.status),
                  errorMessage,
                  response.status,
                  this.getSeverity(response.status),
                  this.isRetryable(response.status) && retryable,
                  {
                    endpoint,
                    method,
                    metadata: errorData,
                  },
                );
              }

              // Parse response
              const contentType = response.headers.get("content-type");
              if (contentType?.includes("application/json")) {
                return (await response.json()) as T;
              }

              return (await response.text()) as T;
            } catch (error) {
              clearTimeout(timeoutId);

              // Handle abort/timeout errors
              if (error instanceof Error && error.name === "AbortError") {
                throw new AppError(
                  ErrorCode.TIMEOUT_ERROR,
                  "Request timed out. Please try again.",
                  `Request to ${endpoint} timed out after ${timeout}ms`,
                  408,
                  ErrorSeverity.MEDIUM,
                  true,
                  { endpoint, method, timeout },
                );
              }

              throw error;
            }
          },
          {
            maxAttempts: maxRetries,
            retryableErrorCodes: [
              ErrorCode.TIMEOUT_ERROR,
              ErrorCode.NETWORK_ERROR,
              ErrorCode.CONNECTION_REFUSED,
              ErrorCode.SERVICE_UNAVAILABLE,
              ErrorCode.INTERNAL_SERVER_ERROR,
            ],
          },
          timeout,
        ),
      );
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        const appError = new AppError(
          ErrorCode.NETWORK_ERROR,
          "Unable to connect to the server. Please check your internet connection.",
          error.message,
          0,
          ErrorSeverity.MEDIUM,
          true,
          { endpoint, method },
        );
        errorLogger.logError(appError);
        throw appError;
      }

      // Re-throw AppError
      if (error instanceof AppError) {
        errorLogger.logError(error);
        throw error;
      }

      // Handle unknown errors
      const unknownError = new AppError(
        ErrorCode.UNKNOWN_ERROR,
        "An unexpected error occurred. Please try again.",
        String(error),
        500,
        ErrorSeverity.HIGH,
        true,
        { endpoint, method },
      );
      errorLogger.logError(unknownError);
      throw unknownError;
    }
  }

  /**
   * Get or create circuit breaker for endpoint
   */
  private getCircuitBreaker(endpoint: string): CircuitBreaker {
    if (!this.circuitBreakers.has(endpoint)) {
      this.circuitBreakers.set(endpoint, new CircuitBreaker(5, 60000));
    }
    return this.circuitBreakers.get(endpoint)!;
  }

  /**
   * Map HTTP status to user-friendly message
   */
  private getUserMessage(statusCode: number): string {
    const messages: Record<number, string> = {
      400: "Bad request. Please check your input.",
      401: "You are not authorized. Please log in.",
      403: "You do not have permission to access this resource.",
      404: "The requested resource was not found.",
      409: "This resource already exists.",
      422: "Please check your input and try again.",
      429: "Too many requests. Please wait a moment.",
      500: "Server error. Please try again later.",
      503: "Service temporarily unavailable. Please try again later.",
    };
    return messages[statusCode] ?? "An error occurred. Please try again.";
  }

  /**
   * Determine if error is retryable based on status code
   */
  private isRetryable(statusCode: number): boolean {
    // Retry on server errors and specific client errors
    return statusCode >= 500 || statusCode === 408 || statusCode === 429;
  }

  /**
   * Determine severity based on status code
   */
  private getSeverity(statusCode: number): ErrorSeverity {
    if (statusCode >= 500) return ErrorSeverity.HIGH;
    if (statusCode >= 400) return ErrorSeverity.MEDIUM;
    return ErrorSeverity.LOW;
  }

  /**
   * Reset circuit breaker for endpoint
   */
  resetCircuitBreaker(endpoint: string): void {
    const breaker = this.circuitBreakers.get(endpoint);
    if (breaker) {
      breaker.reset();
    }
  }

  /**
   * Reset all circuit breakers
   */
  resetAllCircuitBreakers(): void {
    this.circuitBreakers.forEach((breaker) => breaker.reset());
  }

  /**
   * Get circuit breaker status
   */
  getCircuitBreakerStatus(endpoint: string): string | null {
    return this.circuitBreakers.get(endpoint)?.getState() ?? null;
  }
}

/**
 * Global API service instance
 * Usage: import { apiService } from './services/apiService'
 */
export const apiService = new APIService(
  import.meta.env.VITE_API_BASE_URL || "",
);

/**
 * Example usage in your services:
 *
 * // Get products
 * export async function getProducts() {
 *   return apiService.get('/api/products');
 * }
 *
 * // Create order
 * export async function createOrder(orderData: any) {
 *   return apiService.post('/api/orders', orderData, {
 *     timeout: 60000,  // 60 second timeout
 *     maxRetries: 2
 *   });
 * }
 *
 * // Update pricing
 * export async function updatePricing(id: string, data: any) {
 *   return apiService.patch(`/api/pricing/${id}`, data);
 * }
 *
 * // Delete user
 * export async function deleteUser(userId: string) {
 *   return apiService.delete(`/api/users/${userId}`);
 * }
 */

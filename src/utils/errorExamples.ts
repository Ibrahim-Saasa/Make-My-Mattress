/**
 * Error Handling Integration Examples
 * Shows how to use the error handling system throughout the application
 */

import { AppError, ErrorCode, ErrorSeverity } from "./errorTypes";
import { errorLogger } from "./errorLogger";
import { RetryHandler, CircuitBreaker } from "./errorRecovery";

// ============================================================================
// 1. BASIC ERROR THROWING & LOGGING
// ============================================================================

export async function exampleBasicError() {
  try {
    // Simulate an API call failure
    const response = await fetch('/api/invalid-endpoint');
    if (!response.ok) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        'Product not found. Please check the product ID.',
        `Product API returned status ${response.status}`,
        response.status,
        ErrorSeverity.MEDIUM,
        false
      );
    }
  } catch (error) {
    if (error instanceof AppError) {
      // Log the app error
      errorLogger.logError(error, {
        userId: 'user-123',
        endpoint: '/api/invalid-endpoint',
        method: 'GET',
      });
    }
    throw error;
  }
}

// ============================================================================
// 2. RETRY WITH EXPONENTIAL BACKOFF
// ============================================================================

export async function exampleRetryLogic() {
  try {
    // Automatically retry on network failures
    const result = await RetryHandler.executeWithRetry(
      async () => {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      },
      {
        maxAttempts: 3,
        initialDelayMs: 1000,
        backoffMultiplier: 2,
      }
    );
    return result;
  } catch (error) {
    errorLogger.logError(error as Error);
    throw error;
  }
}

// ============================================================================
// 3. RETRY WITH TIMEOUT
// ============================================================================

export async function exampleRetryWithTimeout() {
  try {
    const result = await RetryHandler.executeWithRetryAndTimeout(
      async () => {
        // Your async operation
        return await fetch('/api/checkout').then((r) => r.json());
      },
      { maxAttempts: 2 },
      15000 // 15 second timeout
    );
    return result;
  } catch (error) {
    if (error instanceof AppError && error.code === ErrorCode.TIMEOUT_ERROR) {
      // Handle timeout specifically
      console.warn('Request timed out after 15 seconds');
    }
    throw error;
  }
}

// ============================================================================
// 4. CIRCUIT BREAKER PATTERN
// ============================================================================

const paymentCircuitBreaker = new CircuitBreaker(5, 60000); // 5 failures, 60s reset

export async function exampleCircuitBreaker() {
  try {
    const result = await paymentCircuitBreaker.execute(async () => {
      return await fetch('/api/process-payment').then((r) => r.json());
    });
    return result;
  } catch (error) {
    if (error instanceof AppError && error.code === ErrorCode.SERVICE_UNAVAILABLE) {
      // Payment service is down, redirect to retry page
      console.warn('Payment service is unavailable');
    }
    throw error;
  }
}

// ============================================================================
// 5. BATCH OPERATIONS WITH RETRY
// ============================================================================

export async function exampleBatchOperations() {
  const operations = [
    () => fetch('/api/product/1').then((r) => r.json()),
    () => fetch('/api/product/2').then((r) => r.json()),
    () => fetch('/api/product/3').then((r) => r.json()),
  ];

  try {
    // Execute all operations with retry
    const results = await Promise.all(operations.map((op) => RetryHandler.executeWithRetry(op)));
    return results;
  } catch (error) {
    errorLogger.logError(error as Error);
    throw error;
  }
}

// ============================================================================
// 6. IN COMPONENT: FORM SUBMISSION WITH ERROR HANDLING
// ============================================================================

export async function exampleFormSubmission(formData: Record<string, any>) {
  try {
    // Validate form data
    if (!formData.email) {
      throw new AppError(
        ErrorCode.MISSING_REQUIRED_FIELD,
        'Please enter your email address.',
        'Email field is required',
        400,
        ErrorSeverity.LOW,
        false
      );
    }

    // Submit with retry
    const result = await RetryHandler.executeWithRetry(
      async () => {
        const response = await fetch('/api/submit-form', {
          method: 'POST',
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new AppError(
            ErrorCode.VALIDATION_ERROR,
            'Please check your input and try again.',
            data.error || 'Form validation failed',
            response.status,
            ErrorSeverity.MEDIUM,
            response.status >= 500
          );
        }

        return response.json();
      },
      { maxAttempts: 2 }
    );

    return result;
  } catch (error) {
    if (error instanceof AppError) {
      // Show user-friendly error message
      alert(error.userMessage);
      errorLogger.logError(error, { metadata: { formData } });
    }
    throw error;
  }
}

// ============================================================================
// 7. IN REACT COMPONENT: USING ERROR HANDLER HOOK
// ============================================================================

/*
The React example component lives in `errorExamples.component.tsx` so this file
can stay as plain TypeScript and avoid JSX parse issues.
*/

// ============================================================================
// 8. API CLIENT WITH ERROR HANDLING
// ============================================================================

export class APIClient {
  private circuitBreaker = new CircuitBreaker(5, 60000);

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.circuitBreaker.execute(() =>
      RetryHandler.executeWithRetryAndTimeout(async () => {
        const response = await fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new AppError(
            ErrorCode.INTERNAL_SERVER_ERROR,
            'An error occurred. Please try again.',
            errorData.message || `HTTP ${response.status}`,
            response.status,
            ErrorSeverity.MEDIUM,
            response.status >= 500,
            {
              endpoint,
              method: options.method,
            }
          );
        }

        return response.json();
      })
    );
  }
}

// Usage
const client = new APIClient();

export async function fetchProducts() {
  try {
    const products = await client.get('/api/products');
    return products;
  } catch (error) {
    errorLogger.logError(error as Error, { endpoint: '/api/products' });
    throw error;
  }
}

// ============================================================================
// 9. WRAP APP ROOT WITH ERROR BOUNDARY
// ============================================================================

/*
In your App.tsx:

import { ErrorBoundary } from './components/ErrorBoundary';
import ErrorPage from './components/ErrorPage';

export const App = () => {
  return (
    <ErrorBoundary
      onError={(error, info) => {
        console.error('Error caught by boundary:', error);
      }}
      fallback={(error, retry) => (
        <ErrorPage error={error} />
      )}
    >
      <YourAppContent />
    </ErrorBoundary>
  );
};
*/

// ============================================================================
// 10. DEBUGGING: VIEW ERROR LOGS
// ============================================================================

export function viewErrorLogs() {
  // Get all error logs
  const allErrors = errorLogger.getErrorLogs();
  console.table(allErrors);

  // Get errors by severity
  const criticalErrors = errorLogger.getErrorsBySeverity(ErrorSeverity.CRITICAL);
  console.log('Critical errors:', criticalErrors);

  // Get errors by code
  const networkErrors = errorLogger.getErrorsByCode(ErrorCode.NETWORK_ERROR);
  console.log('Network errors:', networkErrors);

  // Export for analysis
  const exported = errorLogger.exportLogs();
  console.log('Exported logs:', exported);

  // Clear logs
  // errorLogger.clearLogs();
}

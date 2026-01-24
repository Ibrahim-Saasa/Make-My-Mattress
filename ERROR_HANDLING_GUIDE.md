/\*\*

- ERROR HANDLING & RECOVERY SYSTEM
- Complete Implementation Guide
  \*/

# Error Handling Architecture

Your error handling system consists of 4 main components:

## 1. **Error Types** (`src/utils/errorTypes.ts`)

- Comprehensive error code enum
- `AppError` class with context
- HTTP status code mapping

## 2. **Error Logger** (`src/utils/errorLogger.ts`)

- Global error logging
- Error persistence (localStorage)
- Monitoring service integration
- Error filtering and retrieval

## 3. **Error Recovery** (`src/utils/errorRecovery.ts`)

- Retry logic with exponential backoff
- Circuit breaker pattern
- Timeout handling
- Batch operations

## 4. **Error Boundary** (`components/ErrorBoundary.tsx`)

- React error boundary component
- Default fallback UI
- Error context capture

## 5. **Error Page** (`components/ErrorPage.tsx`)

- Detailed error display
- Recovery options
- Error logs visualization

---

# Quick Start

## Setup: Wrap App with Error Boundary

```tsx
// App.tsx
import { ErrorBoundary } from "./components/ErrorBoundary";
import ErrorPage from "./components/ErrorPage";

export const App = () => {
  return (
    <ErrorBoundary
      onError={(error, info) => {
        console.error("Error caught:", error);
      }}
    >
      <YourAppContent />
    </ErrorBoundary>
  );
};
```

## Throw Errors

```typescript
import { AppError, ErrorCode, ErrorSeverity } from "./src/utils/errorTypes";

throw new AppError(
  ErrorCode.VALIDATION_ERROR,
  "Please enter a valid email address.", // User-friendly
  "Email format validation failed", // Developer message
  400, // HTTP status
  ErrorSeverity.LOW, // Severity
  false, // Retryable
  { userId: "user-123" }, // Context
);
```

## Use Retry Logic

```typescript
import { RetryHandler } from "./src/utils/errorRecovery";

// Simple retry
const data = await RetryHandler.executeWithRetry(
  () => fetch("/api/data").then((r) => r.json()),
  { maxAttempts: 3 },
);

// Retry with timeout
const data = await RetryHandler.executeWithRetryAndTimeout(
  () => myAsyncOperation(),
  { maxAttempts: 2 },
  15000, // 15 second timeout
);
```

## Log Errors

```typescript
import { errorLogger } from "./src/utils/errorLogger";

errorLogger.logError(error, {
  userId: "user-123",
  endpoint: "/api/checkout",
  method: "POST",
});

// View logs
const logs = errorLogger.getErrorLogs();
const errors = errorLogger.getErrorsBySeverity("CRITICAL");
```

## Use in React Components

```tsx
import { useErrorHandler } from "./components/ErrorBoundary";
import { RetryHandler } from "./src/utils/errorRecovery";
import { useState } from "react";

export const MyComponent = () => {
  const [error, setError] = useState<AppError | null>(null);
  const handleError = useErrorHandler();

  const handleSubmit = async (data: any) => {
    try {
      const result = await RetryHandler.executeWithRetry(
        () => submitData(data),
        { maxAttempts: 2 },
      );
      // Success!
    } catch (err) {
      if (err instanceof AppError) {
        setError(err);
      } else {
        handleError(err as Error, { context: "submit" });
      }
    }
  };

  return (
    <>
      {error && <div className="error">{error.userMessage}</div>}
      <button onClick={() => handleSubmit({})}>Submit</button>
    </>
  );
};
```

---

# Error Codes Reference

### Network Errors

- `NETWORK_ERROR` - General network failure
- `TIMEOUT_ERROR` - Request timeout
- `CONNECTION_REFUSED` - Connection failed
- `SERVICE_UNAVAILABLE` - Server unavailable (503)

### Authentication Errors

- `UNAUTHORIZED` - Missing/invalid auth (401)
- `FORBIDDEN` - Insufficient permissions (403)
- `SESSION_EXPIRED` - Session no longer valid
- `INVALID_CREDENTIALS` - Login failed

### Validation Errors

- `VALIDATION_ERROR` - Form/input validation (400)
- `INVALID_INPUT` - Invalid data format (422)
- `MISSING_REQUIRED_FIELD` - Required field missing
- `FILE_SIZE_EXCEEDED` - Upload too large
- `INVALID_FILE_TYPE` - Unsupported file type

### Business Logic Errors

- `INSUFFICIENT_INVENTORY` - Out of stock
- `PRICE_MISMATCH` - Price changed
- `ORDER_PROCESSING_FAILED` - Order failed
- `PAYMENT_FAILED` - Payment declined
- `SHIPPING_UNAVAILABLE` - Can't ship to location

### Server Errors

- `INTERNAL_SERVER_ERROR` - 500 error
- `RESOURCE_NOT_FOUND` - 404 not found
- `DUPLICATE_RESOURCE` - Already exists (409)
- `DATABASE_ERROR` - Database issue
- `QUERY_FAILED` - Database query failed

### Integration Errors

- `THIRD_PARTY_API_ERROR` - External API failed
- `EXTERNAL_SERVICE_FAILURE` - External service down

---

# Severity Levels

- **LOW**: User notification only
- **MEDIUM**: Retry recommended
- **HIGH**: Critical, immediate action needed
- **CRITICAL**: System-level failure

---

# Circuit Breaker Pattern

For critical services that might cascade failures:

```typescript
import { CircuitBreaker } from "./src/utils/errorRecovery";

const paymentBreaker = new CircuitBreaker(
  5, // Fail after 5 consecutive failures
  60000, // Reset after 60 seconds
);

try {
  await paymentBreaker.execute(() => processPayment());
} catch (error) {
  // Service is temporarily unavailable
  // User should be asked to retry later
}
```

---

# Debugging & Monitoring

## View Logs in Console

```typescript
const logs = errorLogger.getErrorLogs();
console.table(logs);
```

## Export Logs

```typescript
const exported = errorLogger.exportLogs();
console.log(exported);
// Copy and save for analysis
```

## Development vs Production

- **Development**: Errors logged to console with full details
- **Production**: Errors sent to monitoring service (Sentry/DataDog)

Configure in `src/utils/errorLogger.ts`:

```typescript
private isProduction = import.meta.env.PROD;
```

---

# Best Practices

1. **Always provide user-friendly messages**

   ```typescript
   // ✅ Good
   throw new AppError(..., "Couldn't process your order. Try again.", ...);

   // ❌ Bad
   throw new AppError(..., "SQLException: unique constraint", ...);
   ```

2. **Mark operations as retryable when appropriate**

   ```typescript
   // ✅ Network error - retryable
   throw new AppError(..., ErrorCode.NETWORK_ERROR, ..., true);

   // ❌ Invalid input - not retryable
   throw new AppError(..., ErrorCode.VALIDATION_ERROR, ..., false);
   ```

3. **Include context for debugging**

   ```typescript
   errorLogger.logError(error, {
     userId: currentUser.id,
     endpoint: "/api/checkout",
     method: "POST",
   });
   ```

4. **Use appropriate severity levels**

   ```typescript
   // Critical system failure
   throw new AppError(..., ErrorSeverity.CRITICAL, ...);

   // User input issue
   throw new AppError(..., ErrorSeverity.LOW, ...);
   ```

5. **Implement timeout for long-running operations**
   ```typescript
   const result = await RetryHandler.executeWithTimeout(
     operation,
     30000, // 30 seconds max
   );
   ```

---

# Integration Checklist

- [ ] Wrap App with `<ErrorBoundary>`
- [ ] Create API client using `RetryHandler`
- [ ] Replace existing error handling with `AppError`
- [ ] Add error logging to critical paths
- [ ] Test error scenarios (network, validation, server)
- [ ] Configure monitoring service endpoint
- [ ] Update error page with branding
- [ ] Test circuit breaker for critical services
- [ ] Set up error alerts for production

---

# Files Created

```
src/
  utils/
    errorTypes.ts       - Error definitions & AppError class
    errorLogger.ts      - Centralized logging service
    errorRecovery.ts    - Retry & circuit breaker logic
    errorExamples.ts    - Usage examples

components/
  ErrorBoundary.tsx     - React error boundary
  ErrorPage.tsx         - Error display page
```

All files are fully documented and ready to use!

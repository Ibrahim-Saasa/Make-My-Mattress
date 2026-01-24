/\*\*

- ERROR HANDLING SYSTEM - QUICK REFERENCE
  \*/

# Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Error Handling System                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Application Layer                                   │    │
│  │  ├─ React Components                                 │    │
│  │  ├─ Service Methods                                  │    │
│  │  └─ API Calls                                        │    │
│  └──────────────────────┬──────────────────────────────┘    │
│                         │                                     │
│                         ▼                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Error Recovery Layer                               │    │
│  │  ├─ RetryHandler (Exponential Backoff)              │    │
│  │  ├─ CircuitBreaker (Failure Prevention)             │    │
│  │  └─ APIService (HTTP + Error Mapping)               │    │
│  └──────────────────────┬──────────────────────────────┘    │
│                         │                                     │
│                         ▼                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Error Detection Layer                              │    │
│  │  ├─ AppError (Structured Error)                     │    │
│  │  ├─ ErrorLogger (Centralized Logging)               │    │
│  │  └─ Global Error Handlers                           │    │
│  └──────────────────────┬──────────────────────────────┘    │
│                         │                                     │
│                         ▼                                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Error UI Layer                                     │    │
│  │  ├─ ErrorBoundary (Catch Component Errors)          │    │
│  │  ├─ ErrorPage (Display Error Details)               │    │
│  │  └─ Inline Error Messages (Form Validation)         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Monitoring Layer                                   │    │
│  │  └─ External Service (Sentry/DataDog)               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

# File Structure

```
src/utils/
├── errorTypes.ts           # Error definitions (20 error codes)
├── errorLogger.ts          # Global error logging & persistence
├── errorRecovery.ts        # Retry logic, circuit breaker
└── errorExamples.ts        # Usage examples & patterns

services/
├── apiService.ts          # HTTP client with error handling
└── (existing services)

components/
├── ErrorBoundary.tsx      # React error boundary
├── ErrorPage.tsx          # Error display page
└── (existing components)
```

---

# Data Flow

## 1. Error Occurs in Application

```typescript
// User tries to checkout
try {
  await checkout(orderData);
} catch (error) {
  // Error is caught here
}
```

## 2. Error Detection & Conversion

```
Raw Error (Network, Validation, etc.)
    ↓
Convert to AppError with:
  - Error Code (enum)
  - User Message
  - Developer Message
  - Status Code
  - Severity Level
  - Retryable Flag
  - Context (userId, endpoint, etc.)
```

## 3. Recovery Attempt

```
AppError
  ↓
Is Retryable? → YES → Retry with Exponential Backoff
  ↓ NO
Log Error + Send to Monitoring Service
  ↓
Display to User
```

## 4. Error Logging

```
┌─────────────────────┐
│   Error Logged      │
├─────────────────────┤
│ Memory (Last 100)   │
│ LocalStorage (10)   │
│ Analytics Service   │
└─────────────────────┘
```

## 5. User Notification

```
Application Error
  ├─ Within Component → Inline Error Message
  ├─ In Boundary → Error Fallback UI
  └─ Page-level → Error Page with Recovery Options
```

---

# Decision Tree: Which Error Handling to Use?

```
Does error occur?
│
├─ In React Component
│  ├─ Form Validation? → Inline validation error
│  ├─ API Call? → Use try/catch with RetryHandler
│  └─ Async Operation? → Use useErrorHandler hook
│
├─ In Service/Utility
│  ├─ Network Call? → Use apiService + retry
│  ├─ Validation? → Throw AppError with code
│  └─ Critical Path? → Use CircuitBreaker
│
└─ Uncaught Error
   ├─ Component Error? → ErrorBoundary catches
   └─ Promise Rejection? → Global handler catches
```

---

# Error Code Selection Guide

```
User Input Issue
└─ VALIDATION_ERROR (400)
└─ MISSING_REQUIRED_FIELD (400)
└─ INVALID_INPUT (422)
└─ INVALID_FILE_TYPE (400)
└─ FILE_SIZE_EXCEEDED (400)

Authentication Issue
└─ UNAUTHORIZED (401)
└─ SESSION_EXPIRED (401)
└─ INVALID_CREDENTIALS (401)

Authorization Issue
└─ FORBIDDEN (403)

Resource Issue
└─ RESOURCE_NOT_FOUND (404)
└─ INSUFFICIENT_INVENTORY (409)
└─ DUPLICATE_RESOURCE (409)

Business Logic Issue
└─ PRICE_MISMATCH (409)
└─ ORDER_PROCESSING_FAILED (400/500)
└─ PAYMENT_FAILED (402)
└─ SHIPPING_UNAVAILABLE (400)

Network Issue
└─ NETWORK_ERROR (0)
└─ TIMEOUT_ERROR (408)
└─ CONNECTION_REFUSED (0)
└─ SERVICE_UNAVAILABLE (503)

Server Issue
└─ INTERNAL_SERVER_ERROR (500)
└─ DATABASE_ERROR (500)
└─ QUERY_FAILED (500)

Integration Issue
└─ THIRD_PARTY_API_ERROR (500)
└─ EXTERNAL_SERVICE_FAILURE (500)
```

---

# Severity Selection Guide

```
Severity Level  │ When to Use           │ User Action
─────────────────────────────────────────────────────────
LOW            │ Non-critical         │ Notification only
               │ validation           │ (e.g., invalid email)
─────────────────────────────────────────────────────────
MEDIUM         │ Normal errors        │ Retry recommended
               │ API failures         │ (e.g., network timeout)
─────────────────────────────────────────────────────────
HIGH           │ Critical errors      │ Immediate action
               │ Auth failures        │ (e.g., session expired)
─────────────────────────────────────────────────────────
CRITICAL       │ System failures      │ Full page error
               │ Database down        │ (e.g., service down)
```

---

# Retry Logic Behavior

```
Request Attempt
    ↓
Error Occurs?
├─ NO → Return Success
└─ YES → Check if Retryable
         ├─ NO → Throw Error
         └─ YES → Wait with Backoff
                  ├─ Attempt 1: Wait 1s + jitter
                  ├─ Attempt 2: Wait 2s + jitter
                  ├─ Attempt 3: Wait 4s + jitter
                  ├─ Max Retries Reached?
                  │  ├─ YES → Throw Error
                  │  └─ NO → Retry
                  └─ (Capped at maxDelayMs)
```

---

# Circuit Breaker States

```
CLOSED (Normal)
    ↓
Multiple Failures (≥ threshold)
    ↓
OPEN (Rejecting)
    ↓
Timeout Elapsed (resetTimeoutMs)
    ↓
HALF_OPEN (Testing)
    ↓
    ├─ Success? → CLOSED
    └─ Failure? → OPEN (reset timeout)
```

---

# Example: Full Request Flow

```typescript
// 1. User clicks checkout
const handleCheckout = async (orderData) => {
  try {
    // 2. API Service makes request with retry
    const response = await apiService.post("/api/orders", orderData, {
      maxRetries: 3,
    });

    // 3. Success
    showSuccess("Order placed!");
  } catch (error) {
    // 4. Error caught
    if (error instanceof AppError) {
      // 5. Check if user-recoverable
      if (error.retryable) {
        showError(error.userMessage);
        showRetryButton();
      } else {
        showError(error.userMessage);
        logError(error);
      }
    }
  }
};

// Behind the scenes:
// - RetryHandler retries network errors
// - CircuitBreaker prevents cascade failures
// - errorLogger persists errors
// - Global handlers catch uncaught errors
// - ErrorBoundary wraps component errors
```

---

# Testing Error Handling

```typescript
// Test 1: Network Error
await apiService.get('/api/fail-network')
  .catch(err => expect(err.code).toBe(NETWORK_ERROR))

// Test 2: Retry Logic
let attempts = 0;
const operation = () => {
  attempts++;
  if (attempts < 3) throw new Error('Fail');
  return 'Success';
};
const result = await RetryHandler.executeWithRetry(operation);
expect(attempts).toBe(3);

// Test 3: Circuit Breaker
const breaker = new CircuitBreaker(2);
for (let i = 0; i < 2; i++) {
  try {
    await breaker.execute(() => Promise.reject('Fail'));
  } catch {
    // Expected failures
  }
}
// Circuit should be OPEN now
await breaker.execute(() => Promise.resolve('OK'))
  .catch(err => expect(err.code).toBe(SERVICE_UNAVAILABLE))

// Test 4: Error Boundary
render(
  <ErrorBoundary>
    <ComponentThatThrows />
  </ErrorBoundary>
);
expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
```

---

# Common Patterns

## API Call with Retry

```typescript
const products = await apiService.get("/api/products", {
  maxRetries: 3,
  timeout: 15000,
});
```

## Form Submission with Validation

```typescript
if (!email) {
  throw new AppError(
    ErrorCode.MISSING_REQUIRED_FIELD,
    "Email is required",
    "Email validation failed",
  );
}
```

## Critical Operation with Circuit Breaker

```typescript
const result = await paymentBreaker.execute(() => processPayment(amount));
```

## Component Error Handling

```typescript
const [error, setError] = useState<AppError | null>(null);

const handleSubmit = async (data) => {
  try {
    await submitData(data);
  } catch (err) {
    if (err instanceof AppError) setError(err);
  }
};

return error && <div>{error.userMessage}</div>;
```

---

# Monitoring Checklist

- [ ] Set up Sentry/DataDog webhook in errorLogger.ts
- [ ] Configure error alerts for CRITICAL severity
- [ ] Monitor circuit breaker state changes
- [ ] Track retry success rates
- [ ] Set up error rate dashboards
- [ ] Create on-call alert for error spikes
- [ ] Regular error log review
- [ ] Test error recovery paths in staging

---

# Performance Considerations

- Retry backoff increases with each attempt
- Jitter prevents thundering herd
- Circuit breaker prevents cascading failures
- Memory limited to 100 recent errors
- localStorage limited to 10 errors
- Async error logging doesn't block UI
- Error logging only in production

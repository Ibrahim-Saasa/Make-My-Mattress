/\*\*

- ERROR HANDLING SYSTEM - QUICK REFERENCE CARD
- Keep this open while working!
  \*/

╔════════════════════════════════════════════════════════════════════════════╗
║ ERROR HANDLING QUICK REFERENCE ║
╚════════════════════════════════════════════════════════════════════════════╝

┌─ IMPORT STATEMENTS ─────────────────────────────────────────────────────────┐
│ │
│ // Error types & definitions │
│ import { AppError, ErrorCode, ErrorSeverity } from './src/utils/errorTypes';│
│ │
│ // Error logger │
│ import { errorLogger } from './src/utils/errorLogger'; │
│ │
│ // Retry & circuit breaker │
│ import { RetryHandler, CircuitBreaker } from './src/utils/errorRecovery'; │
│ │
│ // HTTP client │
│ import { apiService } from './services/apiService'; │
│ │
│ // Error boundary │
│ import { ErrorBoundary } from './components/ErrorBoundary'; │
│ │
└──────────────────────────────────────────────────────────────────────────────┘

┌─ THROWING ERRORS ───────────────────────────────────────────────────────────┐
│ │
│ // Basic error │
│ throw new AppError( │
│ ErrorCode.VALIDATION_ERROR, │
│ 'Invalid email address', // User message │
│ 'Email regex failed' // Developer message │
│ ); │
│ │
│ // Full error with context │
│ throw new AppError( │
│ ErrorCode.PAYMENT_FAILED, │
│ 'Payment could not be processed', // User message │
│ 'Stripe API returned 402', // Developer message │
│ 402, // HTTP status │
│ ErrorSeverity.HIGH, // Severity │
│ true, // Retryable? │
│ { userId: 'user-123' } // Context │
│ ); │
│ │
└──────────────────────────────────────────────────────────────────────────────┘

┌─ HTTP REQUESTS ─────────────────────────────────────────────────────────────┐
│ │
│ // GET │
│ const data = await apiService.get('/api/products'); │
│ │
│ // POST │
│ const result = await apiService.post('/api/orders', { amount: 100 }); │
│ │
│ // With options │
│ const data = await apiService.get('/api/products', { │
│ maxRetries: 2, │
│ timeout: 15000 │
│ }); │
│ │
│ // Other methods: PUT, PATCH, DELETE │
│ await apiService.put('/api/user/123', { name: 'John' }); │
│ │
└──────────────────────────────────────────────────────────────────────────────┘

┌─ RETRY LOGIC ───────────────────────────────────────────────────────────────┐
│ │
│ // Simple retry │
│ const result = await RetryHandler.executeWithRetry( │
│ () => myAsyncFunction(), │
│ { maxAttempts: 3 } │
│ ); │
│ │
│ // With timeout │
│ const result = await RetryHandler.executeWithRetryAndTimeout( │
│ () => myAsyncFunction(), │
│ { maxAttempts: 2 }, │
│ 30000 // 30 second timeout │
│ ); │
│ │
│ // Batch operations │
│ const results = await Promise.all([ │
│ RetryHandler.executeWithRetry(() => op1()), │
│ RetryHandler.executeWithRetry(() => op2()), │
│ ]); │
│ │
└──────────────────────────────────────────────────────────────────────────────┘

┌─ ERROR HANDLING IN COMPONENTS ──────────────────────────────────────────────┐
│ │
│ const [error, setError] = useState<AppError | null>(null); │
│ │
│ const handleSubmit = async (data: any) => { │
│ try { │
│ const result = await apiService.post('/api/submit', data); │
│ // Success │
│ } catch (err) { │
│ if (err instanceof AppError) { │
│ setError(err); │
│ // Show user-friendly message │
│ } │
│ } │
│ }; │
│ │
│ return ( │
│ <> │
│ {error && <div className="error">{error.userMessage}</div>} │
│ <button onClick={handleSubmit}>Submit</button> │
│ </> │
│ ); │
│ │
└──────────────────────────────────────────────────────────────────────────────┘

┌─ ERROR LOGGING ─────────────────────────────────────────────────────────────┐
│ │
│ // Log error with context │
│ errorLogger.logError(error, { │
│ userId: 'user-123', │
│ endpoint: '/api/checkout', │
│ method: 'POST' │
│ }); │
│ │
│ // Get all errors (in browser console) │
│ errorLogger.getErrorLogs() │
│ │
│ // Get errors by severity │
│ errorLogger.getErrorsBySeverity('CRITICAL') │
│ │
│ // Export logs for analysis │
│ const json = errorLogger.exportLogs() │
│ │
│ // Clear logs │
│ errorLogger.clearLogs() │
│ │
└──────────────────────────────────────────────────────────────────────────────┘

┌─ CIRCUIT BREAKER ───────────────────────────────────────────────────────────┐
│ │
│ const paymentBreaker = new CircuitBreaker( │
│ 5, // Fail after 5 consecutive failures │
│ 60000 // Reset after 60 seconds │
│ ); │
│ │
│ try { │
│ const result = await paymentBreaker.execute( │
│ () => processPayment(amount) │
│ ); │
│ } catch (error) { │
│ // Service unavailable, show "try again later" message │
│ } │
│ │
│ // Check status │
│ paymentBreaker.getState() // 'CLOSED' | 'OPEN' | 'HALF_OPEN' │
│ │
│ // Reset manually │
│ paymentBreaker.reset() │
│ │
└──────────────────────────────────────────────────────────────────────────────┘

┌─ ERROR BOUNDARY (App.tsx) ──────────────────────────────────────────────────┐
│ │
│ import { ErrorBoundary } from './components/ErrorBoundary'; │
│ │
│ export const App = () => ( │
│ <ErrorBoundary │
│ onError={(error, info) => { │
│ console.error('Error caught:', error); │
│ }} │
│ > │
│ <YourAppContent /> │
│ </ErrorBoundary> │
│ ); │
│ │
└──────────────────────────────────────────────────────────────────────────────┘

┌─ ERROR CODES (Common) ──────────────────────────────────────────────────────┐
│ │
│ Validation: │
│ • ErrorCode.VALIDATION_ERROR (400) - Form validation failed │
│ • ErrorCode.MISSING_REQUIRED_FIELD (400) - Required field missing │
│ • ErrorCode.INVALID_INPUT (422) - Invalid data format │
│ │
│ Authentication: │
│ • ErrorCode.UNAUTHORIZED (401) - Not logged in │
│ • ErrorCode.SESSION_EXPIRED (401) - Session invalid │
│ • ErrorCode.INVALID_CREDENTIALS (401) - Wrong password │
│ │
│ Authorization: │
│ • ErrorCode.FORBIDDEN (403) - Insufficient permissions │
│ │
│ Resources: │
│ • ErrorCode.RESOURCE_NOT_FOUND (404) - Not found │
│ • ErrorCode.DUPLICATE_RESOURCE (409) - Already exists │
│ • ErrorCode.INSUFFICIENT_INVENTORY (409) - Out of stock │
│ │
│ Business Logic: │
│ • ErrorCode.PRICE_MISMATCH (409) - Price changed │
│ • ErrorCode.PAYMENT_FAILED (402) - Payment declined │
│ • ErrorCode.SHIPPING_UNAVAILABLE (400) - Can't ship │
│ │
│ Network: │
│ • ErrorCode.NETWORK_ERROR (0) - Connection failed │
│ • ErrorCode.TIMEOUT_ERROR (408) - Request timeout │
│ • ErrorCode.SERVICE_UNAVAILABLE (503) - Server down │
│ │
│ Server: │
│ • ErrorCode.INTERNAL_SERVER_ERROR (500) - Server error │
│ • ErrorCode.DATABASE_ERROR (500) - Database issue │
│ │
└──────────────────────────────────────────────────────────────────────────────┘

┌─ SEVERITY LEVELS ───────────────────────────────────────────────────────────┐
│ │
│ LOW: Minor issues, notification only │
│ Example: Invalid email format │
│ │
│ MEDIUM: Normal errors, retry recommended │
│ Example: Network timeout, temporary service unavailable │
│ │
│ HIGH: Critical errors, immediate action needed │
│ Example: Payment failed, permission denied │
│ │
│ CRITICAL: System-level failure, application may be down │
│ Example: Database unavailable, service down │
│ │
└──────────────────────────────────────────────────────────────────────────────┘

┌─ RETRY DEFAULTS ────────────────────────────────────────────────────────────┐
│ │
│ Max Attempts: 3 │
│ Initial Delay: 1000 ms │
│ Max Delay: 30000 ms │
│ Backoff Multiplier: 2 (exponential) │
│ │
│ So retry attempts happen at: 1s, 2s, 4s, 8s, 16s, 30s, 30s... │
│ (each wait is ~2x previous, plus jitter, capped at 30s) │
│ │
└──────────────────────────────────────────────────────────────────────────────┘

┌─ DEBUGGING ─────────────────────────────────────────────────────────────────┐
│ │
│ // In browser console: │
│ │
│ // View all errors │
│ errorLogger.getErrorLogs() │
│ │
│ // View table format │
│ console.table(errorLogger.getErrorLogs()) │
│ │
│ // View critical errors only │
│ errorLogger.getErrorsBySeverity('CRITICAL') │
│ │
│ // View network errors only │
│ errorLogger.getErrorsByCode('NETWORK_ERROR') │
│ │
│ // Export all logs │
│ copy(errorLogger.exportLogs()) │
│ │
│ // Clear all logs │
│ errorLogger.clearLogs() │
│ │
└──────────────────────────────────────────────────────────────────────────────┘

┌─ BEST PRACTICES ────────────────────────────────────────────────────────────┐
│ │
│ ✓ Use user-friendly messages │
│ "Please check your email" → Good │
│ "email validation regex failed" → Bad │
│ │
│ ✓ Include context when logging │
│ errorLogger.logError(error, { userId, endpoint, method }) │
│ │
│ ✓ Use appropriate severity levels │
│ Form validation → LOW │
│ Payment failure → HIGH │
│ Service down → CRITICAL │
│ │
│ ✓ Mark errors as retryable when appropriate │
│ Network errors → retryable: true │
│ Validation errors → retryable: false │
│ │
│ ✓ Catch errors near where they occur │
│ Don't let errors bubble up uncaught │
│ │
│ ✓ Use ErrorBoundary for component trees │
│ Wrap major sections at route level │
│ │
│ ✓ Test error scenarios │
│ Network failures, validation, timeouts, etc. │
│ │
└──────────────────────────────────────────────────────────────────────────────┘

┌─ DOCUMENTATION FILES ───────────────────────────────────────────────────────┐
│ │
│ ERROR_HANDLING_GUIDE.md ← Start here for setup │
│ ERROR_HANDLING_REFERENCE.md ← Architecture and patterns │
│ INTEGRATION_CHECKLIST.md ← Step-by-step integration │
│ DELIVERY_SUMMARY.md ← What was delivered │
│ This file (QUICK_REFERENCE) ← What you're reading now │
│ │
└──────────────────────────────────────────────────────────────────────────────┘

╔════════════════════════════════════════════════════════════════════════════╗
║ SAVE THIS FOR QUICK REFERENCE! ║
╚════════════════════════════════════════════════════════════════════════════╝

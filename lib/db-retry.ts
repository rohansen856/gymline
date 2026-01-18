// Database retry utility with exponential backoff
export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 2, // Will retry 2 more times (3 total attempts)
  initialDelay: 500, // Start with 500ms delay
  maxDelay: 5000, // Max 5 seconds delay
  backoffMultiplier: 2, // Double the delay each retry
};

export class RetryableError extends Error {
  constructor(
    message: string,
    public readonly attempts: number,
    public readonly lastError: Error
  ) {
    super(message);
    this.name = 'RetryableError';
  }
}

/**
 * Executes a database operation with retry logic
 * @param operation The async operation to retry
 * @param options Retry configuration options
 * @returns The result of the operation
 * @throws RetryableError if all retries fail
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | null = null;
  let delay = opts.initialDelay;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Check if it's a network/connection error that we should retry
      const shouldRetry = isRetriableError(error);
      
      if (!shouldRetry || attempt === opts.maxRetries) {
        throw new RetryableError(
          `Operation failed after ${attempt + 1} attempts`,
          attempt + 1,
          lastError
        );
      }

      // Log retry attempt
      console.warn(
        `Database operation failed (attempt ${attempt + 1}/${opts.maxRetries + 1}). Retrying in ${delay}ms...`,
        error
      );

      // Wait before retrying
      await sleep(delay);

      // Increase delay for next attempt (exponential backoff)
      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelay);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw new RetryableError(
    'Operation failed after all retries',
    opts.maxRetries + 1,
    lastError!
  );
}

/**
 * Determines if an error is retriable
 */
function isRetriableError(error: any): boolean {
  if (!error) return false;

  const errorMessage = error.message?.toLowerCase() || '';
  const errorCode = error.code?.toLowerCase() || '';

  // Network errors
  const networkErrors = [
    'enotfound',
    'econnrefused',
    'econnreset',
    'etimedout',
    'fetch failed',
    'network request failed',
    'error connecting to database',
  ];

  // Check error code
  if (networkErrors.some((e) => errorCode.includes(e))) {
    return true;
  }

  // Check error message
  if (networkErrors.some((e) => errorMessage.includes(e))) {
    return true;
  }

  // Check for NeonDbError with connection issues
  if (error.name === 'NeonDbError' || errorMessage.includes('neondb')) {
    return true;
  }

  // Check source error
  if (error.sourceError) {
    return isRetriableError(error.sourceError);
  }

  // Check cause
  if (error.cause) {
    return isRetriableError(error.cause);
  }

  return false;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wrapper for database query execution with retry logic
 * Use this in your API routes
 */
export async function executeWithRetry<T>(
  queryFn: () => Promise<T>,
  context?: string
): Promise<T> {
  try {
    return await withRetry(queryFn);
  } catch (error) {
    if (error instanceof RetryableError) {
      console.error(
        `${context ? context + ': ' : ''}All retry attempts failed`,
        error.lastError
      );
      throw error.lastError;
    }
    throw error;
  }
}

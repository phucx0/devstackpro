export function handleError(err: unknown, context?: string) {
  const isDev = process.env.NODE_ENV === "development";

  // 1. lấy message mặc định 
  let message = "Something went wrong. Please try again.";

  if (err instanceof Error) {
    message = err.message;
  }

  // 2. DEV: log full system error
  if (isDev) {
    console.error(`[${context ?? "Error"}]`, err);
  }

  // 3. PROD: chỉ log hệ thống, không leak user
  else {
    // send to monitoring service
    // Sentry.captureException(err);
  }

  // 4. trả message cho UI (safe)
  return message;
}
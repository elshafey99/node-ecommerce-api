import { env } from '../config/env.js';

// Express treats a middleware as an error handler only when it has 4 parameters.
// Closest Laravel equivalent: app/Exceptions/Handler.php.
// The `_next` argument is unused on purpose — dropping it would make this a
// normal middleware and Express would never call it for errors.
export function errorHandler(err, _req, res, _next) {
  // express.json() reports malformed JSON as a SyntaxError with status 400.
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ success: false, message: 'Invalid JSON body' });
    return;
  }

  const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const isServerError = statusCode >= 500;
  const message =
    isServerError && env.nodeEnv === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  const body = { success: false, message };

  // Stack traces help locally. Don't ship them.
  if (isServerError && env.nodeEnv !== 'production' && err.stack) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
}

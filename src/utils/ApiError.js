// Throw this from a controller to choose the HTTP status.
// Laravel equivalent: abort(404, 'Product not found').
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

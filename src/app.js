import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Relative ESM imports include the `.js` extension. PHP autoloads by
// namespace; Node resolves the file path you write.

// This file builds the app and exports it. It does not call listen().
// src/server.js is the process entry. Splitting them lets Phase 7 tests
// import `app` and hit routes with Supertest without opening a real port
// (Laravel boots this part for you inside the HTTP kernel).

const app = express();

// Security headers. A small slice of what Laravel's middleware stack sets up.
app.use(helmet());

// Like HandleCors / config/cors.php. Wide open for local learning.
app.use(cors());

// Access log while developing. `php artisan serve` does not do this by default.
// Registered before the body parser: a bad JSON body calls next(err) and skips
// any middleware that comes after it, so the log would miss that request.
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Parses a JSON body onto req.body. Like reading $request->json().
app.use(express.json());

app.use(apiRoutes);

// Order matters. 404 after routes, error handler last.
app.use(notFound);
app.use(errorHandler);

export default app;

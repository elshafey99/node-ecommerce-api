// Load env before the app module so dotenv has already filled process.env.
// Laravel loads .env before service providers boot; here we own that order.
import { env } from './config/env.js';
import app from './app.js';

// app.js configures Express. This file is the only place that binds a port,
// the way `php artisan serve` / public/index.php is the entry and the rest of
// the framework is importable. Phase 7 (Supertest) will import app.js and
// never start this listener, so tests don't fight over a port.

const server = app.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port} (${env.nodeEnv})`);
});

export default server;

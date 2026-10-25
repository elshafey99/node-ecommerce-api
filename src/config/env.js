import dotenv from 'dotenv';

// Laravel loads .env before the app boots. Node does not, so we do it here.
// Other files should import `env` instead of reading process.env themselves.
dotenv.config();

function readPort(value, fallback) {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return fallback;
  }
  return port;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: readPort(process.env.PORT, 3000),
  // Empty until Phase 4. Prisma will read DATABASE_URL from the environment.
  databaseUrl: process.env.DATABASE_URL || '',
};

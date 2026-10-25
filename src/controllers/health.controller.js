// Liveness probe. Not wrapped in the { success, data } envelope on purpose:
// load balancers expect a tiny, stable body.
export function health(_req, res) {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}

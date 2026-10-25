/**
 * A server with node:http only. Express is a router and middleware layer
 * on top of this API.
 *
 * Run:
 *   node learning/03-raw-http-server.js
 *
 * Then, in another terminal:
 *   curl -i http://localhost:3001/
 *   curl -i http://localhost:3001/missing
 *
 * Stop it with Ctrl+C.
 *
 * Laravel never asks you to open a socket yourself. Node's standard library does.
 */

import http from 'node:http';

const port = 3001;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    const body = JSON.stringify({ message: 'Hello from node:http' });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(body);
    return;
  }

  const body = JSON.stringify({ message: 'Not found' });
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(body);
});

server.listen(port, () => {
  console.log(`raw server listening on http://localhost:${port}`);
});

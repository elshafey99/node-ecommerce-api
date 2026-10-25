/**
 * Event loop order: process.nextTick, Promise, setTimeout, setImmediate.
 *
 * Run:
 *   node learning/01-event-loop.js
 *
 * PHP handles one request, then the worker is free. Node keeps a single
 * thread and a loop that drains queues. Microtasks (nextTick, Promises) run
 * before the loop moves to the next phase.
 *
 * setTimeout vs setImmediate from the top level is NOT stable: either timer
 * phase or check phase may run first. Inside an I/O callback, setImmediate
 * (check phase) always runs before the next setTimeout (timers phase).
 */

import fs from 'node:fs';

console.log('sync: start');

setTimeout(() => console.log('top-level setTimeout (timers phase)'), 0);
setImmediate(() => console.log('top-level setImmediate (check phase)'));

Promise.resolve().then(() => console.log('promise (microtask, after nextTick)'));
process.nextTick(() => console.log('nextTick (microtask, before Promises)'));

console.log('sync: end');

fs.readFile(new URL('./01-event-loop.js', import.meta.url), (err) => {
  if (err) {
    throw err;
  }

  console.log('--- inside I/O; the next four lines stay in this order ---');

  setTimeout(() => console.log('io setTimeout'), 0);
  setImmediate(() => console.log('io setImmediate'));
  Promise.resolve().then(() => console.log('io promise'));
  process.nextTick(() => console.log('io nextTick'));
});

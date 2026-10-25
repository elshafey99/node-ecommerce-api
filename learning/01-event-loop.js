/**
 * Event loop: sync code, Promises, process.nextTick, setTimeout, setImmediate.
 *
 * Run:
 *   node learning/01-event-loop.js
 *
 * PHP runs a request and returns the worker. Node keeps one thread and drains
 * queues: the current stack, then microtasks, then loop phases
 * (timers → poll/I/O → check).
 *
 * This file is ESM. Node evaluates an ESM entry file inside the microtask
 * queue, so a Promise queued at the top runs before process.nextTick. The
 * same two calls in a CommonJS file run nextTick first (see the Node docs for
 * process.nextTick). Inside the I/O callback below, nextTick is first either
 * way — that callback is a later turn of the loop.
 *
 * setTimeout(0) vs setImmediate at the top level can swap. Inside an I/O
 * callback, setImmediate (check) always runs before the next setTimeout (timers).
 */

import fs from 'node:fs';

console.log('1 sync start');

setTimeout(() => {
  console.log('4 top-level setTimeout (timers — may print before or after setImmediate)');
}, 0);
setImmediate(() => {
  console.log('4 top-level setImmediate (check — may print before or after setTimeout)');
});

Promise.resolve().then(() => {
  console.log('2 top-level promise (before nextTick: this file is ESM)');
});
process.nextTick(() => {
  console.log('3 top-level nextTick (after that promise, still before timers)');
});

console.log('1 sync end');

fs.readFile(new URL('./01-event-loop.js', import.meta.url), (err) => {
  if (err) {
    throw err;
  }

  console.log('--- I/O callback: the next four lines stay in this order ---');

  setTimeout(() => console.log('8 io setTimeout'), 0);
  setImmediate(() => console.log('7 io setImmediate'));
  Promise.resolve().then(() => console.log('6 io promise'));
  process.nextTick(() => console.log('5 io nextTick'));
});

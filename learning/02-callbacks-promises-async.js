/**
 * The same file read, three ways: callback, Promise, async/await.
 *
 * Run:
 *   node learning/02-callbacks-promises-async.js
 *
 * Node's original APIs took a callback: (err, result) => {}. Promises came
 * later, and async/await is syntax on top of Promises. fs/promises is the
 * promisified fs module. PHP's file_get_contents blocks the worker; await
 * pauses this function only, and the process can still do other work.
 */

import fs from 'node:fs';
import * as fsp from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';

const file = path.join(tmpdir(), 'ecommerce-phase1-note.txt');
const contents = 'hello from the learning script\n';

// Wrap a callback API by hand. This is what util.promisify does for you.
function writeFileCallback(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, 'utf8', (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

console.log('1) callback wrapped in new Promise');
await writeFileCallback(file, contents);

console.log('2) util.promisify turns fs.readFile into a function that returns a Promise');
const readFilePromisified = promisify(fs.readFile);
const viaPromisify = await readFilePromisified(file, 'utf8');
console.log('   read:', JSON.stringify(viaPromisify));

console.log('3) fs/promises — Node already shipped the promisified functions');
const viaFsPromises = await fsp.readFile(file, 'utf8');
console.log('   read:', JSON.stringify(viaFsPromises));

console.log('4) async/await — looks sequential, still a Promise underneath');
async function readNote() {
  return fsp.readFile(file, 'utf8');
}
const viaAsync = await readNote();
console.log('   read:', JSON.stringify(viaAsync));

await fsp.rm(file);
console.log('5) removed', file);

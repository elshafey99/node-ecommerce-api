/**
 * ESM (ECMAScript modules): import / export.
 *
 * Run:
 *   node learning/04-esm.js
 *
 * package.json has "type": "module", so every .js file in this repo is ESM.
 * Compare with learning/04-commonjs.cjs, which opts back into require().
 * PHP has one module system (namespaces + Composer). Node has two, because
 * CommonJS shipped first and browsers standardized import/export later.
 *
 * ESM has no __filename or __dirname. Build them from import.meta.url.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('This file is ESM');
console.log('import.meta.url =', import.meta.url);
console.log('__filename      =', __filename);
console.log('__dirname       =', __dirname);

/**
 * CommonJS: require / module.exports.
 *
 * Run:
 *   node learning/04-commonjs.cjs
 *
 * The .cjs extension forces CommonJS even though package.json says
 * "type": "module". You get require, module.exports, __filename, and __dirname.
 * New code in this repo uses ESM (learning/04-esm.js). Older npm packages
 * still use require(), and Node can load both in one project.
 */

const path = require('node:path');

function greet(name) {
  return `Hello, ${name}`;
}

module.exports = { greet };

console.log('This file is CommonJS');
console.log('module.exports.greet ->', module.exports.greet('learner'));
console.log('__filename =', __filename);
console.log('__dirname  =', __dirname);
console.log('basename   =', path.basename(__filename));

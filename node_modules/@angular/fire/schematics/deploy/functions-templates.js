"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultFunction = exports.defaultPackage = void 0;
const DEFAULT_NODE_VERSION = 10;
const DEFAULT_FUNCTION_NAME = 'ssr';
const DEFAULT_FUNCTION_REGION = 'us-central1';
const DEFAULT_RUNTIME_OPTIONS = {
    timeoutSeconds: 60,
    memory: '1GB'
};
const defaultPackage = (dependencies, devDependencies, options) => `{
  "name": "functions",
  "description": "Angular Universal Application",
  "scripts": {
    "lint": "",
    "serve": "firebase serve --only functions",
    "shell": "firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "${options.functionsNodeVersion || DEFAULT_NODE_VERSION}"
  },
  "dependencies": ${JSON.stringify(dependencies, null, 4)},
  "devDependencies": ${JSON.stringify(devDependencies, null, 4)},
  "private": true
}
`;
exports.defaultPackage = defaultPackage;
const defaultFunction = (path, options) => `const functions = require('firebase-functions');

// Increase readability in Cloud Logging
require("firebase-functions/lib/logger/compat");

const expressApp = require('./${path}/main').app();

exports.${DEFAULT_FUNCTION_NAME} = functions
  .region('${DEFAULT_FUNCTION_REGION}')
  .runWith(${JSON.stringify(options.functionsRuntimeOptions || DEFAULT_RUNTIME_OPTIONS)})
  .https
  .onRequest(expressApp);
`;
exports.defaultFunction = defaultFunction;

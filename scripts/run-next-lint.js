#!/usr/bin/env node
'use strict';

const path = require('node:path');
const { spawn } = require('node:child_process');

const vendorDir = path.join(__dirname, '..', 'vendor');
const delimiter = path.delimiter;
const existingNodePath = process.env.NODE_PATH ? process.env.NODE_PATH.split(delimiter) : [];

const nextEnv = {
  ...process.env,
  NODE_PATH: [vendorDir, ...existingNodePath.filter(Boolean)].join(delimiter),
};

const nextCli = require.resolve('next/dist/bin/next');

const child = spawn(process.execPath, [nextCli, 'lint'], {
  stdio: 'inherit',
  env: nextEnv,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 1);
  }
});

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const babelConfigPath = path.join(__dirname, 'babel.config.cjs');
const babelConfigBackupPath = path.join(__dirname, 'babel.config.cjs.bak');
const babelrcPath = path.join(__dirname, '.babelrc.cjs');
const babelrcBackupPath = path.join(__dirname, '.babelrc.cjs.bak');

// Command is the first argument
const command = process.argv[2];

if (command === 'prepare-dev') {
  // For development/build, we want to hide all babel config files
  if (fs.existsSync(babelConfigPath)) {
    console.log('Moving babel.config.cjs to babel.config.cjs.bak for Next.js development');
    fs.renameSync(babelConfigPath, babelConfigBackupPath);
  }
  
  if (fs.existsSync(babelrcPath)) {
    console.log('Moving .babelrc.cjs to .babelrc.cjs.bak for Next.js development');
    fs.renameSync(babelrcPath, babelrcBackupPath);
  }
} else if (command === 'prepare-test') {
  // For tests, we want to restore babel config files
  if (fs.existsSync(babelConfigBackupPath)) {
    console.log('Restoring babel.config.cjs from backup for tests');
    fs.renameSync(babelConfigBackupPath, babelConfigPath);
  }
  
  if (fs.existsSync(babelrcBackupPath)) {
    console.log('Restoring .babelrc.cjs from backup for tests');
    fs.renameSync(babelrcBackupPath, babelrcPath);
  }
} else if (command === 'cleanup') {
  // Cleanup: restore babel config files if they were backed up
  if (fs.existsSync(babelConfigBackupPath)) {
    console.log('Restoring babel.config.cjs from backup during cleanup');
    fs.renameSync(babelConfigBackupPath, babelConfigPath);
  }
  
  if (fs.existsSync(babelrcBackupPath)) {
    console.log('Restoring .babelrc.cjs from backup during cleanup');
    fs.renameSync(babelrcBackupPath, babelrcPath);
  }
} else {
  console.error('Unknown command. Use "prepare-dev", "prepare-test", or "cleanup"');
  process.exit(1);
} 
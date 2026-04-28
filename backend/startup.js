#!/usr/bin/env node

// Force-restart wrapper for Azure App Service
// This ensures a fresh Node process on every deployment

console.log('=====================================================');
console.log('🔄 Starting fresh CampusX backend process...');
console.log('🕐 Startup time:', new Date().toISOString());
console.log('=====================================================\n');

// Clear require cache to force fresh module loading
Object.keys(require.cache).forEach(key => {
  delete require.cache[key];
});

// Start the server
require('./server.js');

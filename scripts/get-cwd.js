#!/usr/bin/env node

/**
 * Cross-platform utility to get current working directory
 * This script outputs the absolute path of the current working directory, works on both Windows and Mac/Linux
 * Usage: node scripts/get-cwd.js
 */

// Output the current working directory
console.log(process.cwd());

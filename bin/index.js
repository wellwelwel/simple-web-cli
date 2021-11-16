#! /usr/bin/env node
const { execSync } = require('child_process');

execSync('npm link');
require('../.web/tasks/start');
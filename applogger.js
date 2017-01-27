'use strict';

const log4js = require('log4js');
const path = require('path');

const config = require('./config/');

log4js.configure(path.join(__dirname, './log4js.conf.json'), {
  cwd: path.join(config.SERVER_ROOT, 'logs')
});

const logger = log4js.getLogger();

module.exports = logger;

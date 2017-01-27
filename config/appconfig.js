const path = require('path');
const extend = require('util')._extend;

function loadEnvVariables() {
  const fs = require('fs');
  const envFile = path.join(__dirname, 'ENV.json');

  let env = {};

  // Read env.json file, if it exists, export the configs & settings from that to the process env variables

  if (fs.existsSync(envFile)) {
    env = fs.readFileSync(envFile, 'utf-8');
    env = JSON.parse(env);
    Object.keys(env).forEach(key => process.env[key] = env[key]);
  }
}

loadEnvVariables();

//  Load environment specific config settings
const development = require('./env/DEV');
const production = require('./env/PROD');

const defaults = {
  SERVER_ROOT: path.resolve(__dirname, '../'),
  NODE_ENV: process.env.NODE_ENV
};

const appConfig = {
  development: extend(development, defaults),
  production: extend(production, defaults)
};

process.stdout.write('\nOxygen configuring for environment: ' + process.env.NODE_ENV);
process.stdout.write('\nconfig settings: ' + JSON.stringify(appConfig[(process.env
  .NODE_ENV || 'development')]), null, '\t');

module.exports = appConfig[(process.env.NODE_ENV || 'development')];

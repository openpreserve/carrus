/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import path from 'path';
import fs from 'fs';
import util from 'util';
import osLocale from 'os-locale';

const reader = util.promisify(fs.readFile);
const isExists = util.promisify(fs.exists);
const writer = util.promisify(fs.writeFile);

async function getOsLang() {
  const data = await osLocale();
  return data.split('-')[0];
}

const initialConfig = {
  language: 'en',
};

export async function setConfig(isDevelopment) {
  let configDir = path.join(__dirname, '..', 'config');

  if (isDevelopment) {
    configDir = path.join(__dirname, '..', '..', 'config');
  }

  try {
    // check if we already have created config file
    // in this case only provide settings from config.js
    if (await isExists(path.join(configDir, 'config.json'))) {
      let configuration = await reader(path.join(configDir, 'config.json'), 'utf8');
      configuration = JSON.parse(configuration);
      if (configuration.language === 'default') {
        configuration.language = await getOsLang();
        configuration.isDevelopment = isDevelopment;
      }
      return configuration;
    }

    // try to extract system language and set it up as default one
    initialConfig.language = await getOsLang();
    initialConfig.isDevelopment = isDevelopment;
    return initialConfig;
  } catch (err) {
    // in case of some errors we default configuration
    initialConfig.isDevelopment = isDevelopment;
    return initialConfig;
  }
}

export async function updateConfig(isDevelopment, outFolder) {
  let configDir = path.join(__dirname, '..', 'config');

  if (isDevelopment) {
    configDir = path.join(__dirname, '..', '..', 'config');
  }

  try {
    let config = await reader(path.join(configDir, 'config.json'), 'utf8');
    config = JSON.parse(config);
    if (config.outFolder === outFolder) {
      return;
    }
    config.outFolder = outFolder;
    await writer(path.join(configDir, 'config.json'), JSON.stringify(config));
  } catch (error) {
    console.log(error);
  }
}

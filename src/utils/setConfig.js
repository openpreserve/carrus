/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import path from 'path';
import fs from 'fs';
import os from 'os';
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
  language: 'default',
};

export async function setConfig(isDevelopment) {
  const tempDir = path.join(path.join(os.tmpdir(), 'jhove2020'));
  const configDir = path.join(path.join(os.tmpdir(), 'jhove2020', 'config'));

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
    try {
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
        fs.mkdirSync(configDir);
      }
    } catch (err) {
      console.error(err);
    }
    // try to extract system language and set it up as default one
    initialConfig.language = await getOsLang();
    writer(path.join(configDir, 'config.json'), JSON.stringify(initialConfig));
    initialConfig.isDevelopment = isDevelopment;
    return initialConfig;
  } catch (err) {
    // in case of some errors we default configuration
    initialConfig.isDevelopment = isDevelopment;
    return initialConfig;
  }
}

export async function updateConfig(outFolder) {
  const configDir = path.join(path.join(os.tmpdir(), 'jhove2020', 'config'));

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

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

export default async function setConfig(isDevelopment) {
  let configDir = path.join(__dirname, '..');

  if (isDevelopment) {
    configDir = path.join(__dirname, '..', 'config');
  }

  try {
    // check if we already have created config file
    // in this case only provide settings from config.js
    if (await isExists(path.join(configDir, 'config.json'))) {
      const configuration = await reader(path.join(configDir, 'config.json'), 'utf8');
      return JSON.parse(configuration);
    }

    // try to extract system language and set it up as default one
    initialConfig.language = await getOsLang();
    await writer(path.join(configDir, 'config.json'), JSON.stringify(initialConfig));
    return initialConfig;
  } catch (err) {
    // in case of some errors we default configuration
    return initialConfig;
  }
}

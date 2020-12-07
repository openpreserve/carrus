/* eslint-disable no-else-return */
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import osLocale from 'os-locale';

export default async function setConfig(isDevelopment) {
  let configDir = path.join(__dirname, '..');

  if (isDevelopment) {
    configDir = path.join(__dirname, '..', 'config');
  }

  const initialConfig = {
    language: 'en',
  };

  async function getOsLang() {
    const data = await osLocale();
    return data.split('-')[0];
  }

  const reader = util.promisify(fs.readFile);
  const isExists = util.promisify(fs.exists);
  const writer = util.promisify(fs.writeFile);

  try {
    if (await isExists(path.join(configDir, 'config.json'))) {
      const fileContent = await reader(path.join(configDir, 'config.json'), 'utf8');
      return JSON.parse(fileContent);
    } else {
      initialConfig.language = await getOsLang();
      await writer(path.join(configDir, 'config.json'), JSON.stringify(initialConfig));
      return initialConfig;
    }
  } catch (err) {
    return initialConfig;
  }
}

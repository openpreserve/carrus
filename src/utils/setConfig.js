/* eslint-disable no-else-return */
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import osLocale from 'os-locale';

const configDir = path.join(__dirname, '..', 'config');

export default async function setConfig() {
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
      writer(
        path.join(configDir, 'config.json'),
        JSON.stringify(initialConfig),
        (err) => {
          if (err) {
            throw new Error(err);
          }
        },
      );
      return initialConfig;
    }
  } catch (err) {
    return initialConfig;
  }
}

/* eslint-disable no-else-return */
import * as path from 'path';
import * as fs from 'fs';
import osLocale from 'os-locale';

export default async function setConfig(configDir) {
  const initialConfig = {
    language: 'en',
  };

  async function getOsLang() {
    const data = await osLocale();
    return data.split('-')[0];
  }

  try {
    if (fs.existsSync(path.join(configDir, 'config.json'))) {
      // file exists, read file
      const fileContent = fs.readFileSync(path.join(configDir, 'config.json'), 'utf8');
      return JSON.parse(fileContent);
    } else {
      // file does not exist, create default config
      initialConfig.language = await getOsLang();
      await fs.writeFile(
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

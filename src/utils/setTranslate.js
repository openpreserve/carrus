import path from 'path';
import util from 'util';
import fs from 'fs';
import translations from '../i18next/translations';

const reader = util.promisify(fs.readFile);
const isExists = util.promisify(fs.exists);
const writer = util.promisify(fs.writeFile);

export default async function setTranslate(isDevelopment) {
  if (isDevelopment) {
    return translations;
  }
  const configDir = path.join(__dirname, '..');

  try {
    // check if we already have created translations file
    // in this case only provide translations from translations.json
    if (await isExists(path.join(configDir, 'translations.json'))) {
      const translationsMap = await reader(path.join(configDir, 'translations.json'), 'utf8');
      return JSON.parse(translationsMap);
    }

    // in case when there is no translations file yet, we add it to sources for possibility of custom editing
    await writer(path.join(configDir, 'translations.json'), JSON.stringify(translations));
    // and return our translations template/map
    return translations;
  } catch (err) {
    return translations;
  }
}

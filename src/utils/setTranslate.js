import path from 'path';
import util from 'util';
import fs from 'fs';

const reader = util.promisify(fs.readFile);
const isExists = util.promisify(fs.exists);

export default async function setTranslate(isDevelopment) {
  let configDir = path.join(__dirname, '..', 'translations');
  if (isDevelopment) {
    configDir = path.join(__dirname, '..', '..', 'translations');
  }

  try {
    // check if we already have created translations file
    // in this case only provide translations from translations.json
    if (await isExists(path.join(configDir, 'translations.json'))) {
      const translationsMap = await reader(path.join(configDir, 'translations.json'), 'utf8');
      return JSON.parse(translationsMap);
    }

    // in case when there is no translations file yet, we add it to sources for possibility of custom editing
    // and return our translations template/map
    return '';
  } catch (err) {
    throw new Error(err);
  }
}

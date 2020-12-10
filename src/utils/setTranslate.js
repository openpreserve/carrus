/* eslint-disable quote-props */
/* eslint-disable quotes */
import path from "path";
import util from "util";
import fs from "fs";
import resources from '../i18next/translates';
/* import i18n from '../i18next/i18next';
import { initReactI18next } from 'react-i18next'; */

export default async function setTranslate() {
  /* i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources,
      lng: 'en',
      keySeparator: false, // we do not use keys in form messages.welcome

      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    }); */
  const configDir = path.join(__dirname, '..');
  const reader = util.promisify(fs.readFile);
  const isExists = util.promisify(fs.exists);
  const writer = util.promisify(fs.writeFile);
  try {
    if (await isExists(path.join(configDir, 'resources.json'))) {
      const fileContent = await reader(path.join(configDir, 'resources.json'), 'utf8');
      console.log(JSON.parse(fileContent));
    } else {
      await writer(path.join(configDir, 'resources.json'), JSON.stringify(resources));
    }
  } catch (err) {
    return null;
  }
  return null;
}

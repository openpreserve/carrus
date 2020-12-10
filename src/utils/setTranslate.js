/* eslint-disable quote-props */
/* eslint-disable quotes */
/* eslint-disable no-else-return */
import path from "path";
import util from "util";
import fs from "fs";
import resources from '../i18next/translates';

export default async function setTranslate(isDevelopment) {
  if (isDevelopment) {
    return resources;
  }
  const configDir = path.join(__dirname, '..');
  const reader = util.promisify(fs.readFile);
  const isExists = util.promisify(fs.exists);
  const writer = util.promisify(fs.writeFile);
  try {
    if (await isExists(path.join(configDir, 'resources.json'))) {
      const fileContent = await reader(path.join(configDir, 'resources.json'), 'utf8');
      return JSON.parse(fileContent);
    } else {
      await writer(path.join(configDir, 'resources.json'), JSON.stringify(resources));
      return resources;
    }
  } catch (err) {
    return resources;
  }
}

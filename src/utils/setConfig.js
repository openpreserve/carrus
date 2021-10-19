import path from 'path';
import fs from 'fs';
import os from 'os';
import util from 'util';
import osLocale from 'os-locale';
import { APP_NAME, DEF_CONFIG } from './constants';

const reader = util.promisify(fs.readFile);
const isExists = util.promisify(fs.exists);
const writer = util.promisify(fs.writeFile);
const dirMaker = util.promisify(fs.mkdir);

async function getOsLang() {
  const data = await osLocale();
  return data.split('-')[0];
}

const initialConfig = {
  language: 'default',
};

export async function setConfig(isDevelopment, runJobFailed) {
  let configDir = path.join(__dirname, '..', 'config');
  if (isDevelopment) {
    configDir = path.join(__dirname, '..', '..', 'config');
  }
  const tempDir = path.join(path.join(os.homedir(), APP_NAME));
  const tempConfigDir = path.join(path.join(os.homedir(), APP_NAME, 'config'));
  let configuration = {};

  try {
    if (await isExists(path.join(configDir, 'config.json'))) {
      configuration = JSON.parse(await reader(path.join(configDir, 'config.json'), 'utf8'));
    } else {
      configuration = initialConfig;
    }
    if (await isExists(path.join(tempConfigDir, 'config.json'))) {
      let tempConf = {};
      try {
        tempConf = JSON.parse(await reader(path.join(tempConfigDir, 'config.json'), 'utf8'));
      } catch (error) {
        runJobFailed(`${error.message} ${path.join(tempConfigDir, 'config.json')}`);
      }
      configuration = {
        ...configuration,
        ...tempConf,
      };
    } else {
      try {
        if (!fs.existsSync(tempDir)) {
          configuration = {
            ...configuration,
            ...DEF_CONFIG,
          };
          dirMaker(tempDir).then(() => {
            dirMaker(tempConfigDir).then(async () => {
              await writer(path.join(tempConfigDir, 'config.json'), JSON.stringify(DEF_CONFIG));
            });
          });
        }
      } catch (err) {
        runJobFailed(err.message);
      }
    }
    if (configuration.language === 'default') {
      configuration.language = await getOsLang();
      configuration.isDevelopment = isDevelopment;
    }
    return configuration;
  } catch (error) {
    // in case of some errors we default configuration
    initialConfig.isDevelopment = isDevelopment;
    return initialConfig;
  }
}

export async function updateConfig(outFolder, runJobFailed) {
  const configDir = path.join(path.join(os.homedir(), APP_NAME, 'config'));
  if (await isExists(path.join(configDir, 'config.json'))) {
    try {
      let config = await reader(path.join(configDir, 'config.json'), 'utf8');
      config = JSON.parse(config);
      if (config.outFolder === outFolder) {
        return;
      }
      config.outFolder = outFolder;
      await writer(path.join(configDir, 'config.json'), JSON.stringify(config));
    } catch (error) {
      runJobFailed(error.message);
    }
  } else {
    try {
      await writer(path.join(configDir, 'config.json'), JSON.stringify({ outFolder }));
    } catch (error) {
      runJobFailed(error.message);
    }
  }
}

export async function updateDefaultValues(defaultValues, runJobFailed) {
  const configDir = path.join(path.join(os.homedir(), APP_NAME, 'config'));
  if (await isExists(path.join(configDir, 'config.json'))) {
    try {
      let config = await reader(path.join(configDir, 'config.json'), 'utf8');
      config = JSON.parse(config);
      config.defaultValues = defaultValues;
      await writer(path.join(configDir, 'config.json'), JSON.stringify(config));
    } catch (error) {
      runJobFailed(error.message);
    }
  } else {
    try {
      await writer(path.join(configDir, 'config.json'), JSON.stringify({ defaultValues }));
    } catch (error) {
      runJobFailed(error.message);
    }
  }
}

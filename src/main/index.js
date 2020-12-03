/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable comma-dangle */
/* eslint-disable prefer-destructuring */
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import osLocale from 'os-locale';
import { format as formatUrl } from 'url';
import { spawn } from 'child_process';

const isDevelopment = process.env.NODE_ENV !== 'production';

let mainWindow;
const configDir = 'src/config';
const initialConfig = {
  language: 'en',
};

async function setOsLang() {
  const data = await osLocale();
  initialConfig.language = data.split('-')[0];
}

async function createMainWindow() {
  const window = new BrowserWindow({
    minWidth: 1280,
    minHeight: 800,
    title: 'JHove 2020',
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  window._id = 'main';

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    );
  }

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  try {
    if (fs.existsSync(path.join(configDir, 'config.json'))) {
      // file exists, read file
      fs.readFile(
        path.join(configDir, 'config.json'),
        'utf-8',
        (err, data) => {
          if (err) {
            throw new Error(err);
          }
          window.webContents.on('did-finish-load', () => {
            window.webContents.send('language', (JSON.parse(data)).language);
          });
        }
      );
    } else {
      // file does not exist, create default config
      await setOsLang();
      window.webContents.on('did-finish-load', () => {
        window.webContents.send('language', initialConfig.language);
      });
      fs.writeFile(
        path.join(configDir, 'config.json'),
        JSON.stringify(initialConfig),
        (err) => {
          if (err) {
            throw new Error(err);
          }
        }
      );
    }
  } catch (err) {
    console.error(err);
  }

  /*  window.webContents.on('did-finish-load', () => {
    window.webContents.send('language', initialConfig.language);
  }); */

  return window;
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', () => {
  mainWindow = createMainWindow();
});

ipcMain.on('create_new_window', (event, arg) => {
  const reportDate = spawn('python', [
    './src/libs/script.py',
    arg.filePath,
    arg.outputFolder,
    arg.action.preservationActionName,
    arg.tool,
  ]);
  reportDate.stdout.on('data', data => {
    const win = new BrowserWindow({
      minWidth: 1037,
      minHeight: 700,
      title: 'JHove 2020',
      frame: false,
      titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: true,
      },
    });
    win._id = 'report';

    win.webContents.once('did-finish-load', () => {
      win.webContents.send('receiver', data.toString());
    });

    if (isDevelopment) {
      win.webContents.openDevTools();
    }

    if (isDevelopment) {
      win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/`);
    } else {
      win.loadURL(
        formatUrl({
          pathname: path.join(__dirname, 'index.html'),
          protocol: 'file',
          slashes: true,
        }),
      );
    }
  });
});

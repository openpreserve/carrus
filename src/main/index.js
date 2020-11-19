/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable comma-dangle */
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import { spawn } from 'child_process';

const isDevelopment = process.env.NODE_ENV !== 'production';

let mainWindow;

function createMainWindow() {
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
  // exec(`python ./src/libs/script.py ${arg}`, (stderr, stdin, stdout) => {
  //   console.log(stdout);
  // });
  const win = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    title: 'JHove 2020',
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win._id = 'report';

  const reportDate = spawn('python', ['./src/libs/script.py', arg]);
  reportDate.stdout.on('data', data => {
    win.webContents.once('did-finish-load', () => {
      win.webContents.send('receiver', data.toString());
    });
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

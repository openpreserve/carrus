/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable comma-dangle */
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';

const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow() {
  const window = new BrowserWindow({
    minWidth: 1280,
    minHeight: 800,
    title: 'JHove 2020',
    frame: false,
    titleBarStyle: 'hidden',
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

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});

ipcMain.on('create_new_window', (event, arg) => {
  console.log(arg);
  event.sender.send('receive_file_info', arg);
  const win = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    title: 'JHove 2020',
    frame: false,
    titleBarStyle: 'hidden',
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

  win._id = 'report';

  win.webContents.on('devtools-opened', () => {
    win.focus();
    setImmediate(() => {
      win.focus();
    });
  });
});

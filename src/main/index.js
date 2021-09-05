/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-sequences */
/* eslint-disable array-callback-return */
/* eslint-disable no-unsafe-finally */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-unused-expressions */
/* eslint-disable quotes */
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import fs, { readdirSync, lstatSync } from 'fs';
import os from 'os';
import mime from 'mime-types';
import { spawn } from 'child_process';
import FileType from 'file-type';
import { setConfig, updateConfig, updateDefaultValues } from '../utils/setConfig';
import setTranslate from '../utils/setTranslate';
import setPAR from '../utils/setPAR';
import { APP_NAME } from '../utils/constants';

require('events').EventEmitter.defaultMaxListeners = Infinity;

const request = require('request');

let files = [];
let reportText = 'd';
let dest = '';
let errorText = '';
const isDevelopment = process.env.NODE_ENV !== 'production';

let mainWindow;
let outputPath;

async function createMainWindow() {
  const factor = screen.getPrimaryDisplay().scaleFactor;
  let minWidth = 1080;
  let minHeight = 680;
  if (factor === 1) {
    minWidth = 1080;
    minHeight = 800;
  } else if (factor >= 1.25 && factor < 1.5) {
    minWidth = 865;
    minHeight = 700;
  } else if (factor >= 1.5) {
    minWidth = 740;
    minHeight = 650;
  }

  process.setMaxListeners(Infinity);

  const window = new BrowserWindow({
    minWidth,
    minHeight,
    title: APP_NAME,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      zoomFactor: 1.0 / factor,
    },
  });

  window._id = 'main';
  global.window = window;
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

  const translate = await setTranslate(isDevelopment);
  const config = await setConfig(isDevelopment, runJobFailed);
  const PAR = await setPAR(isDevelopment, runJobFailed);
  window.webContents.on('did-finish-load', () => {
    window.webContents.send('translate', translate);
    window.webContents.send('config', config);
    window.webContents.send('PAR', PAR);
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

// eslint-disable-next-line no-shadow
const download = (url, dest) => new Promise((resolve, reject) => {
  const downloadDir = path.join(path.join(os.tmpdir(), APP_NAME, 'downloads'));
  try {
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir);
    }
  } catch (err) {
    reject(err.message);
  }

  const file = fs.createWriteStream(dest);

  const sendReq = request.get(url);

  sendReq.on('response', response => {
    if (response.statusCode === 200) {
      sendReq.pipe(file);
    } else {
      file.close();
      fs.unlink(dest, () => {});
      reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
    }
  });

  sendReq.on('error', err => {
    file.close();
    fs.unlink(dest, () => {});
    reject(err.message);
  });

  file.on('finish', () => {
    resolve();
  });

  file.on('error', err => {
    file.close();
    console.log(err);

    if (err.code === 'EEXIST') {
      reject('File already exists');
    } else {
      fs.unlink(dest, () => {});
      reject(err.message);
    }
  });
});

ipcMain.on('check-mime-type', async (event, arg) => {
  const type = mime.lookup(arg);
  event.sender.send('receive-mime-type', type);
});

app.on('ready', () => {
  mainWindow = createMainWindow();
});

const runJobFailed = (error) => {
  const win = new BrowserWindow({
    minWidth: 1037,
    minHeight: 500,
    title: APP_NAME,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  win._id = 'jobFailed';

  win.webContents.once('did-finish-load', async () => {
    const translate = await setTranslate(isDevelopment);
    const config = await setConfig(isDevelopment);
    win.webContents.send('translate', translate);
    win.webContents.send('config', config);
    win.webContents.send('receive-err', { report: error });
  });

  if (isDevelopment) {
    win.webContents.openDevTools();
  }

  if (isDevelopment) {
    win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    win.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    );
  }
};

const getDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const mins = `${date.getMinutes()}`.padStart(2, '0');
  const sec = `${date.getSeconds()}`.padStart(2, '0');
  return `${year}${month}${day}${hours}${mins}${sec}`;
};

const runScript = (tool, filePath, optionArr, outFol, event, config) => {
  // eslint-disable-next-line no-shadow
  let reportText = '';
  let shieldedPath = filePath.split('');
  shieldedPath.unshift('"');
  shieldedPath.push('"');
  shieldedPath = shieldedPath.join('');
  let reportData = '';
  // eslint-disable-next-line no-shadow
  let errorText = '';
  dest = '';

  const configTool = Object.keys(config?.tools).find(e => e === tool.toolName);
  const OSconfigTool = configTool ? config.tools[configTool].find(e => e.OS === os.platform()) : null;
  if (!OSconfigTool) {
    event.sender.send('receive-load', false);
    runJobFailed(`There is no ${tool.toolName} tool in config`);
    return;
  }

  const scriptPath = isDevelopment
    ? path.join(__dirname, '..', '..', 'libs', OSconfigTool.scriptPath)
    : path.join(__dirname, '..', 'libs', OSconfigTool.scriptPath);

  const command = OSconfigTool.scriptType === 'shell' ? scriptPath : OSconfigTool.scriptType;

  const optionObj = {};

  if (OSconfigTool.workingDirectory) {
    optionObj.cwd = isDevelopment
      ? path.join(__dirname, '..', '..', 'libs', OSconfigTool.workingDirectory)
      : path.join(__dirname, '..', 'libs', OSconfigTool.workingDirectory);
  }

  reportData = spawn(command, [
    ...OSconfigTool.scriptArguments,
    ...optionArr,
    filePath,
  ], optionObj);

  reportData.stdout.on('data', (data) => {
    data ? reportText += data.toString() : null;
    dest = path.join(outFol, `${path.basename(filePath)}-${tool.id.name}_${getDateString()}.txt`);
  });
  reportData.stdout.on('end', () => {
    if (reportText) {
      const win = new BrowserWindow({
        minWidth: 1037,
        minHeight: 700,
        title: APP_NAME,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
          nodeIntegration: true,
          enableRemoteModule: true,
        },
      });
      win._id = 'report';

      win.webContents.once('did-finish-load', async () => {
        const translate = await setTranslate(isDevelopment);
        win.webContents.send('translate', translate);
        win.webContents.send('config', config);
        win.webContents.send('receiver', { report: reportText, path: dest });
        event.sender.send('receive-load', false);
      });

      if (isDevelopment) {
        win.webContents.openDevTools();
      }

      if (isDevelopment) {
        win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
      } else {
        win.loadURL(
          formatUrl({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file',
            slashes: true,
          }),
        );
      }
    }
    fs.writeFile(dest, reportText, error => {
      if (error) {
        event.sender.send('receive-load', false);
        error.message !== `ENOENT: no such file or directory, open ''`
          ? runJobFailed(error.message)
          : runJobFailed(errorText);
      }
    });
  });
  reportData.stderr.on('data', (data) => {
    console.error(data.toString());
    errorText += data.toString();
  });

  reportData.stderr.on('end', () => {
    event.sender.send('receive-load', false);
  });

  reportData.on('error', (err) => {
    errorText += err.toString();
  });

  outputPath = outFol;
};

async function runBatchScript(tool, filePath, optionArr, fileName, outFol, event, config, batchPath) {
  if (tool && optionArr) {
    dest = path.join(outFol, `${path.basename(batchPath)}-${tool.id.name}_${getDateString()}.txt`);
    console.log('running batch script');
    // eslint-disable-next-line no-unused-vars
    let shieldedPath = filePath.split('');
    shieldedPath.unshift('"');
    shieldedPath.push('"');
    shieldedPath = shieldedPath.join('');
    let reportData = '';

    const configTool = Object.keys(config?.tools).find(e => e === tool.id.name);
    const OSconfigTool = configTool ? config.tools[configTool].find(e => e.OS === os.platform()) : null;
    if (!OSconfigTool) {
      event.sender.send('receive-load', false);
      runJobFailed(`There is no ${tool.toolName} tool in config`);
      return;
    }

    const scriptPath = isDevelopment
      ? path.join(__dirname, '..', '..', 'libs', OSconfigTool.scriptPath)
      : path.join(__dirname, '..', 'libs', OSconfigTool.scriptPath);

    const command = OSconfigTool.scriptType === 'shell' ? scriptPath : OSconfigTool.scriptType;
    const optionObj = {};

    if (OSconfigTool.workingDirectory) {
      optionObj.cwd = isDevelopment
        ? path.join(__dirname, '..', '..', 'libs', OSconfigTool.workingDirectory)
        : path.join(__dirname, '..', 'libs', OSconfigTool.workingDirectory);
    }

    reportData = spawn(command, [
      ...OSconfigTool.scriptArguments,
      optionArr.value,
      filePath,
    ], optionObj);
    reportData.stdout.on('data', data => {
      data ? reportText += `${fileName} - ${data.toString()}` : null;
    });
    reportData.stderr.on('data', (data) => {
      console.error(data.toString());
      errorText += data.toString();
    });

    reportData.stderr.on('end', () => {
      event.sender.send('receive-load', false);
    });

    reportData.on('error', (err) => {
      errorText += err.toString();
    });
    reportData.stdout.on('end', () => { true; });
  } else {
    reportText += `${fileName} - Cannot be processed: No tool or action \n`;
  }
  return reportText;
}

function handleResultWindow(config, event) {
  if (reportText) {
    const win = new BrowserWindow({
      minWidth: 1037,
      minHeight: 700,
      title: APP_NAME,
      frame: false,
      titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });
    win._id = 'report';

    win.webContents.once('did-finish-load', async () => {
      const translate = await setTranslate(isDevelopment);
      win.webContents.send('translate', translate);
      win.webContents.send('config', config);
      win.webContents.send('receiver', { report: reportText, path: dest });
      event.sender.send('receive-load', false);
      fs.writeFile(dest, reportText, error => {
        if (error) {
          event.sender.send('receive-load', false);
          error.message !== 'ENOENT: no such file or directory, open \'\''
            ? runJobFailed(error.message)
            : runJobFailed(errorText);
        }
      });
    });

    if (isDevelopment) {
      win.webContents.openDevTools();
    }

    if (isDevelopment) {
      win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
    } else {
      win.loadURL(
        formatUrl({
          pathname: path.join(__dirname, 'index.html'),
          protocol: 'file',
          slashes: true,
        }),
      );
    }
  }
}

function handleDefaultValues(arg, file) {
  const { actionType, fileFormats } = arg;
  const { defaultValues } = arg.config;
  if (defaultValues) {
    let AcceptedType = fileFormats.map(format => {
      const type = format.identifiers.find(item => item.identifier === file.mimeType);
      if (type) {
        return {
          mime: type.identifier,
          name: format.id.name,
        };
      }
      return {};
    });
    AcceptedType = AcceptedType.find(e => e?.name);
    if (AcceptedType) {
      if (defaultValues
          && defaultValues[actionType.id.name]
          && defaultValues[actionType.id.name][AcceptedType.name]) {
        defaultValues[actionType.id.name][AcceptedType.name];
        const { defaultAction: action, defaultTool: tool } = defaultValues[actionType.id.name][AcceptedType.name];
        file.action = arg.acceptedActions
          .find(act => act.id.name === action).inputToolArguments.map(i => i.value);
        // eslint-disable-next-line prefer-destructuring
        file.tool = arg.tools.filter(t => t.id.name === tool)[0];
      }
    }
  }
  return file;
}
// eslint-disable-next-line consistent-return
async function setMT(p) {
  let MT = null;
  try {
    MT = await FileType.fromFile(p).mime;
    if (!MT) {
      MT = mime.lookup(p);
    }
  } catch (err) {
    console.log(err);
  } finally {
    return MT;
  }
}
async function parseBatch(bpath, recur, arg) {
  try {
    for (const item of readdirSync(bpath, 'utf8')) {
      const filePath = `${bpath}/${item}`;
      const file = {
        name: item,
        path: filePath,
        isDir: lstatSync(filePath).isDirectory(),
        action: null,
        tool: null,
      };
      if (!file.isDir) {
        file.mimeType = await setMT(filePath);
        handleDefaultValues(arg, file);
      }
      recur && file.isDir ? await parseBatch(file.path, recur, arg) : !file.isDir && files.push(file);
    }
  } catch (error) {
    console.log(error);
  } finally {
    return files;
  }
}

ipcMain.on('execute-file-action', async (event, arg) => {
  files = [];
  reportText = '';
  if (arg.fileOrigin === 'folder') {
    await parseBatch(arg.batchPath, arg.recursive, arg);
    for (const file of files) {
      reportText = await runBatchScript(
        file.tool,
        file.path,
        file.action,
        file.name,
        arg.outputFolder,
        event,
        arg.config,
        arg.batchPath,
      );
    }
    handleResultWindow(arg.config, event);
  } else if (arg.fileOrigin === 'url') {
    arg.filePath = path.join(os.tmpdir(), APP_NAME, 'downloads', `${getDateString()}-${arg.fileName}`);
    try {
      download(arg.path, arg.filePath)
        .then(() => runScript(
          arg.tool,
          arg.filePath,
          arg.option.value,
          arg.outputFolder,
          event,
          arg.config,
        ))
        .catch(err => {
          event.sender.send('receive-load', false);
          runJobFailed(err);
          console.log(err);
        });
    } catch (err) {
      event.sender.send('receive-load', false);
      runJobFailed(err.message);
      console.log(err);
    }
  } else {
    arg.filePath = arg.path;
    console.log(arg);
    runScript(arg.tool, arg.filePath, arg.option.value, arg.outputFolder, event, arg.config);
  }
  try {
    updateConfig(outputPath);
  } catch (err) {
    runJobFailed(err.message);
  }
  console.log(reportText);
});

ipcMain.on('update-default-values', (event, defaultValues) => {
  try {
    updateDefaultValues(defaultValues);
  } catch (err) {
    runJobFailed(err.message);
  }
});

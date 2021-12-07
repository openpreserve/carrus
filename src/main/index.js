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

const isDevelopment = process.env.NODE_ENV !== 'production';
let mainWindow;

let cancelBatchProcessing = false;
let batchReportText = '';
const processStage = {
  stage: 0,
  stages: 0,
  alreadyStarted: 0,
  canceled: 0,
  currentFile: null,
};
let files = [];
let processThreads = [];
const N = os.cpus().length * 2;
let width = 1080;
let height = 680;

async function createMainWindow() {
  const factor = screen.getPrimaryDisplay().scaleFactor;
  if (factor === 1) {
    width = 1080;
    height = 800;
  } else if (factor >= 1.25 && factor < 1.5) {
    width = 865;
    height = 700;
  } else if (factor >= 1.5) {
    width = 740;
    height = 600;
  }

  process.setMaxListeners(Infinity);

  const window = new BrowserWindow({
    width,
    height,
    minWidth: width,
    minHeight: height,
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
    width,
    height,
    minWidth: width,
    minHeight: height,
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
  // eslint-disable-next-line no-shadow
  let dest = '';

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

  const command = OSconfigTool.interpreterPath === 'shell' ? scriptPath : OSconfigTool.interpreterPath;
  const optionObj = {};

  if (OSconfigTool.workingDirectory) {
    optionObj.cwd = isDevelopment
      ? path.join(__dirname, '..', '..', 'libs', OSconfigTool.workingDirectory)
      : path.join(__dirname, '..', 'libs', OSconfigTool.workingDirectory);
  }

  reportData = spawn(command, [
    ...OSconfigTool.interpreterArguments,
    ...optionArr,
    filePath,
  ], optionObj);

  reportData.stdout.on('data', (data) => {
    data ? reportText += data.toString() : null;
    dest = path.join(outFol, `${path.basename(filePath)}-${tool.id.name}_${getDateString()}.txt`);
  });
  reportData.stdout.on('end', () => {
    handleResultWindow(reportText, dest, config, event);
    fs.writeFile(dest, reportText, error => {
      if (error) {
        event.sender.send('receive-load', false);
        error.message !== `ENOENT: no such file or directory, open ''`
          ? runJobFailed(error.message)
          : runJobFailed(`${errorText}`);
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
};

async function runBatchScript(tool, filePath, optionArr, fileName, mimeType, outFol, event,
  config, batchPath, timestamp, callback) {
  let errorText = '';
  const batchDest = path.join(outFol, `${path.basename(batchPath)}_${timestamp}.log`);
  const baseFolder = path.join(outFol, `${path.basename(batchPath)}_${timestamp}`);
  const folders = path.relative(batchPath, filePath);

  if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder);
  }
  if (tool && optionArr && mimeType) {
    // eslint-disable-next-line no-unused-vars
    let shieldedPath = filePath.split('');
    shieldedPath.unshift('"');
    shieldedPath.push('"');
    shieldedPath = shieldedPath.join('');

    let reportData = '';
    let reportText = '';

    const configTool = Object.keys(config?.tools).find(e => e === tool.id.name);
    const OSconfigTool = configTool ? config.tools[configTool].find(e => e.OS === os.platform()) : null;
    if (!OSconfigTool) {
      runJobFailed(`There is no ${tool.toolName} tool in config`);
      const exit = changeProgressState(fileName, batchDest, config, event);
      if (exit && callback && !cancelBatchProcessing) {
        callback(outFol, event, config, batchPath, timestamp);
      }
      return '';
    }

    const scriptPath = isDevelopment
      ? path.join(__dirname, '..', '..', 'libs', OSconfigTool.scriptPath)
      : path.join(__dirname, '..', 'libs', OSconfigTool.scriptPath);

    const command = OSconfigTool.interpreterPath === 'shell' ? scriptPath : OSconfigTool.interpreterPath;
    const optionObj = {};

    if (OSconfigTool.workingDirectory) {
      optionObj.cwd = isDevelopment
        ? path.join(__dirname, '..', '..', 'libs', OSconfigTool.workingDirectory)
        : path.join(__dirname, '..', 'libs', OSconfigTool.workingDirectory);
    }

    reportData = spawn(command, [
      ...OSconfigTool.interpreterArguments,
      optionArr,
      filePath,
    ], optionObj);
    processThreads.push(reportData);

    reportData.stdout.on('data', data => {
      reportText += data.toString();
    });

    reportData.stdout.on('end', () => {
      if (reportText.length > 0) {
        batchReportText += `${folders} - ${mimeType} - ${tool.toolName}${optionArr} \n`;
        const splFolders = folders.split(path.sep);
        let relFolder = baseFolder;
        for (let i = 0; i < splFolders.length - 1; i += 1) {
          relFolder = path.join(relFolder, splFolders[i]);
          if (!fs.existsSync(relFolder)) {
            fs.mkdirSync(relFolder);
          }
        }

        const dest = path.join(relFolder,
          `${fileName}-${tool.id.name}_${getDateString()}.txt`);

        fs.writeFile(dest, reportText, error => {
          if (error) {
            runJobFailed(error.message);
          }
        });
      } else {
        processStage.canceled += 1;
        if (errorText.length > 0) {
          batchReportText += `${folders} - (${errorText}) - ${mimeType} - ${tool.toolName}${optionArr} \n`;
        } else {
          batchReportText += `${folders} - (CANCELED) - ${mimeType} - ${tool.toolName}${optionArr} \n`;
        }
      }

      const exit = changeProgressState(fileName, batchDest, config, event);
      if (exit && callback && !cancelBatchProcessing) {
        callback(outFol, event, config, batchPath, timestamp);
      }
    });

    reportData.stderr.on('data', (data) => {
      errorText += data.toString();
    });

    reportData.on('error', (err) => {
      errorText += err.toString();
    });
  } else if (!mimeType) {
    processStage.canceled += 1;
    batchReportText += `${folders} - Cannot be processed: Mime type was not detected \n`;
    const exit = changeProgressState(fileName, batchDest, config, event);
    if (exit && callback && !cancelBatchProcessing) {
      callback(outFol, event, config, batchPath, timestamp);
    }
  } else {
    processStage.canceled += 1;
    batchReportText += `${folders} - ${mimeType} - Cannot be processed: No tool or action \n`;
    const exit = changeProgressState(fileName, batchDest, config, event);
    if (exit && callback && !cancelBatchProcessing) {
      callback(outFol, event, config, batchPath, timestamp);
    }
  }
  return batchReportText;
}
// eslint-disable-next-line no-unused-vars
function handleResultWindow(reportText, dest, config, event) {
  if (reportText) {
    const win = new BrowserWindow({
      width,
      height,
      minWidth: width,
      minHeight: height,
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
}

function handleDefaultValues(arg, file) {
  const { actionType, fileFormats } = arg;
  const { defaultValues } = arg.config;
  if (defaultValues) {
    let AcceptedTypes = fileFormats.map(format => {
      const type = format.identifiers.find(item => item.identifier === file.mimeType);
      if (type) {
        return {
          mime: type.identifier,
          name: format.id.name,
        };
      }
      return null;
    });
    AcceptedTypes = AcceptedTypes.filter(e => e?.name);
    if (AcceptedTypes) {
      AcceptedTypes.some(AcceptedType => {
        if (defaultValues
            && defaultValues[actionType.id.name]
            && defaultValues[actionType.id.name][AcceptedType.name]) {
          const { defaultAction: action, defaultTool: tool } = defaultValues[actionType.id.name][AcceptedType.name];

          const actions = arg.acceptedActions.find(act => act.id.name === action);
          if (actions) {
            file.action = actions.inputToolArguments.map(i => i.value);
          }
          const tools = arg.tools.filter(t => t.id.name === tool);
          if (tools) {
            // eslint-disable-next-line prefer-destructuring
            file.tool = tools[0];
          }
          if (file.action && file.tool) {
            return true;
          }
        }
      });
    }
  }
  return file;
}
function processCall(outFol, event, config, batchPath, timestamp) {
  let callback = processCall;

  if (cancelBatchProcessing) {
    callback = null;
  }
  const file = files[processStage.alreadyStarted];
  if (!file) {
    return;
  }
  processStage.alreadyStarted += 1;
  runBatchScript(
    file.tool,
    file.path,
    file.action,
    file.name,
    file.mimeType,
    outFol,
    event,
    config,
    batchPath,
    timestamp,
    callback,
  );
}
function changeProgressState(fileName, dest, config, event) {
  if (fileName) {
    processStage.stage += 1;
    processStage.currentFile = fileName;
  }
  if (!cancelBatchProcessing) {
    if (processStage.stages <= processStage.stage) {
      event.sender.send('stage', {});
      fs.writeFile(dest, batchReportText, error => {
        if (error) {
          runJobFailed(error.message);
        }
      });
      batchReportText += `${processStage.alreadyStarted - processStage.canceled}/${processStage.stages}`;
      handleResultWindow(batchReportText, dest, config, event);
      return false;
    }
    if (fileName) {
      event.sender.send('stage', processStage);
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (processStage.alreadyStarted <= processStage.stage) {
      event.sender.send('stage', {});
      fs.writeFile(dest, batchReportText, error => {
        if (error) {
          runJobFailed(error.message);
        }
      });
      batchReportText += `${processStage.alreadyStarted - processStage.canceled}/${processStage.stages}`;
      handleResultWindow(batchReportText, dest, config, event);
      return false;
    }
    event.sender.send('stage', { cancel: true });
  }
  return true;
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
// eslint-disable-next-line no-shadow
async function parseBatch(files, bpath, recur, arg) {
  try {
    for (const item of readdirSync(bpath, 'utf8')) {
      const filePath = `${bpath}${path.sep}${item}`;
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
      recur && file.isDir ? await parseBatch(files, file.path, recur, arg) : !file.isDir && files.push(file);
    }
  } catch (error) {
    console.log(error);
  }
}

ipcMain.on('cancel-batch-processing', async () => {
  cancelBatchProcessing = true;
  processThreads.forEach(thr => {
    try {
      if (thr) {
        thr.kill();
      }
    } catch (error) {
      console.log(error);
    }
  });
});

ipcMain.on('execute-file-action', async (event, arg) => {
  if (arg.fileOrigin === 'folder') {
    files = [];
    processThreads = [];
    await parseBatch(files, arg.batchPath, arg.recursive, arg);
    event.sender.send('receive-load', true);

    cancelBatchProcessing = false;
    processStage.stages = files.length;
    processStage.stage = 0;
    processStage.alreadyStarted = 0;
    processStage.canceled = 0;
    processStage.currentFile = '';
    event.sender.send('stage', processStage);

    batchReportText = '';
    const timestamp = getDateString();

    for (let i = 0; i < (files.length < N ? files.length : N); i += 1) {
      if (!cancelBatchProcessing) {
        Promise.resolve(processCall(
          arg.outputFolder,
          event,
          arg.config,
          arg.batchPath,
          timestamp,
        ));
      }
    }
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
    runScript(arg.tool, arg.filePath, arg.option.value, arg.outputFolder, event, arg.config);
  }
  try {
    updateConfig(arg.outputFolder);
  } catch (err) {
    runJobFailed(err.message);
  }
});

ipcMain.on('update-default-values', (event, defaultValues) => {
  try {
    console.log('defaultValues.outputFolder');
    updateDefaultValues(defaultValues);
  } catch (err) {
    runJobFailed(err.message);
  }
});

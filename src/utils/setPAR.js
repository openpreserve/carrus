/* eslint-disable no-console */
/* eslint-disable quote-props */
/* eslint-disable quotes */
/* eslint-disable no-else-return */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import path from 'path';
import { readdirSync, readFileSync } from 'fs';

export default async function setPAR(isDevelopment, runJobFailed) {
  let actionsPath = path.join(__dirname, '..', 'PAR', 'Actions');
  let toolsPath = path.join(__dirname, '..', 'PAR', 'Tools');
  let fileFormatsPath = path.join(__dirname, '..', 'PAR', 'FileFormats');
  let actionTypesPath = path.join(__dirname, '..', 'PAR', 'ActionTypes');
  const actions = [];
  const actionTypes = [];
  const tools = [];
  const fileFormats = [];
  if (isDevelopment) {
    actionsPath = './PAR/Actions';
    toolsPath = './PAR/Tools';
    fileFormatsPath = './PAR/FileFormats';
    actionTypesPath = './PAR/ActionTypes';
  }
  try {
    readdirSync(actionsPath).forEach(e => {
      let action;
      action = readFileSync(path.join(actionsPath, e), 'utf-8');
      try {
        action = JSON.parse(action);
        actions.push({
          ...action,
          active: false,
        });
      } catch (error) {
        console.log(error);
        runJobFailed(error.message);
      }
    });

    readdirSync(actionTypesPath).forEach(e => {
      let actionType;
      actionType = readFileSync(path.join(actionTypesPath, e), 'utf-8');
      try {
        actionType = JSON.parse(actionType);
        actionTypes.push({
          ...actionType,
          active: false,
        });
      } catch (error) {
        console.log(error);
        runJobFailed(error.message);
      }
    });

    readdirSync(toolsPath).forEach(e => {
      let tool;
      tool = readFileSync(path.join(toolsPath, e), 'utf-8');
      try {
        tool = JSON.parse(tool);
        tools.push({
          ...tool,
          active: false,
        });
      } catch (error) {
        console.log(error);
        runJobFailed(error.message);
      }
    });

    readdirSync(fileFormatsPath).forEach(e => {
      let fileFormat;
      fileFormat = readFileSync(path.join(fileFormatsPath, e), 'utf-8');
      try {
        fileFormat = JSON.parse(fileFormat);
        fileFormats.push({
          ...fileFormat,
          active: false,
        });
      } catch (error) {
        console.log(error);
        runJobFailed(error.message);
      }
    });
  } catch (error) {
    console.log(error);
  }
  return {
    actions,
    tools,
    fileFormats,
    actionTypes,
  };
}

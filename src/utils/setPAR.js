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
  let actions;
  let actionTypes;
  const tools = [];
  let fileFormats;
  if (isDevelopment) {
    actionsPath = './PAR/Actions';
    toolsPath = './PAR/Tools';
    fileFormatsPath = './PAR/FileFormats';
    actionTypesPath = './PAR/ActionTypes';
  }
  try {
    actions = readdirSync(actionsPath).map(e => ({
      ...JSON.parse(readFileSync(path.join(actionsPath, e), 'utf-8')),
      active: false,
    }));
    actionTypes = readdirSync(actionTypesPath).map(e => ({
      ...JSON.parse(readFileSync(path.join(actionTypesPath, e), 'utf-8')),
      active: false,
    }));
    /* try {
      tools = readdirSync(toolsPath).map(e => ({
        ...JSON.parse(readFileSync(path.join(toolsPath, e), 'utf-8')),
        active: false,
      }));
    } catch (error) {
      tools = [];
      console.log(error);
      runJobFailed(error.message);
    } */
    readdirSync(toolsPath).forEach(e => {
      console.log(e);
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
    console.log(tools);
    fileFormats = readdirSync(fileFormatsPath).map(e => ({
      ...JSON.parse(readFileSync(path.join(fileFormatsPath, e), 'utf-8')),
      active: false,
    }));
  } catch (error) {
    /* runJobFailed(error.message);
    return {}; */
  }
  return {
    actions,
    tools,
    fileFormats,
    actionTypes,
  };
}

/* eslint-disable no-console */
/* eslint-disable quote-props */
/* eslint-disable quotes */
/* eslint-disable no-else-return */
/* eslint-disable no-unused-vars */
import path from 'path';
import { readdirSync, readFileSync } from 'fs';

export default async function setPAR(isDevelopment) {
  let actionsPath = path.join(__dirname, '..', 'PAR', 'Actions');
  let toolsPath = path.join(__dirname, '..', 'PAR', 'Tools');
  let fileFormatsPath = path.join(__dirname, '..', 'PAR', 'FileFormats');
  let actionTypesPath = path.join(__dirname, '..', 'PAR', 'ActionTypes');
  if (isDevelopment) {
    actionsPath = './PAR/Actions';
    toolsPath = './PAR/Tools';
    fileFormatsPath = './PAR/FileFormats';
    actionTypesPath = './PAR/ActionTypes';
  }
  const actions = readdirSync(actionsPath).map(e => ({
    ...JSON.parse(readFileSync(path.join(actionsPath, e), 'utf-8')),
    active: false,
  }));
  const actionTypes = readdirSync(actionTypesPath).map(e => ({
    ...JSON.parse(readFileSync(path.join(actionTypesPath, e), 'utf-8')),
    active: false,
  }));
  const tools = readdirSync(toolsPath).map(e => ({
    ...JSON.parse(readFileSync(path.join(toolsPath, e), 'utf-8')),
    active: false,
  }));
  const fileFormats = readdirSync(fileFormatsPath).map(e => ({
    ...JSON.parse(readFileSync(path.join(fileFormatsPath, e), 'utf-8')),
    active: false,
  }));
  return {
    actions,
    tools,
    fileFormats,
    actionTypes,
  };
}

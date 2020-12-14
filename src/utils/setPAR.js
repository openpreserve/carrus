/* eslint-disable no-console */
/* eslint-disable quote-props */
/* eslint-disable quotes */
/* eslint-disable no-else-return */
/* eslint-disable no-unused-vars */
import path from 'path';
import { readdirSync, readFileSync } from 'fs';

export default async function setPAR(isDevelopment) {
  let actionsPath = path.join(__dirname, '..', 'src', 'PAR', 'Actions');
  let toolsPath = path.join(__dirname, '..', 'src', 'PAR', 'Tools');
  let optionsPath = path.join(__dirname, '..', 'src', 'PAR', 'Options');
  if (isDevelopment) {
    actionsPath = path.join(__dirname, '..', 'PAR', 'Actions');
    toolsPath = path.join(__dirname, '..', 'PAR', 'Tools');
    optionsPath = path.join(__dirname, '..', 'PAR', 'Options');
  }
  const actions = readdirSync(actionsPath).map(e => ({
    ...JSON.parse(readFileSync(path.join(actionsPath, e), 'utf-8')),
    active: false,
  }));
  const tools = readdirSync(toolsPath).map(e => ({
    ...JSON.parse(readFileSync(path.join(toolsPath, e), 'utf-8')),
    active: false,
  }));
  const options = readdirSync(optionsPath).map(e => ({
    ...JSON.parse(readFileSync(path.join(optionsPath, e), 'utf-8')),
    active: false,
  }));
  return {
    actions,
    tools,
    options,
  };
}

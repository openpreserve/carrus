/* eslint-disable quote-props */
/* eslint-disable quotes */
/* eslint-disable no-else-return */
/* eslint-disable no-unused-vars */
import path from 'path';
import util from 'util';
import fs, { readdirSync, readFileSync } from 'fs';

export default async function setPAR(isDevelopment) {
  const PAR = {};
  let actionsPath = path.join(__dirname, '..', 'src', 'PAR', 'Actions');
  if (isDevelopment) {
    actionsPath = path.join(__dirname, '..', 'PAR', 'Actions');
    PAR.actions = readdirSync(actionsPath).map(e => ({
      ...JSON.parse(readFileSync(path.join(actionsPath, e), 'utf-8')),
      active: false,
    }));
    return PAR;
  }
  PAR.actions = readdirSync(actionsPath).map(e => ({
    ...JSON.parse(readFileSync(path.join(actionsPath, e), 'utf-8')),
    active: false,
  }));
  return PAR;
}

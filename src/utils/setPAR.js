import path from 'path';
import { readdirSync, readFileSync } from 'fs';

export default async function setPAR(isDevelopment) {
  const PAR = {};
  let actionsPath = path.join(__dirname, '..', 'src', 'PAR', 'Actions');
  if (isDevelopment) {
    actionsPath = path.join(__dirname, '..', 'PAR', 'Actions');
  }
  PAR.actions = readdirSync(actionsPath).map(e => ({
    ...JSON.parse(readFileSync(path.join(actionsPath, e), 'utf-8')),
    active: false,
  }));
  return PAR;
}

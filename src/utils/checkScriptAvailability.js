/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
import React from 'react';
import path from 'path';
import fs from 'fs';

export default function checkScriptAvailability(activeAction, tools, isDevelopment) {
  let scriptPath = path.join(__dirname, '..', 'libs');

  if (isDevelopment) {
    scriptPath = path.join(__dirname, '..', '..', 'libs');
  }

  const AvailableTools = tools
    .filter(e => activeAction.tool.map(activeActionTool => activeActionTool.id.guid).includes(e.id.guid))
    .filter((tool) => fs.existsSync(path.join(scriptPath, tool.path.value)));
  return AvailableTools.map(e => <option key={e.id.guid}>{e.id.name}</option>);
}

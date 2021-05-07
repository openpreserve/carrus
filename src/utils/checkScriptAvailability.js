/* eslint-disable no-console */
import React from 'react';
import path from 'path';
import fs from 'fs';
import os from 'os';

function unique(arr) {
  const result = [];
  arr.forEach(item => {
    if (!result.find(e => e.tool.id.guid === item.tool.id.guid)) {
      result.push(item);
    }
  });
  return result;
}

export default function checkScriptAvailability(activeActionTypes, tools, acceptedActions, config) {
  let scriptPath = path.join(__dirname, '..', 'libs');

  if (config.isDevelopment) {
    scriptPath = path.join(__dirname, '..', '..', 'libs');
  }

  if (tools.length === 0 || !config.tools) {
    return <option disabled>No accepted tools</option>;
  }

  const correctActions = acceptedActions.filter(action => action.type.id.guid === activeActionTypes.id.guid);

  let AvailableTools = [];

  unique(correctActions).forEach(action => {
    const candidate = tools.find(tool => tool.id.guid === action.tool.id.guid);
    if (candidate) {
      AvailableTools.push(candidate);
    }
  });

  try {
    AvailableTools = AvailableTools.filter((tool) => {
      const configTool = Object.keys(config.tools).find(e => e === tool.toolName);
      const OSconfigTool = configTool ? config.tools[configTool].find(e => e.OS === os.platform()) : null;
      return OSconfigTool ? fs.existsSync(path.join(scriptPath, OSconfigTool.scriptPath)) : false;
    });
  } catch (error) {
    AvailableTools = '';
    console.error(error);
  }

  return (AvailableTools.length !== 0
    ? AvailableTools.map(e => <option key={e.id.guid}>{e.id.name}</option>)
    : <option disabled>No accepted tools</option>);
}

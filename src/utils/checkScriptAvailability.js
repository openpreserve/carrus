/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
import React from 'react';
import path from 'path';
import fs from 'fs';

function unique(arr) {
  const result = [];
  arr.forEach(item => {
    if (!result.find(e => e.tool.id.guid === item.tool.id.guid)) {
      result.push(item);
    }
  });
  return result;
}

export default function checkScriptAvailability(activeActionTypes, tools, acceptedActions, isDevelopment) {
  let scriptPath = path.join(__dirname, '..', 'libs');

  if (isDevelopment) {
    scriptPath = path.join(__dirname, '..', '..', 'libs');
  }

  if (tools.length === 0) {
    return <option disabled>No accepted tools</option>;
  }

  const correctActions = acceptedActions.filter(action => action.type.id.guid === activeActionTypes.id.guid);

  const AvailableTools = [];

  unique(correctActions).forEach(action => {
    const candidate = tools.find(tool => tool.id.guid === action.tool.id.guid);
    if (candidate) {
      AvailableTools.push(candidate);
    }
  });
  AvailableTools.filter((tool) => fs.existsSync(path.join(scriptPath, tool.toolLabel)));
  return (AvailableTools.length !== 0
    ? AvailableTools.map(e => <option key={e.id.guid}>{e.id.name}</option>)
    : <option disabled>No accepted tools</option>);
}

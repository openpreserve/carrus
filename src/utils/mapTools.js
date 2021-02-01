/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
import React from 'react';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { green } from '@material-ui/core/colors';

export default function mapTools(tools, actions, type) {
  const { t } = useTranslation();
  const activeTool = tools.find(tool => tool.active);
  const acceptedActions = [];
  if (!activeTool) {
    return <span>{t('noDefaultTools')}</span>;
  }
  activeTool.toolAcceptedParameters.forEach(param => {
    acceptedActions.push(actions.find(action => action.id.guid === param.id.guid));
  });
  if (acceptedActions
    .filter(action => action.constraints.length === 0 || action.constraints[0].allowedFormats[0].id.name === type)
    .length) {
    return (
      <div className="d-flex flex-row w-50 mb-3">
        <CheckCircleOutlineIcon style={{ color: green[500] }} />
        <span className="ml-1">{activeTool.id.name}</span>
      </div>
    );
  }
  return <span>{t('noDefaultTools')}</span>;
}

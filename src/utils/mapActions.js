/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-else-return */
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function mapActions(actions, defaultActionType, defaultFileType, defaultTool) {
  const { t } = useTranslation();
  const acceptedActions = [];

  if (!defaultActionType || !defaultFileType || !defaultTool) {
    return (
      <>
        <option hidden>{t('noActions')}</option>
        <option disabled>{t('noActions')}</option>
      </>
    );
  }

  actions.forEach(action => {
    if (
      action.type.id.name === defaultActionType
      && (action?.constraints.length === 0
      || action?.constraints[0]?.allowedFormats.find((format) => format?.id.name === defaultFileType))
    ) {
      acceptedActions.push(action);
    }
  });

  if (acceptedActions.length) {
    return (
      <>
        <option hidden>{t('ChooseOption')}</option>
        {acceptedActions
          .filter(action => (action.tool.id.name === defaultTool))
          .map((action, i) => (
            <option key={i}>{action.id.name}</option>
          ))}
      </>
    );
  }

  return (
    <>
      <option hidden>{t('ChooseOption')}</option>
      <option disabled>{t('noActions')}</option>
    </>
  );
}

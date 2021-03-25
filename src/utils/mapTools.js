/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { useTranslation } from 'react-i18next';

function unique(arr) {
  const result = [];
  arr.forEach(item => {
    if (!result.find(e => e === item)) {
      result.push(item);
    }
  });
  return result;
}

export default function mapTools(actions, defaultActionType, defaultFileType) {
  const { t } = useTranslation();
  const acceptedActions = [];

  if (!defaultActionType || !defaultFileType) {
    return (
      <>
        <option hidden>{t('noDefaultTools')}</option>
        <option disabled>{t('noDefaultTools')}</option>
      </>
    );
  }

  actions.forEach(action => {
    if (
      action.type.id.name === defaultActionType
      && (action?.constraints.length === 0
      || action?.constraints[0]?.allowedFormats.find((format) => format?.id.name === defaultFileType))
    ) {
      acceptedActions.push(action.tool.id.name);
    }
  });

  if (acceptedActions.length) {
    return (
      <>
        <option hidden>{t('ChooseTool')}</option>
        {unique(acceptedActions).map((e, i) => (
          <option key={i}>{e}</option>
        ))}
      </>
    );
  }

  return (
    <>
      <option hidden>{t('noDefaultTools')}</option>
      <option disabled>{t('noDefaultTools')}</option>
    </>
  );
}

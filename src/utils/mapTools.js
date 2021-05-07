/* eslint-disable react/no-array-index-key */
/* eslint-disable no-else-return */
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
  const acceptedTools = [];

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
      acceptedTools.push(action.tool.id.name);
    }
  });

  if (acceptedTools.length) {
    return (
      <>
        <option>no default</option>
        {unique(acceptedTools).map((tool, i) => (
          <option key={i}>{tool}</option>
        ))}
      </>
    );
  } else {
    return (
      <>
        <option>no default</option>
        <option disabled>{t('noDefaultTools')}</option>
      </>
    );
  }
}

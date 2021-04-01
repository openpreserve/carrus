/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
export default function setDefaultValues(defaultObj, defaultValues) {
  if (defaultValues[defaultObj.defaultActionType]) {
    if (defaultValues[defaultObj.defaultActionType][defaultObj.defaultFileType]) {
      defaultValues[defaultObj.defaultActionType][defaultObj.defaultFileType].defaultTool = defaultObj.defaultTool;
      defaultValues[defaultObj.defaultActionType][defaultObj.defaultFileType].defaultAction = defaultObj.defaultAction;
      return defaultValues;
    }
    defaultValues[defaultObj.defaultActionType][defaultObj.defaultFileType] = {
      defaultTool: defaultObj.defaultTool,
      defaultAction: defaultObj.defaultAction,
    };
    return defaultValues;
  }

  defaultValues[defaultObj.defaultActionType] = {
    [defaultObj.defaultFileType]: {
      defaultTool: defaultObj.defaultTool,
      defaultAction: defaultObj.defaultAction,
    },
  };

  return defaultValues;
}

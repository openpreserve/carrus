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

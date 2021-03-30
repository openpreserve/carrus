/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
export default function setDefaultValues(defaultObj, defaultValues) {
  const oldObjIndex = defaultValues.findIndex((obj) => (
    (obj.defaultFileType === defaultObj.defaultFileType && obj.defaultActionType === defaultObj.defaultActionType)
  ));
  if (oldObjIndex !== (-1)) {
    defaultValues[oldObjIndex].defaultAction = defaultObj.defaultAction;
    defaultValues[oldObjIndex].defaultTool = defaultObj.defaultTool;
    return defaultValues;
  }

  defaultValues.push(defaultObj);

  return defaultValues;
}

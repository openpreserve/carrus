/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
function flatDeep(arr, d = 1) {
  return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
    : arr.slice();
}
export default function setAcceptedType(actions, mimeType, fileFormats) {
  let AcceptedType = fileFormats.map(format => {
    const type = format.identifiers.find(item => item.identifier === mimeType);
    if (type) {
      return {
        mime: type.identifier,
        name: format.id.name,
      };
    }
    return {};
  });
  const allTypes = flatDeep(actions.map(action => {
    if (action.constraints) {
      return action?.constraints[0]?.allowedFormats;
    }
  }), 2).filter(Boolean);
  AcceptedType = AcceptedType.find(e => e?.name);
  const isAccepted = !!allTypes.find(item => item?.id.name === AcceptedType?.name);
  if (actions.filter(action => (!action.constraints || action.constraints.length === 0))) {
    return true;
  }
  return isAccepted;
}

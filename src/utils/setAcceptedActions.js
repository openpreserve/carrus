/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
export default function setAcceptedActions(actions, fileFormats, mimeType) {
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
  /*   console.log(AcceptedType); */
  AcceptedType = AcceptedType.find(e => e?.name);
  const AcceptedActions = actions.filter(action => action.constraints[0].allowedFormats
    .find(item => item.id.name === AcceptedType?.name));
  /*  console.log(AcceptedActions); */
  return AcceptedActions;
}

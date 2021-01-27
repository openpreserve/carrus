/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
import React from 'react';

function unique(arr) {
  const result = [];
  arr.forEach(item => {
    if (!result.includes(item)) {
      result.push(item);
    }
  });

  return result;
}

export default function mapActionTypes(acceptedActions) {
  const allActionTypes = acceptedActions.map(e => e.type.id.name);
  return unique(allActionTypes).map(e => (
    <option key={Math.random()}>{e}</option>
  ));
}

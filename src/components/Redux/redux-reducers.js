/* eslint-disable import/prefer-default-export */
import actionTypes from './types';

const initialState = {
  action: 'Validate',
  tool: 'veraPDF',
  options: 'PDF/A-1',
  outputFolder: '',
  url: '',
  fileOrigin: 'file',
};

export const preproccessReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ACTION: {
      return {
        ...state,
        action: action.payload,
      };
    }
    case actionTypes.SET_OPTIONS: {
      return {
        ...state,
        options: action.payload,
      };
    }
    case actionTypes.SET_TOOL: {
      return {
        ...state,
        tool: action.payload,
      };
    }
    case actionTypes.SET_URL: {
      return {
        ...state,
        url: action.payload,
      };
    }
    case actionTypes.SET_OUTPUT_FOLDER: {
      return {
        ...state,
        outputFolder: action.payload,
      };
    }
    case actionTypes.SET_FILE_ORIGIN: {
      return {
        ...state,
        fileOrigin: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export const setTool = value => ({ type: actionTypes.SET_TOOL, payload: value });
export const setOptions = value => ({ type: actionTypes.SET_OPTIONS, payload: value });
export const setAction = value => ({ type: actionTypes.SET_ACTION, payload: value });
export const setURL = value => ({ type: actionTypes.SET_URL, payload: value });
export const setOutputFolder = value => ({ type: actionTypes.SET_OUTPUT_FOLDER, payload: value });
export const setFileOrigin = value => ({ type: actionTypes.SET_FILE_ORIGIN, payload: value });

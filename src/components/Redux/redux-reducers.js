/* eslint-disable import/prefer-default-export */
import actionTypes from './types';

const initialState = {
  action: 'Validate',
  tool: 'veraPDF',
  options: 'PDF/A-1',
  outputFolder: '',
  url: '',
  fileOrigin: 'file',
  currentLanguage: 'en',
  defaultJPEGTool: 'JPEG hul',
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
    case actionTypes.UPDATE_LANGUAGE: {
      return {
        ...state,
        currentLanguage: action.payload,
      };
    }
    case actionTypes.UPDATE_JPEG_TOOL: {
      return {
        ...state,
        defaultJPEGTool: action.payload,
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
export const updateLanguage = value => ({ type: actionTypes.UPDATE_LANGUAGE, payload: value });
export const updateJPEGTool = value => ({ type: actionTypes.UPDATE_JPEG_TOOL, payload: value });

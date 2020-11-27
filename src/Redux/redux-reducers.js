/* eslint-disable no-console */
import actionTypes from './types';
import Validate from '../PAR/Actions/Validate.json';
import Characterize from '../PAR/Actions/Characterize.json';

const initialState = {
  actions: [
    {
      ...Validate,
      active: true,
    },
    {
      ...Characterize,
      active: false,
    },
  ],
  tool: '',
  outputFolder: '',
  url: '',
  fileOrigin: 'file',
  defaultJPEGTool: 'JPEG hul',
  filePath: '',
  dirPath: '',
  fileName: '',
};

export const preproccessReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ACTION: {
      return {
        ...state,
        actions: state.actions.map(e => {
          if (e.preservationActionName === action.payload) {
            return {
              ...e,
              active: true,
            };
          }
          return {
            ...e,
            active: false,
          };
        }),
        tool: state.actions.filter(e => e.active)[0].tool[0].toolName,
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
    case actionTypes.UPDATE_JPEG_TOOL: {
      return {
        ...state,
        defaultJPEGTool: action.payload,
      };
    }
    case actionTypes.SET_FILE_PATH: {
      return {
        ...state,
        filePath: action.payload,
      };
    }
    case actionTypes.SET_FILE_NAME: {
      return {
        ...state,
        fileName: action.payload,
      };
    }
    case actionTypes.SET_DIR_PATH: {
      return {
        ...state,
        dirPath: action.payload,
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
export const updateJPEGTool = value => ({ type: actionTypes.UPDATE_JPEG_TOOL, payload: value });
export const uploadFile = value => ({ type: actionTypes.SET_FILE_NAME, payload: value });
export const setFilePath = value => ({ type: actionTypes.SET_FILE_PATH, payload: value });
export const setDirPath = value => ({ type: actionTypes.SET_DIR_PATH, payload: value });

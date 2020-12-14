import actionTypes from './types';

const initialState = {
  actions: [],
  tool: '',
  outputFolder: '',
  url: '',
  fileOrigin: 'file',
  defaultPDFTool: '',
  defaultJPEGTool: 'JPEG hul',
  filePath: '',
  dirPath: '',
  fileName: '',
  mimeType: '',
};

export const preproccessReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ACTIONS: {
      return {
        ...state,
        actions: action.payload,
      };
    }
    case actionTypes.SET_ACTION: {
      const newActions = state.actions.map(e => ({
        ...e,
        active: e.preservationActionName === action.payload,
      }));
      return {
        ...state,
        actions: newActions,
        tool: newActions.filter(e => e.active)[0] ? newActions.filter(e => e.active)[0].tool[0].toolName : '',
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

    case actionTypes.SET_DIR_PATH: {
      return {
        ...state,
        dirPath: action.payload,
      };
    }
    case actionTypes.SET_DEFAULT_PDF_TOOl: {
      return {
        ...state,
        defaultPDFTool: action.payload,
      };
    }

    case actionTypes.SET_FILE_INFO: {
      return {
        ...state,
        mimeType: action.payload.type,
        fileName: action.payload.name,
        filePath: action.payload.path,
        actions: state.actions.map(e => ({
          ...e,
          active: false,
        })),
      };
    }

    default: {
      return state;
    }
  }
};

export const setTool = value => ({ type: actionTypes.SET_TOOL, payload: value });
export const setOptions = value => ({ type: actionTypes.SET_OPTIONS, payload: value });
export const setActions = value => ({ type: actionTypes.SET_ACTIONS, payload: value });
export const setAction = value => ({ type: actionTypes.SET_ACTION, payload: value });
export const setURL = value => ({ type: actionTypes.SET_URL, payload: value });
export const setOutputFolder = value => ({ type: actionTypes.SET_OUTPUT_FOLDER, payload: value });
export const setFileOrigin = value => ({ type: actionTypes.SET_FILE_ORIGIN, payload: value });
export const setDefaultPDFTool = value => ({ type: actionTypes.SET_DEFAULT_PDF_TOOl, payload: value });
export const updateJPEGTool = value => ({ type: actionTypes.UPDATE_JPEG_TOOL, payload: value });
export const setDirPath = value => ({ type: actionTypes.SET_DIR_PATH, payload: value });
export const setFileInfo = (fileName, filePath, fileMimeType) => ({
  type: actionTypes.SET_FILE_INFO,
  payload: { name: fileName, path: filePath, type: fileMimeType },
});

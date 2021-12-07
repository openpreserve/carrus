/* eslint-disable no-mixed-operators */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Label, Input, Button } from 'reactstrap';
import { ipcRenderer } from 'electron';
import isURL from 'validator/lib/isURL';
import setAcceptedActions from '../../utils/setAcceptedActions';
import checkScriptAvailability, { checkToolAvailability } from '../../utils/checkScriptAvailability';
import ProgressBar from '../Loading/ProgressBar';
import FileHandler from './FileHandler';
import FolderHandler from './FolderHandler';
import UrlHandler from './UrlHandler';
import SemiHeader from '../Header/SemiHeader';
import {
  setTool,
  setOptions,
  setAction,
  setFileOrigin,
  setMimeType,
  setFileInfo,
  setActionType,
  setLoad,
  setDirPath,
} from '../../Redux/redux-reducers';
import FolderInput from './FolderInput';

const hashCode = s => s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);

const Main = props => {
  const {
    fileOrigin,
    filePath,
    dirPath,
    mimeType,
    acceptedActions,
    activeActionTypes,
    activeAction,
    tools,
    activeTool,
    activeOption,
    url,
    fileName,
    fileFormats,
    config,
    load,
    batchPath,
    recursive,
  } = props;
  const { t } = useTranslation();
  const InputActionTypeRef = useRef();
  const InputToolRef = useRef();
  const InputOptionRef = useRef();
  const [error, setError] = useState('');
  const handleExecute = () => {
    props.setLoad(true);
    const dataToSend = {
      fileName,
      mimeType,
      fileFormats,
      fileOrigin,
      path: fileOrigin === 'url' ? url : filePath,
      actionType: activeActionTypes,
      action: activeAction,
      outputFolder: dirPath,
      tool: activeTool,
      option: activeOption,
      config,
      recursive,
      batchPath,
      tools,
      acceptedActions,
    };
    ipcRenderer.send('execute-file-action', dataToSend);
    ipcRenderer.on('receive-load', (event, value) => {
      props.setLoad(value);
    });
  };
  useEffect(() => {
    config.outFolder ? props.setDirPath(config.outFolder) : config.defaultPath;
  }, [config]);

  useEffect(() => {
    if (isURL(url)) {
      ipcRenderer.send('check-mime-type', url);
      ipcRenderer.on('receive-mime-type', (event, arg) => {
        if (arg !== null) props.setFileInfo(url.substring(url.lastIndexOf('/') + 1), '', arg);
        else {
          props.setFileInfo('', '', '');
          setError('file type is unavailable');
        }
      });
    } else if (url.length !== 0) {
      setError(t('invalidUrl'));
    } else {
      setError('');
    }
  }, [url]);

  function unique(arr) {
    const result = [];
    arr.forEach(item => {
      if (!result.find(e => e.type.id.guid === item.type.id.guid)) {
        result.push(item);
      }
    });
    return result;
  }

  function handleDefaultValues(ToolRef, OptionRef, actionType) {
    if (config.defaultValues) {
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

      AcceptedType = AcceptedType.find(e => e?.name);
      if (AcceptedType) {
        if (config.defaultValues
          && config.defaultValues[actionType]
          && config.defaultValues[actionType][AcceptedType.name]) {
          const { defaultTool: tool, defaultAction: action } = config.defaultValues[actionType][AcceptedType.name];
          props.setTool(tool);
          ToolRef.current = tool;
          props.setOptions([{
            value: acceptedActions
              .find(act => act.id.name === action)?.inputToolArguments.map(i => i.value),
            name: action,
          }]);
          OptionRef.current = action;
        }
      }
    }
  }

  return !load ? (
    <div className="container d-flex flex-column">
      <SemiHeader />
      <Nav tabs className="mt-5">
        <NavItem className="mr-1">
          <NavLink
            className={fileOrigin === 'file' ? 'active text-success font-weight-bold' : 'bg-light text-dark'}
            onClick={() => props.setFileOrigin('file')}
          >
            {t('YourFile')}
          </NavLink>
        </NavItem>
        <NavItem className="mr-1">
          <NavLink
            className={fileOrigin === 'folder' ? 'active text-success font-weight-bold' : 'bg-light text-dark'}
            onClick={() => {
              props.setFileOrigin('folder');
            }}
          >
            {t('YourFolder')}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={fileOrigin === 'url' ? 'active text-success font-weight-bold' : 'bg-light text-dark '}
            onClick={() => props.setFileOrigin('url')}
          >
            {t('FromUrl')}
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={fileOrigin}>
        <TabPane tabId="file">
          <FileHandler InputActionTypeRef={InputActionTypeRef} />
        </TabPane>
        <TabPane tabId="folder">
          <FolderHandler
            InputActionTypeRef={InputActionTypeRef}
            InputToolRef={InputToolRef}
            InputOptionRef={InputOptionRef}
          />
        </TabPane>
        <TabPane tabId="url">
          <UrlHandler isValid={!error.length} isEmpty={!url.length} feedback={error} />
        </TabPane>
      </TabContent>
      <FormGroup className="mt-3 w-100 d-flex flex-row">
        <Label for="action" className="mr-1 my-auto w-25">
          <span>{t('ActionType')}:</span>
        </Label>
        <Input
          className="w-50"
          type="select"
          onChange={e => {
            props.setActionType(e.target.value);
            InputActionTypeRef.current = e;
            InputToolRef.current ? document.querySelectorAll('select')[1].value = 'Choose Tool' : null;
            InputOptionRef.current ? document.querySelectorAll('select')[2].value = 'Choose Option' : null;
            handleDefaultValues(InputToolRef, InputOptionRef, e.target.value);
          }}
          value={activeActionTypes ? activeActionTypes.id.name : t('chooseAllowedActionTypes')}
        >
          {mimeType.length || fileOrigin.length && fileOrigin === 'folder' ? (
            acceptedActions.length || fileOrigin.length ? (
              <>
                <option hidden>{t('chooseAllowedActionTypes')}</option>
                {unique(acceptedActions).map(e => (
                  <option key={hashCode(e.id.guid + mimeType)}>{e.type.id.name}</option>
                ))}
              </>
            ) : (
              <>
                <option hidden>{t('chooseAllowedActionTypes')}</option>
                <option disabled>{t('noActionTypes')}</option>
              </>
            )
          ) : (
            <>
              <option hidden>{t('chooseAllowedActionTypes')}</option>
              <option disabled>{t('fileNotChoosenSub')}</option>
            </>
          )}
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-100 d-flex flex-row">
        { fileOrigin !== 'folder' && (
          <>
            <Label for="tool" className="mr-1 my-auto w-25">
              <span>{t('Tool')}: </span>
            </Label>
            <Input
              className="w-50"
              type="select"
              onChange={e => {
                props.setTool(e.target.value);
                InputToolRef.current = e;
                InputOptionRef.current ? document.querySelectorAll('select')[2].value = 'Choose Option' : null;
              }}
              value={activeTool && checkToolAvailability(activeActionTypes, activeTool, tools,
                acceptedActions, config, true) ? activeTool.id.name : 'Choose Tool'}
            >
              <option hidden>{t('ChooseTool')}</option>
              {activeActionTypes && mimeType.length ? (
                checkScriptAvailability(activeActionTypes, tools, acceptedActions, config)
                ?? <option disabled>{t('NoAcceptedTools')}</option>
              ) : (
                <>
                  <option hidden>{t('ChooseTool')}</option>
                  <option disabled>{t('NoActionsAreChosen')}</option>
                </>
              )}
            </Input>
          </>
        )}
      </FormGroup>
      <FormGroup className="mt-3 w-100 d-flex flex-row">
        { fileOrigin !== 'folder'
        && (
        <>
          <Label for="action" className="mr-1 my-auto w-25">
            <span>{t('Action')}: </span>
          </Label>
          <Input
            className="w-50"
            type="select"
            value={activeOption && activeTool && checkToolAvailability(activeActionTypes, activeTool, tools,
              acceptedActions, config, false) ? activeOption.name : 'Choose Option'}
            onChange={e => {
              InputOptionRef.current = e;
              props.setOptions([{
                value: acceptedActions
                  .find(action => action.id.name === e.target.value)?.inputToolArguments.map(i => i.value),
                name: e.target.value,
              }]);
            }}
          >
            <option hidden>{t('ChooseOption')}</option>
            {activeTool && checkToolAvailability(activeActionTypes, activeTool, tools,
              acceptedActions, config, false) ? (
                acceptedActions
                  .filter(a => (a.type.id.guid === activeActionTypes.id.guid && a.tool.id.guid === activeTool.id.guid))
                  .map(avaliableOption => (
                    <option key={avaliableOption.id.guid}>{avaliableOption.id.name}</option>
                  ))
              ) : (
                <>
                  <option hidden>{t('ChooseOption')}</option>
                  <option disabled>{t('NoToolsAreChosen')}</option>
                </>
              )}
          </Input>
        </>
        )}
      </FormGroup>
      <FormGroup className="mt-3 w-100 d-flex flex-row align-items-center">
        <Label for="customFile" className="mr-1 my-auto w-25">
          {t('OutputFolder')}:
        </Label>
        <Input className="dir_path w-50" readOnly placeholder={!dirPath ? config.defaultPath : dirPath} />
        <FolderInput />
      </FormGroup>
      <Button
        color="success"
        value="Execute"
        disabled={
          (fileOrigin === 'file' && !filePath.length)
          || ((fileOrigin === 'url' && !isURL(url))
          || (fileOrigin === 'folder' && !batchPath.length)
          || (fileOrigin === 'folder' && !activeActionTypes)
          || ((!activeTool || !checkToolAvailability(activeActionTypes, activeTool, tools,
            acceptedActions, config, false)) && fileOrigin === 'file')
          || (!activeOption && fileOrigin === 'file'))
        }
        className="mt-3 align-self-center"
        onClick={handleExecute}
      >
        {t('Execute')}
      </Button>
    </div>
  ) : (
    <ProgressBar />
  );
};

const mapStateToProps = state => ({
  actions: state.actions,
  fileFormats: state.fileFormats,
  actionTypes: state.actionTypes,
  url: state.url,
  fileOrigin: state.fileOrigin,
  fileName: state.fileName,
  filePath: state.filePath,
  dirPath: state.dirPath,
  mimeType: state.mimeType,
  acceptedActions: setAcceptedActions(state.actions, state.fileFormats, state.mimeType),
  activeAction: state.actions.filter(e => e.active)[0],
  tools: state.tools,
  activeTool: state.tools.filter(e => e.active)[0],
  activeActionTypes: state.actionTypes.filter(e => e.active)[0],
  options: state.options,
  activeOption: state.options[0],
  config: state.config,
  load: state.load,
  batchPath: state.batchPath,
  recursive: state.recursive,
});

export default connect(mapStateToProps, {
  setTool,
  setOptions,
  setAction,
  setFileOrigin,
  setMimeType,
  setFileInfo,
  setActionType,
  setLoad,
  setDirPath,
})(Main);

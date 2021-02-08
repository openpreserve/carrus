/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Label, Input, Button } from 'reactstrap';
import { ipcRenderer } from 'electron';
import isURL from 'validator/lib/isURL';
import setAcceptedActions from '../../utils/setAcceptedActions';
import checkScriptAvailability from '../../utils/checkScriptAvailability';
import ProgressBar from '../Loading/ProgressBar';
import FileHandler from './FileHandler';
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
} from '../../Redux/redux-reducers';
import FolderInput from './FolderInput';

const hashCode = s => s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);

const Main = props => {
  const {
    fileOrigin,
    filePath,
    dirPath,
    actionTypes,
    actions,
    options,
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
  } = props;
  const { t } = useTranslation();

  const InputToolRef = useRef();
  const InputOptionRef = useRef();
  const [error, setError] = useState('');
  const handleExecute = () => {
    props.setLoad(true);
    const dataToSend = {
      fileName,
      mimeType,
      fileOrigin,
      path: fileOrigin === 'url' ? url : filePath,
      actionType: activeActionTypes,
      action: activeAction,
      outputFolder: dirPath,
      tool: activeTool,
      option: activeOption,
    };
    ipcRenderer.send('execute-file-action', dataToSend);
    ipcRenderer.on('receive-load', (event, value) => {
      props.setLoad(value);
    });
  };
  /* useEffect(() => console.log(props), [props]); */

  useEffect(() => {
    if (isURL(url)) {
      ipcRenderer.send('check-mime-type', url);
      ipcRenderer.on('receive-mime-type', (event, arg) => {
        if (arg !== null) props.setFileInfo(url.substring(url.lastIndexOf('/') + 1), '', arg.mime);
        else {
          props.setFileInfo('', '', '');
          setError(t('fileTypesUnavailable'));
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
          <FileHandler />
        </TabPane>
        <TabPane tabId="url">
          <UrlHandler isValid={!error.length} isEmpty={!url.length} feedback={error} />
        </TabPane>
      </TabContent>
      <FormGroup className="mt-3 w-50 d-flex flex-row">
        <Label for="action" className="mr-1 my-auto w-25">
          <span>{t('ActionType')}:</span>
        </Label>
        <Input
          type="select"
          onChange={e => {
            props.setActionType(e.target.value);
            InputToolRef.current ? InputToolRef.current.target.value = '' : null;
            InputOptionRef.current ? InputOptionRef.current.target.value = '' : null;
          }}
          defaultValue={activeActionTypes ? activeActionTypes.id.name : ''}
        >
          {mimeType.length ? (
            acceptedActions.length ? (
              <>
                <option hidden>Choose allowed action types</option>
                {unique(acceptedActions).map(e => (
                  <option key={hashCode(e.id.guid + mimeType)}>{e.type.id.name}</option>
                ))}
              </>
            ) : (
              <>
                <option hidden>{t('inappropriateType')} </option>
                <option disabled>{t('noActionTypes')}</option>
              </>
            )
          ) : (
            <>
              <option hidden>{t('fileNotChoosen')}</option>
              <option disabled>{t('fileNotChoosenSub')}</option>
            </>
          )}
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-50 d-flex flex-row">
        <Label for="tool" className="mr-1 my-auto w-25">
          <span>{t('Tool')}: </span>
        </Label>
        <Input
          /* ref={InputToolRef} */
          type="select"
          onChange={e => {
            props.setTool(e.target.value);
            InputToolRef.current = e;
            InputOptionRef.current ? InputOptionRef.current.target.value = '' : null;
          }}
          defaultValue={activeTool ? activeTool.id.name : ''}
        >
          <option hidden>Choose Tool</option>
          {activeActionTypes && mimeType.length ? (
            checkScriptAvailability(activeActionTypes, tools, acceptedActions, config.isDevelopment)
          ) : (
            <>
              <option disabled>No actions are chosen</option>
            </>
          )}
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-50 d-flex flex-row">
        <Label for="action" className="mr-1 my-auto w-25">
          <span>{t('Action')}: </span>
        </Label>
        <Input
          type="select"
          defaultValue={activeOption ? activeOption.name : ''}
          onChange={e => {
            if (e.target.value === 'default') {
              InputOptionRef.current = e;
              props.setOptions([{
                value: [],
              }]);
            } else {
              props.setOptions([{
                value: acceptedActions
                  .find(action => action.id.name === e.target.value).inputToolArguments.map(i => i.value),
                name: e.target.value,
              }]);
            }
          }}
        >
          <option hidden>Choose Option</option>
          <option>default</option>
          {activeTool ? (
            activeTool.toolAcceptedParameters
              .filter(param => acceptedActions.find(action => action.id.guid === param.id.guid))
              .map(activeToolOption => (
                <option key={activeToolOption.id.guid}>{activeToolOption.id.name}</option>
              ))
          ) : (
            <>
              <option disabled>No Tools are chosen</option>
            </>
          )}
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-100 d-flex flex-row align-items-center">
        <div className="w-50 d-flex flex-row align-items-center">
          <Label for="customFile" className="mr-1 my-auto w-25">
            {t('OutputFolder')}:
          </Label>
          <Input className="dir_path" readOnly placeholder={dirPath} />
        </div>
        <FolderInput />
      </FormGroup>
      <Button
        color="success"
        value="Execute"
        disabled={
          (fileOrigin === 'file' && !filePath.length)
          || (fileOrigin === 'url' && !isURL(url))
          || !dirPath.length
          || !activeTool
          || !activeOption
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
})(Main);

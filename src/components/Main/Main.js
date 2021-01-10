/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Label, Input, Button } from 'reactstrap';
import { ipcRenderer } from 'electron';
import isURL from 'validator/lib/isURL';
import setAcceptedActions from '../../utils/setAcceptedActions';
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
} from '../../Redux/redux-reducers';
import FolderInput from './FolderInput';

const hashCode = s => s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);

const Main = props => {
  const {
    fileOrigin,
    filePath,
    dirPath,
    options,
    mimeType,
    acceptedActions,
    activeAction,
    tools,
    activeTool,
    activeOption,
    url,
    fileName,
    fileFormats,
  } = props;
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const handleExecute = () => {
    setIsLoading(true);
    const dataToSend = {
      fileName,
      mimeType,
      fileOrigin,
      path: fileOrigin === 'url' ? url : filePath,
      action: activeAction,
      outputFolder: dirPath,
      tool: activeTool,
      option: activeOption,
    };
    ipcRenderer.send('execute-file-action', dataToSend);
    setIsLoading(false);
  };

  useEffect(() => console.log(props), [props]);

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

    console.log(mimeType);
  }, [url]);

  return !isLoading ? (
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
          <span>{t('Action')}:</span>
        </Label>
        <Input
          type="select"
          onChange={e => props.setAction(e.target.value)}
          defaultValue={activeAction ? activeAction.preservationActionName : ''}
        >
          {mimeType.length ? (
            acceptedActions.length ? (
              <>
                <option hidden>Choose allowed action</option>
                {acceptedActions.map(e => (
                  <option key={hashCode(e.id.guid + mimeType)}>{e.id.name}</option>
                ))}
              </>
            ) : (
              <>
                <option hidden>{t('inappropriateType')} </option>
                <option disabled>{t('noActions')}</option>
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
          type="select"
          onChange={e => {
            props.setTool(e.target.value);
          }}
          defaultValue="Choose tool"
        >
          <option hidden>Choose Tool</option>
          {activeAction ? (
            tools
              .filter(e => activeAction.tool.map(activeActionTool => activeActionTool.id.guid).includes(e.id.guid))
              .map(e => <option key={hashCode(e.id.guid + mimeType)}>{e.id.name}</option>)
          ) : (
            <>
              <option disabled>No actions are chosen</option>
            </>
          )}
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-50 d-flex flex-row">
        <Label for="action" className="mr-1 my-auto w-25">
          <span>{t('Options')}: </span>
        </Label>
        <Input
          type="select"
          onChange={e => {
            props.setOptions(
              props?.activeTool?.toolAcceptedParameters.filter(item => item.value === e.target.value),
            );
          }}
          default="Choose Option"
        >
          <option hidden>Choose Option</option>
          {activeTool ? (
            activeTool.toolAcceptedParameters.map(activeToolOption => (
              <option key={hashCode(activeToolOption.value + mimeType)}>{activeToolOption.value}</option>
            ))
          ) : (
            <>
              <option disabled>No Tools are chosen</option>
            </>
          )}
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-100 d-flex flex-row align-center">
        <div className="w-50 d-flex flex-row">
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
  url: state.url,
  fileOrigin: state.fileOrigin,
  fileName: state.fileName,
  filePath: state.filePath,
  dirPath: state.dirPath,
  mimeType: state.mimeType,
  // acceptedActions: state.actions.filter(e => e.inputExtension.accept.includes(state.mimeType)),
  acceptedActions: setAcceptedActions(state.actions, state.fileFormats, state.mimeType),
  activeAction: state.actions.filter(e => e.active)[0],
  tools: state.tools,
  activeTool: state.tools.filter(e => e.active)[0],
  options: state.options,
  // activeOption: state.options.filter(e => e.active)[0],
  activeOption: state.options[0],
});

export default connect(mapStateToProps, {
  setTool,
  setOptions,
  setAction,
  setFileOrigin,
  setMimeType,
  setFileInfo,
})(Main);

/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-else-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/destructuring-assignment */
import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Label, Input, Button } from 'reactstrap';
import { ipcRenderer } from 'electron';
import ProgressBar from '../Loading/ProgressBar';
import FileHandler from './FileHandler';
import UrlHandler from './UrlHandler';
import SemiHeader from '../Header/SemiHeader';
import { setTool, setOptions, setAction, setOutputFolder, setFileOrigin } from '../../Redux/redux-reducers';
import FolderInput from './FolderInput';

const Main = props => {
  const { fileOrigin, filePath, actions, dirPath, tool } = props;
  const activeAction = actions.filter(e => e.active)[0];
  const { t } = useTranslation();
  const directoryRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const handleExecute = () => {
    setIsLoading(true);
    const dataToSend = {
      filePath,
      action: activeAction,
      toolId: activeAction.tool.filter(e => e.toolName === tool)[0].toolID,
      outputFolder: dirPath,
    };
    ipcRenderer.send('create_new_window', dataToSend);
    setIsLoading(false);
  };

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
          <UrlHandler />
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
          <option hidden>Choose allowed action</option>
          {actions && actions.map((e, i) => <option key={i + 1 * 2}>{e.preservationActionName}</option>)}
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-50 d-flex flex-row">
        <Label for="tool" className="mr-1 my-auto w-25">
          <span>{t('Tool')}: </span>
        </Label>
        <Input type="select" onChange={e => props.setTool(e.target.value)} defaultValue={tool}>
          {activeAction ? (
            activeAction.tool.map((e, i) => <option key={i}>{e.toolName}</option>)
          ) : (
            <>
              <option hidden>Choose Tool</option>
              <option disabled>No actions are chosen</option>
            </>
          )}
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-50 d-flex flex-row">
        <Label for="action" className="mr-1 my-auto w-25">
          <span>{t('Options')}: </span>
        </Label>
        <Input type="select" onChange={e => props.setOptions(e.target.value)}>
          <option hidden>Choose Option</option>
          <option>PDF/A-1</option>
          <option>PDF/A-2</option>
          <option>PDF/A-3</option>
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-100 d-flex flex-row align-center">
        <div className="w-50 d-flex flex-row">
          <Label for="customFile" className="mr-1 my-auto w-25">
            {t('OutputFolder')}:
          </Label>
          <Input className="dir_path" readOnly placeholder={props.dirPath} />
        </div>
        <FolderInput />
      </FormGroup>
      <Button
        color="success"
        value="Execute"
        disabled={!filePath.length || !dirPath.length || !tool.length}
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
  outputFolder: state.outputFolder,
  url: state.url,
  fileOrigin: state.fileOrigin,
  fileName: state.fileName,
  filePath: state.filePath,
  dirPath: state.dirPath,
  tool: state.tool,
});

export default connect(mapStateToProps, {
  setTool,
  setOptions,
  setAction,
  setOutputFolder,
  setFileOrigin,
})(Main);

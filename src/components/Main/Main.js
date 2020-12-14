/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
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
import React, { useState } from 'react';
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
  } = props;
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const handleExecute = () => {
    setIsLoading(true);
    const dataToSend = {
      filePath,
      action: activeAction,
      outputFolder: dirPath,
      tool: activeTool,
      option: activeOption,
    };
    ipcRenderer.send('execute-file-action', dataToSend);
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
          {mimeType.length ? (
            acceptedActions.length ? (
              <>
                <option hidden>Choose allowed action</option>
                {acceptedActions.map((e, i) => (
                  <option key={hashCode(e.preservationActionName[0] + mimeType)}>
                    {e.preservationActionName}
                  </option>
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
        <Input type="select" onChange={e => props.setTool(e.target.value)} defaultValue="Choose tool">
          <option hidden>Choose Tool</option>
          {activeAction ? (
            tools
              .filter(e => activeAction.tool.map(activeActionTool => activeActionTool.toolID).includes(e.id))
              .map((e, i) => <option key={hashCode(e.toolName)}>{e.toolName}</option>)
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
        <Input type="select" onChange={e => props.setOptions(e.target.value)} default="Choose Option">
          <option hidden>Choose Option</option>
          {activeTool ? (
            options
              .filter(e =>
                activeTool.options.map(activeToolOption => activeToolOption.optionId).includes(e.optionId),
              )
              .map((e, i) => (
                <option key={hashCode(e.optionName + activeTool.toolName)}>{e.optionName}</option>
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
          <Input className="dir_path" readOnly placeholder={props.dirPath} />
        </div>
        <FolderInput />
      </FormGroup>
      <Button
        color="success"
        value="Execute"
        disabled={!filePath.length || !dirPath.length || !activeTool || !activeOption}
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
  mimeType: state.mimeType,
  acceptedActions: state.actions.filter(e => e.inputExtension.accept.includes(state.mimeType)),
  activeAction: state.actions.filter(e => e.active)[0],
  tools: state.tools,
  activeTool: state.tools.filter(e => e.active)[0],
  options: state.options,
  activeOption: state.options.filter(e => e.active)[0],
});

export default connect(mapStateToProps, {
  setTool,
  setOptions,
  setAction,
  setOutputFolder,
  setFileOrigin,
})(Main);

/* eslint-disable no-console */
import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  FormGroup,
  Label,
  Input,
  Button,
  CustomInput,
} from 'reactstrap';
import FileHandler from './FileHandler';
import UrlHandler from './UrlHandler';
import SemiHeader from '../Header/SemiHeader';
import { setTool, setOptions, setAction, setOutputFolder, setFileOrigin } from '../Redux/redux-reducers';

const Main = props => {
  const { fileOrigin } = props;
  const { t } = useTranslation();
  const handleExecute = () => {
    console.log(props);
  };
  return (
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
        <Label for="action" className="mr-3 my-auto w-25">
          <span>{t('Action')}:</span>
        </Label>
        <Input type="select" onChange={e => props.setAction(e.target.value)}>
          <option>{t('Validate')}</option>
          <option>{t('Characterize')}</option>
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-50 d-flex flex-row">
        <Label for="tool" className="mr-3 my-auto w-25">
          <span>{t('Tool')}: </span>
        </Label>
        <Input type="select" onChange={e => props.setTool(e.target.value)}>
          <option>veraPDF</option>
          <option>PDF hul</option>
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-50 d-flex flex-row">
        <Label for="action" className="mr-3 my-auto w-25">
          <span>{t('Options')}: </span>
        </Label>
        <Input type="select" onChange={e => props.setOptions(e.target.value)}>
          <option>PDF/A-1</option>
          <option>PDF/A-2</option>
          <option>PDF/A-3</option>
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-50 d-flex flex-row">
        <Label for="customFile" className="mr-3 my-auto w-25">
          {t('OutputFolder')}:
        </Label>
        <CustomInput
          directory=""
          webkitdirectory=""
          type="file"
          id="customFolderInput"
          onChange={e => props.setOutputFolder(e.target.value)}
        />
        {/* <input directory="" webkitdirectory="" type="file" /> */}
      </FormGroup>
      <Button color="success" value="Execute" className="mt-3 align-self-center" onClick={handleExecute}>
        {t('Execute')}
      </Button>
    </div>
  );
};

const mapStateToProps = state => ({
  tool: state.tool,
  action: state.action,
  options: state.options,
  outputFolder: state.outputFolder,
  url: state.url,
  fileOrigin: state.fileOrigin,
});

export default connect(mapStateToProps, {
  setTool,
  setOptions,
  setAction,
  setOutputFolder,
  setFileOrigin,
})(Main);

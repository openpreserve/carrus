/* eslint-disable no-console */
import React from 'react';
import { connect } from 'react-redux';
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
import SemiHeader from './SemiHeader';
import {
  setTool,
  setOptions,
  setAction,
  setOutputFolder,
  setFileOrigin,
} from '../Redux/redux-reducers';

const Body = props => {
  const { fileOrigin } = props;
  console.log(props);
  return (
    <div className="container d-flex flex-column mt-5">
      <SemiHeader />
      <Nav tabs className="mt-5">
        <NavItem className="mr-1">
          <NavLink
            className={
              fileOrigin === 'file' ? 'active text-success font-weight-bold' : 'bg-light text-dark'
            }
            onClick={() => props.setFileOrigin('file')}
          >
            Your File
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={
              fileOrigin === 'url' ? 'active text-success font-weight-bold' : 'bg-light text-dark '
            }
            onClick={() => props.setFileOrigin('url')}
          >
            From URL
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
        <Label for="action" className="text-right mr-3 w-25">
          <span>Action: </span>
        </Label>
        <Input type="select" className="w-75" onChange={e => props.setAction(e.target.value)}>
          <option>Validate</option>
          <option>Characterize</option>
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-50 d-flex flex-row">
        <Label for="tool" className="text-right mr-3 w-25">
          <span>Tool: </span>
        </Label>
        <Input type="select" className="w-75" onChange={e => props.setTool(e.target.value)}>
          <option>veraPDF</option>
          <option>PDF hul</option>
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-50 d-flex flex-row">
        <Label for="action" className="text-right mr-3 w-25">
          <span>Options: </span>
        </Label>
        <Input type="select" className="w-75" onChange={e => props.setOptions(e.target.value)}>
          <option>PDF/A-1</option>
          <option>PDF/A-2</option>
          <option>PDF/A-3</option>
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-50 d-flex flex-row">
        <Label for="customFile" className="text-right mr-3 w-25">
          Output Folder:
        </Label>
        <CustomInput
          type="file"
          label="📁 Browse File"
          id="customFileInput"
          onChange={e => props.setOutputFolder(e.target.value)}
        />
      </FormGroup>
      <Button color="success" value="Execute" className="mt-3 align-self-center">
        Execute
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
})(Body);

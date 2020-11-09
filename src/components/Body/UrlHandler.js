import React from 'react';
import { FormGroup, Label, Input, CustomInput } from 'reactstrap';

const UrlHandler = () => (
  <div className="mt-3">
    <FormGroup className="mt-3 w-50 d-flex flex-row">
      <Label for="action" style={{ width: '25%' }} className="text-right mr-3">
        <span>URL: </span>
      </Label>
      <Input type="text" name="action" id="action" className="w-75" />
    </FormGroup>
    <FormGroup className="mt-3 w-50 d-flex flex-row">
      <Label for="action" style={{ width: '25%' }} className="text-right mr-3">
        <span>Action: </span>
      </Label>
      <Input type="select" name="action" id="action" className="w-75">
        <option>Validate</option>
        <option>Characterize</option>
      </Input>
    </FormGroup>
    <FormGroup className="mt-3 w-50 d-flex flex-row">
      <Label for="tool" style={{ width: '25%' }} className="text-right mr-3">
        <span>Tool: </span>
      </Label>
      <Input type="select" name="tool" id="tool" className="w-75">
        <option>veraPDF</option>
        <option>PDF hul</option>
      </Input>
    </FormGroup>
    <FormGroup className="mt-3 w-50 d-flex flex-row">
      <Label for="action" style={{ width: '25%' }} className="text-right mr-3">
        <span>Options: </span>
      </Label>
      <Input type="select" name="action" id="action" className="w-75">
        <option>PDF/A-1</option>
        <option>PDF/A-2</option>
        <option>PDF/A-3</option>
      </Input>
    </FormGroup>
    <FormGroup className="mt-3 w-50 d-flex flex-row">
      <Label for="customFile" style={{ width: '33%' }} className="text-right mr-3">
        Output Folder:
      </Label>
      <CustomInput
        type="file"
        id="exampleCustomFileBrowser"
        name="customFile"
        label="📁 Browse File"
      />
    </FormGroup>
  </div>
);

export default UrlHandler;

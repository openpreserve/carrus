/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import { FormGroup, Label, Input } from 'reactstrap';

const FileHandler = () => {
  const handleClick = event => {
    // console.log(event.target.value);
  };
  return (
    <div className="mt-3">
      <div>
        <DropzoneArea className="h-50" style={{ minHeight: 100 }} component="div" />
      </div>
      <FormGroup className="mt-3 w-50 d-flex flex-row">
        <Label for="action" style={{ width: '20%' }} className="text-right mr-3">
          <span>Action: </span>
        </Label>
        <Input
          type="select"
          name="action"
          id="action"
          className="w-75"
          onChange={e => handleClick(e)}
        >
          <option>Validate</option>
          <option>Characterize</option>
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-50 d-flex flex-row">
        <Label for="tool" style={{ width: '20%' }} className="text-right mr-3">
          <span>Tool: </span>
        </Label>
        <Input type="select" name="tool" id="tool" className="w-75">
          <option>veraPDF</option>
          <option>PDF hul</option>
        </Input>
      </FormGroup>
      <FormGroup className="mt-3 w-50 d-flex flex-row">
        <Label for="action" style={{ width: '20%' }} className="text-right mr-3">
          <span>Options: </span>
        </Label>
        <Input type="select" name="action" id="action" className="w-75">
          <option>PDF/A-1</option>
          <option>PDF/A-2</option>
          <option>PDF/A-3</option>
        </Input>
      </FormGroup>
    </div>
  );
};
export default FileHandler;

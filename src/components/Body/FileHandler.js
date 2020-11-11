import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';

const FileHandler = () => (
  <div className="mt-3 d-flex flex-column">
    <DropzoneArea className="h-50" component="div" />
  </div>
);

export default FileHandler;

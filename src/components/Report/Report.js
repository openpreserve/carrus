/* eslint-disable no-console */
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { Jumbotron, Container } from 'reactstrap';
import WarningIcon from '@material-ui/icons/Warning';

const Report = () => {
  const [fileName, setFileName] = useState('');
  ipcRenderer.on('receiver', (event, arg) => {
    console.log('here');
    setFileName(arg);
  });
  return (
    <div>
      <Jumbotron fluid className="bg-white">
        <Container fluid className="d-flex flex-column align-items-center">
          <h1 className="display-3">
            <WarningIcon style={{ fontSize: 100 }} color="secondary" />
          </h1>
          <p className="lead">{fileName}</p>
        </Container>
      </Jumbotron>
    </div>
  );
};

export default Report;

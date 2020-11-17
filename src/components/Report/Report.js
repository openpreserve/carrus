import React from 'react';
import { ipcRenderer } from 'electron';
import { Jumbotron, Container } from 'reactstrap';
import WarningIcon from '@material-ui/icons/Warning';

const Report = () => {
  let fileName = '';
  ipcRenderer.on('receive_file_info', (event, arg) => {
    console.log('here');
    fileName = arg;
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

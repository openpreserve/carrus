/* eslint-disable no-console */
import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { Jumbotron, Container } from 'reactstrap';
import WarningIcon from '@material-ui/icons/Warning';
import CancelIcon from '@material-ui/icons/Cancel';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import { orange } from '@material-ui/core/colors';

const Report = () => {
  const [fileName, setFileName] = useState('');
  ipcRenderer.on('receiver', (event, arg) => {
    setFileName(arg);
  });
  return (
    <div>
      <Jumbotron fluid className="bg-white pt-0 pb-0 m-0">
        <Container fluid className="d-flex flex-column align-items-center">
          <h1 className="display-3">
            <WarningIcon style={{ fontSize: 100 }} color="secondary" />
          </h1>
          <p className="lead m-0">{fileName}</p>
          <p>
            <span>Validation completed</span>
          </p>
          <Container className="w-75">
            <Jumbotron className="p-4 bg-light align-self-center">
              <p className="lead">
                <p>The pdf you submitted has the following results:</p>
              </p>
              <div className="d-flex flex-row mb-3">
                <CancelIcon color="secondary" />
                <span className="ml-2">4 errors</span>
              </div>{' '}
              <div className="d-flex flex-row mb-4">
                <ReportProblemIcon color="secondary" style={{ color: orange[500] }} />
                <span className="ml-2">2 warnings</span>
              </div>
            </Jumbotron>
          </Container>
          <Container>
            <Jumbotron className="p-4 bg-light align-self-center m-0">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc hendrerit sodales justo aliquam
                sodales. Curabitur ex arcu, malesuada ut hendrerit ut, euismod vitae enim. Nam consectetur
                tristique odio quis rutrum. In tincidunt justo turpis, eget tincidunt erat vehicula sed. Nam
                ante dolor, auctor sit amet aliquam a, volutpat sed est. Suspendisse luctus malesuada velit,
                vitae semper lacus pretium ut. Morbi auctor dui at felis eleifend, non viverra nibh aliquam.
                Mauris ut vestibulum tortor. Nunc tristique nunc ac tellus convallis, vel semper nulla
                dapibus. Nullam at condimentum enim, in pretium justo. Phasellus eget massa eu dui tempor
                ultrices.
              </p>
            </Jumbotron>
          </Container>
        </Container>
      </Jumbotron>
    </div>
  );
};

export default Report;

/* eslint-disable no-console */
import React, { useState } from 'react';
import { ipcRenderer, shell } from 'electron';
import { Jumbotron, Container } from 'reactstrap';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import GetAppIcon from '@material-ui/icons/GetApp';
import * as clipboard from 'clipboard-polyfill/text';
// import WarningIcon from '@material-ui/icons/Warning';
// import CancelIcon from '@material-ui/icons/Cancel';
// import ReportProblemIcon from '@material-ui/icons/ReportProblem';
// import { orange } from '@material-ui/core/colors';

const Report = () => {
  const [report, setReport] = useState('');
  const [path, setPath] = useState('');
  ipcRenderer.on('receiver', (event, arg) => {
    setReport(arg.report);
    setPath(arg.path);
  });

  return (
    <div>
      <Jumbotron fluid className="bg-white pt-0 pb-0 m-0">
        <Container fluid className="d-flex flex-column align-items-center">
          {/* <h1 className="display-3">
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
          </Container> */}
          <Container>
            <Jumbotron className="p-4 bg-light align-self-center m-0 d-flex flex-row">
              <p>{report}</p>
              {report && path && (
                <div className="d-flex flex-row justify-content-center">
                  <FileCopyIcon onClick={() => clipboard.writeText(report)} />
                </div>
              )}
              <GetAppIcon onClick={() => shell.openItem(path)} />
            </Jumbotron>
          </Container>
        </Container>
      </Jumbotron>
    </div>
  );
};

export default Report;

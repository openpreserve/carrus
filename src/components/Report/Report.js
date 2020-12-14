import React, { useState } from 'react';
import { ipcRenderer, shell } from 'electron';
import { Jumbotron, Container } from 'reactstrap';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import * as clipboard from 'clipboard-polyfill/text';
/* eslint-disable no-console */
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
          <Container>
            <Jumbotron className="p-4 bg-light align-self-center m-0 d-flex flex-row">
              <p>{report}</p>
              {report && path && (
                <div className="d-flex flex-row ml-2 justify-content-center">
                  <FileCopyIcon onClick={() => clipboard.writeText(report)} />
                </div>
              )}
              <FolderOpenIcon onClick={() => shell.openItem(path)} />
            </Jumbotron>
          </Container>
        </Container>
      </Jumbotron>
    </div>
  );
};

export default Report;

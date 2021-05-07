import React, { useState } from 'react';
import { ipcRenderer, shell } from 'electron';
import { connect } from 'react-redux';
import * as os from 'os';
import { Jumbotron, Container } from 'reactstrap';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import * as clipboard from 'clipboard-polyfill/text';
import showItemInFolder from '../../utils/linuxShowItem';
import {
  setLoad,
} from '../../Redux/redux-reducers';

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
            {report && path && (
              <div className="d-flex flex-row mb-3 justify-content-end w-100">
                <FileCopyIcon onClick={() => clipboard.writeText(report)} className="cursor-pointer" />
                <FolderOpenIcon
                  onClick={() => {
                    if (os.platform() === 'linux') {
                      showItemInFolder(path);
                    } else shell.showItemInFolder(path);
                  }}
                  className="cursor-pointer"
                />
              </div>
            )}
            <Jumbotron className="p-4 bg-light align-self-center m-0 d-flex flex-row">
              <pre className="w-100 text-left">{report}</pre>
            </Jumbotron>
          </Container>
        </Container>
      </Jumbotron>
    </div>
  );
};

const mapStateToProps = state => ({
  load: state.load,
});

export default connect(mapStateToProps, {
  setLoad,
})(Report);

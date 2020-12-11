/* eslint-disable no-console */
/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Dropzone from 'react-dropzone';
import { Jumbotron, Container } from 'reactstrap';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import { green } from '@material-ui/core/colors';
import { setFileInfo } from '../../Redux/redux-reducers';

const FileHandler = props => {
  const { t } = useTranslation();
  const { fileName } = props;
  return (
    <div className="mt-3">
      <Dropzone
        onDrop={e => {
          props.setFileInfo(e[0].name, e[0].path, e[0].type);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <section className="border bg-light dropzone-selection">
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Jumbotron fluid className="m-0 p-3 bg-light">
                <Container fluid className="d-flex flex-column align-items-center">
                  <MoveToInboxIcon className="text-green" style={{ fontSize: 80, color: green[500] }} />
                  {fileName === '' ? (
                    <div>
                      <p className="lead">{t('DropzoneTitle')}</p>
                      <p className="text-muted">{t('DropzoneSubtitle')}</p>
                    </div>
                  ) : (
                    <p>{fileName}</p>
                  )}
                </Container>
              </Jumbotron>
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
};

const mapStateToProps = state => ({
  fileName: state.fileName,
});

export default connect(mapStateToProps, { setFileInfo })(FileHandler);

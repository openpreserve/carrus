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
import { uploadFile } from '../Redux/redux-reducers';

const hashCode = str => {
  let hash = 0;
  let i = 0;
  const len = str.length;
  while (i < len) {
    hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
  }
  return hash;
};
const FileHandler = props => {
  const { t } = useTranslation();
  const { files } = props;
  return (
    <div className="mt-3">
      <Dropzone onDrop={e => props.uploadFile(e[0].name)}>
        {({ getRootProps, getInputProps }) => (
          <section className="border bg-light dropzone-selection">
            <div {...getRootProps()}>
              <input {...getInputProps()} accept="application/pdf,image/*" />
              <Jumbotron fluid className="m-0 p-3 bg-light">
                <Container fluid className="d-flex flex-column align-items-center">
                  <MoveToInboxIcon className="text-green" style={{ fontSize: 80, color: green[500] }} />
                  <p className="lead">{t('DropzoneTitle')}</p>
                  <p className="text-muted">{t('DropzoneSubtitle')}</p>
                  {files.map(e => (
                    <p key={hashCode(e)}>{e}</p>
                  ))}
                </Container>
              </Jumbotron>
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
};

const mapStateToProps = state => ({ files: state.uploadedFiles });

export default connect(mapStateToProps, { uploadFile })(FileHandler);

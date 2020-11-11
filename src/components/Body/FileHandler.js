/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useTranslation } from 'react-i18next';
import Dropzone from 'react-dropzone';
import { Jumbotron, Container } from 'reactstrap';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import { green } from '@material-ui/core/colors';

const FileHandler = () => {
  const { t } = useTranslation();
  return (
    <div className="mt-3">
      <Dropzone onDrop={file => console.log(file)}>
        {({ getRootProps, getInputProps }) => (
          <section className="border bg-light">
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <Jumbotron fluid className="m-0 p-3 bg-light">
                <Container fluid className="d-flex flex-column align-items-center">
                  <MoveToInboxIcon className="text-green" style={{ fontSize: 80, color: green[500] }} />
                  <p className="lead">{t('DropzoneTitle')}</p>
                  <p className="text-muted">{t('DropzoneSubtitle')}</p>
                </Container>
              </Jumbotron>
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
};

export default FileHandler;

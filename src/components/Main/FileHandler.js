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
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import { setFileInfo } from '../../Redux/redux-reducers';

const FileHandler = props => {
  const { t } = useTranslation();
  const { fileName, mimeType, isTypeAccepted } = props;
  console.log(isTypeAccepted);
  return (
    <div className="mt-3">
      <Dropzone
        onDrop={e => {
          props.setFileInfo(e[0].name, e[0].path, e[0].type);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <section
            className={
              isTypeAccepted && fileName.length
                ? 'border border-danger bg-light dropzone-selection'
                : 'border bg-light dropzone-selection'
            }
          >
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
                    <div className="d-flex flex-row">
                      {mimeType.includes('pdf') && <PictureAsPdfIcon />}
                      {mimeType.includes('image') && <ImageOutlinedIcon />}
                      <span className="ml-1">{fileName}</span>
                    </div>
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
  mimeType: state.mimeType,
  isTypeAccepted: !state.actions.filter(e => e.inputExtension.accept.includes(state.mimeType)).length,
});

export default connect(mapStateToProps, { setFileInfo })(FileHandler);

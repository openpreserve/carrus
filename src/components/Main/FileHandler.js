import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Dropzone from 'react-dropzone';
import { Jumbotron, Container } from 'reactstrap';
import FileType from 'file-type';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import { green } from '@material-ui/core/colors';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import { setFileInfo } from '../../Redux/redux-reducers';
import setAcceptedType from '../../utils/setAcceptedType';

const FileHandler = props => {
  const { t } = useTranslation();
  const { fileName, mimeType, isTypeAccepted } = props;
  const [error, setError] = useState('');
  return (
    <div className="mt-3">
      <Dropzone
        onDrop={e => {
          FileType.fromFile(e[0].path).then(MT => {
            try {
              if (MT) props.setFileInfo(e[0].name, e[0].path, MT.mime);
              else throw new Error(t('fileTypesUnavailable'));
              setError('');
            } catch (err) {
              props.setFileInfo('', '', '');
              setError(err.message);
            }
          });
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
                <Container fluid className="d-flex flex-column align-items-center" style={{ height: 166 }}>
                  <MoveToInboxIcon className="text-green" style={{ fontSize: 80, color: green[500] }} />
                  {!fileName.length ? (
                    error.length ? (
                      <div style={{ color: 'red' }}>{error}</div>
                    ) : (
                      <div>
                        <p className="lead">{t('DropzoneTitle')}</p>
                        <p className="text-muted">{t('DropzoneSubtitle')}</p>
                      </div>
                    )
                  ) : (
                    <div className="d-flex flex-row mt-3 align-items-center">
                      {mimeType.includes('pdf') && <PictureAsPdfIcon />}
                      {mimeType.includes('image') && <ImageOutlinedIcon />}
                      <span className="ml-1" style={{ fontSize: 20 }}>
                        {fileName}
                      </span>
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
  fileFormats: state.fileFormats,
  actions: state.actions,
  isTypeAccepted: !setAcceptedType(state.actions, state.mimeType, state.fileFormats),
});
// isTypeAccepted: !state.actions.filter(e => e.inputExtension.accept.includes(state.mimeType)).length,
export default connect(mapStateToProps, { setFileInfo })(FileHandler);

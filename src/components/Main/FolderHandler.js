/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { connect, useRef } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Dropzone from 'react-dropzone';
import { Jumbotron, Container } from 'reactstrap';
import mime from 'mime-types';
import FileType from 'file-type';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import { green } from '@material-ui/core/colors';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import {
  setFileInfo,
} from '../../Redux/redux-reducers';
import setAcceptedType from '../../utils/setAcceptedType';

const FolderHandler = props => {
  const { t } = useTranslation();
  const { fileName, mimeType, isTypeAccepted } = props;
  const [error, setError] = useState('');
  // const directoryRef = useRef();

  //   function getfolder() {
  //     props.setDirPath(directoryRef.current.files[0].path);
  //   }

  return (
    <div className="mt-3">
      <label className="custom-file-upload ml-3">
        <input
          className="ml-3"
          directory=""
          webkitdirectory=""
          type="file"
        />
        {t('SelectFolder')}
      </label>
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
export default connect(mapStateToProps, {
  setFileInfo,
})(FolderHandler);

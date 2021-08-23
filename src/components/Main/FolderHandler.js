/* eslint-disable import/no-duplicates */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Dropzone from 'react-dropzone';
import { Jumbotron, Container } from 'reactstrap';
import mime from 'mime-types';
import FileType from 'file-type';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import { green } from '@material-ui/core/colors';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import { Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Label, Input, Button } from 'reactstrap';
import {
  setFileInfo,
} from '../../Redux/redux-reducers';
import setAcceptedType from '../../utils/setAcceptedType';

const FolderHandler = props => {
  const batchDirRef = useRef();
  const { t } = useTranslation();
  const { fileName, mimeType, isTypeAccepted } = props;
  const [error, setError] = useState('');
  const [batchDir, setBatchDir] = useState('');

  function getFolder() {
    setBatchDir(batchDirRef.current.files[0].path);
  }
  function checkboxHandleChange(e) {
    console.log(e.target.checked);
  }

  return (
    <div className="mt-3">
      <FormGroup className="mt-3 w-100 d-flex flex-row align-items-center">
        <Label for="customFile" className="mr-1 my-auto w-25">
          {t('OutputFolder')}:
        </Label>
        <Input className="dir_path w-50" readOnly placeholder={batchDir} />
        <div className="w-25 d-flex flex-row">
          <label className="custom-file-upload ml-3">
            <input
              className="ml-3"
              directory=""
              webkitdirectory=""
              type="file"
              ref={batchDirRef}
              onChange={getFolder}
            />
            {t('SelectFolder')}
          </label>
        </div>
      </FormGroup>
      <label>
        <input type="checkbox" onChange={checkboxHandleChange} />
        Recursive
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

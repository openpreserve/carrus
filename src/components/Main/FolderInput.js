/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as path from 'path';
import { setDirPath } from '../../Redux/redux-reducers';

const FolderInput = props => {
  const { t } = useTranslation();

  return (
    <div className="w-50 d-flex flex-row">
      <label className="custom-file-upload ml-3">
        <input
          directory=""
          webkitdirectory=""
          multiple=""
          type="file"
          onChange={e => {
            console.log(e.target.files);
            if (e.target.files.length) props.setDirPath(path.dirname(e.target.files[0].path));
          }}
        />
        {t('SelectFolder')}
      </label>
    </div>
  );
};

const mapStateToProps = state => ({
  tool: state.tool,
  action: state.action,
  options: state.options,
  outputFolder: state.outputFolder,
  url: state.url,
  fileOrigin: state.fileOrigin,
  fileName: state.fileName,
  filePath: state.filePath,
  dirPath: state.dirPath,
});

export default connect(mapStateToProps, { setDirPath })(FolderInput);

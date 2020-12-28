/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as path from 'path';
import { setDirPath } from '../../Redux/redux-reducers';

const FolderInput = props => {
  const { t } = useTranslation();
  const directoryRef = useRef();

  return (
    <div className="w-50 d-flex flex-row">
      <label className="custom-file-upload ml-3">
        <input
          webkitdirectory=""
          directory=""
          mozdirectory=""
          type="file"
          onChange={() => props.setDirPath(path.dirname(directoryRef.current.files[0].path))}
          ref={directoryRef}
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

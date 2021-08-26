/* eslint-disable array-callback-return */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-unsafe-finally */
/* eslint-disable import/no-duplicates */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { connect, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FormGroup, Label, Input, Button } from 'reactstrap';
import { readdirSync, lstatSync } from 'fs';
import { setBatchPath, setRecursive } from '../../Redux/redux-reducers';

const FolderHandler = props => {
  const BatchDirRef = useRef();
  const { t } = useTranslation();
  const { batchPath, recursive } = props;
  const store = useSelector(state => state);
  const files = [];

  function parseBatch(path, recur) {
    try {
      readdirSync(path, 'utf8').map(item => {
        const file = {
          path: `${path}/${item}`,
          name: item,
          isDir: lstatSync(`${path}/${item}`).isDirectory(),
        };
        recur && file.isDir ? parseBatch(file.path) : !file.isDir && files.push(file);
      });
    } catch (error) {
      console.log(error);
    } finally {
      return files;
    }
  }

  async function setPath() {
    props.setBatchPath(BatchDirRef.current.files[0].path);
    console.log(parseBatch(batchPath, recursive));
  }

  function checkboxHandleChange(e) {
    props.setRecursive(e.target.checked);
    console.log(store);
  }

  return (
    <div className="mt-3">
      <FormGroup className="mt-3 w-100 d-flex flex-row align-items-center">
        <Label for="customFile" className="mr-1 my-auto w-25">
          Batch directory:
        </Label>
        <Input className="dir_path w-50" readOnly placeholder={batchPath} />
        <div className="w-25 d-flex flex-row">
          <label className="custom-file-upload ml-3">
            <input
              className="ml-3"
              directory=""
              webkitdirectory=""
              type="file"
              ref={BatchDirRef}
              onChange={setPath}
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
  batchPath: state.batchPath,
  recursive: state.recursive,
});
export default connect(mapStateToProps, { setBatchPath, setRecursive })(FolderHandler);

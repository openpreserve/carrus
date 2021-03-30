/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Container, Card, CardTitle, FormGroup, Input, CardBody, Label, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { green } from '@material-ui/core/colors';
import mapTools from '../../utils/mapTools';
import mapActions from '../../utils/mapActions';
import { setConfig } from '../../Redux/redux-reducers';
import setDefaultValues from '../../utils/setDefaultValues';

const Settings = props => {
  const { actions, tools, fileFormats, actionTypes, config } = props;
  const { t } = useTranslation();

  const [defaultActionType, setDefaultActionType] = useState('');
  const [defaultFileType, setDefaultFileType] = useState('');
  const [defaultTool, setDefaultTool] = useState('no default');
  const [defaultAction, setDefaultAction] = useState('no default');

  const InputToolRef = useRef();
  const InputActionRef = useRef();

  const handleExecute = () => {
    const defaultObj = {
      defaultActionType,
      defaultFileType,
      defaultTool,
      defaultAction,
    };

    if (config.defaultValues && config.defaultValues.length) {
      config.defaultValues = setDefaultValues(defaultObj, config.defaultValues);
      props.setConfig(config);
      ipcRenderer.send('update-default-values', config.defaultValues);
    } else {
      config.defaultValues = [defaultObj];
      props.setConfig(config);
      ipcRenderer.send('update-default-values', [defaultObj]);
    }

    console.log(config);
  };

  useEffect(() => console.log(props), [props]);
  /* useEffect(() => console.log(defaultTool), [defaultTool]);
  useEffect(() => console.log(defaultAction), [defaultAction]); */

  function handleDefaultValues(ToolRef, ActionRef, actionType, fileType) {
    console.log(actionType, fileType);
    if (config.defaultValues && config.defaultValues.length) {
      const currentObj = config.defaultValues.find((obj) => (
        (obj.defaultFileType === fileType && obj.defaultActionType === actionType)
      ));
      console.log(currentObj);
      if (currentObj) {
        setDefaultTool(currentObj.defaultTool);
        ToolRef = currentObj.defaultTool;
      }
      if (currentObj && currentObj.defaultTool !== 'no default') {
        setDefaultAction(currentObj.defaultAction);
        ActionRef = currentObj.defaultAction;
      }
    }
  }

  return (
    <Container>
      <div className="d-flex w-100 flex-row align-items-center mb-5">
        <Link to="/">
          <ArrowBackIcon />
        </Link>
        <h3 className="m-0 ml-3 font-weight-bold">{t('Tools')}</h3>
      </div>
      <div className="d-flex flex-row">
        <div className="d-flex flex-column justify-content-center w-75">
          <Card className="w-100 border-0 mt-4">
            <CardBody>
              <FormGroup className="mt-3 d-flex flex-row mb-3">
                <Label for="defaultTool" className="mr-1 my-auto w-25">
                  <span className="pr-3">{t('ActionType')}:</span>
                </Label>
                <Input
                  type="select"
                  className="w-50"
                  onChange={e => {
                    setDefaultTool('no default');
                    setDefaultAction('no default');
                    setDefaultActionType(e.target.value);
                    handleDefaultValues(InputToolRef, InputActionRef, e.target.value, defaultFileType);
                  }}
                >
                  {
                    actionTypes ? (
                      <>
                        <option hidden>{t('chooseAllowedActionTypes')}</option>
                        {actionTypes.map((e, i) => (
                          <option key={i}>{e.id.name}</option>
                        ))}
                      </>
                    ) : (
                      <>
                        <option hidden>{t('noActionTypes')}</option>
                        <option disabled>{t('noActionTypes')}</option>
                      </>
                    )
                  }
                </Input>
              </FormGroup>
            </CardBody>
          </Card>
          <Card className="w-100 border-0">
            <CardBody>
              <FormGroup className="mt-3 d-flex flex-row mb-3">
                <Label for="defaultTool" className="mr-1 my-auto w-25">
                  <span>{t('FileFormat')}:</span>
                </Label>
                <Input
                  type="select"
                  className="w-50"
                  onChange={e => {
                    setDefaultTool('no default');
                    setDefaultAction('no default');
                    setDefaultFileType(e.target.value);
                    handleDefaultValues(InputToolRef, InputActionRef, defaultActionType, e.target.value);
                  }}
                >
                  {
                    fileFormats ? (
                      <>
                        <option hidden>{t('chooseFileFormat')}</option>
                        {fileFormats.map((e, i) => (
                          <option key={i}>{e.id.name}</option>
                        ))}
                      </>
                    ) : (
                      <>
                        <option hidden>{t('fileTypesUnavailable')}</option>
                        <option disabled>{t('fileTypesUnavailable')}</option>
                      </>
                    )
                  }
                </Input>
              </FormGroup>
            </CardBody>
          </Card>
          <Card className="w-100 border-0">
            <CardBody>
              <FormGroup className="mt-3 d-flex flex-row mb-3">
                <Label for="defaultTool" className="mr-1 my-auto w-25">
                  <span>{t('defaultTool')}:</span>
                </Label>
                <Input
                  type="select"
                  className="w-50"
                  value={
                    defaultTool
                  }
                  onChange={e => {
                    setDefaultTool(e.target.value);
                    InputToolRef.current = e;
                  }}
                >
                  {mapTools(actions, defaultActionType, defaultFileType)}
                </Input>
              </FormGroup>
              {/* {
                ((config.defaultValues.find((obj) => (
                  (obj.defaultFileType === defaultFileType && obj.defaultActionType === defaultActionType)
                )))?.defaultTool) ? (
                  <div className="d-flex flex-row w-50 mb-3">
                    <CheckCircleOutlineIcon style={{ color: green[500] }} />
                    <span className="ml-1">{
                      ((config.defaultValues.find((obj) => (
                        (obj.defaultFileType === defaultFileType && obj.defaultActionType === defaultActionType)
                      )))?.defaultTool)
                    }
                    </span>
                  </div>
                  )
                  : (
                    <span>{t('noDefaultTools')}</span>
                  )
              } */}
            </CardBody>
          </Card>
          <Card className="w-100 border-0">
            <CardBody>
              <FormGroup className="mt-3 d-flex flex-row mb-3">
                <Label for="defaultTool" className="mr-1 my-auto w-25">
                  <span>{t('defaultAction')}:</span>
                </Label>
                <Input
                  type="select"
                  className="w-50"
                  value={
                    defaultAction
                  }
                  onChange={e => {
                    setDefaultAction(e.target.value);
                    InputActionRef.current = e;
                  }}
                >
                  {mapActions(actions, defaultActionType, defaultFileType, defaultTool)}
                </Input>
              </FormGroup>
              {/* {
                ((config.defaultValues.find((obj) => (
                  (obj.defaultFileType === defaultFileType && obj.defaultActionType === defaultActionType)
                )))?.defaultAction) ? (
                  <div className="d-flex flex-row w-50 mb-3">
                    <CheckCircleOutlineIcon style={{ color: green[500] }} />
                    <span className="ml-1">{
                      ((config.defaultValues.find((obj) => (
                        (obj.defaultFileType === defaultFileType && obj.defaultActionType === defaultActionType)
                      )))?.defaultAction)
                    }
                    </span>
                  </div>
                  )
                  : (
                    <span>{t('noActions')}</span>
                  )
              } */}
            </CardBody>
          </Card>
          <Button
            color="success"
            value="Execute"
            className="w-25 mt-4 align-self-center"
            disabled={!defaultActionType || !defaultFileType}
            onClick={handleExecute}
          >
            {t('Apply')}
          </Button>
        </div>
      </div>
    </Container>
  );
};

const mapStateToProps = state => ({
  actions: state.actions,
  actionTypes: state.actionTypes,
  fileFormats: state.fileFormats,
  outputFolder: state.outputFolder,
  url: state.url,
  fileOrigin: state.fileOrigin,
  fileName: state.fileName,
  filePath: state.filePath,
  dirPath: state.dirPath,
  tools: state.tools,
  config: state.config,
});

export default connect(mapStateToProps, {
  setConfig,
})(Settings);
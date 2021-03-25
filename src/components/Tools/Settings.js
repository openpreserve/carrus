/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Container, Card, CardTitle, FormGroup, Input, CardBody, Label, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { green } from '@material-ui/core/colors';
import mapTools from '../../utils/mapTools';
import setAcceptedActions from '../../utils/setAcceptedActions';

const Settings = props => {
  const { actions, tools, fileFormats, actionTypes } = props;
  const { t } = useTranslation();

  const [defaultActionType, setDefaultActionType] = useState('');
  const [defaultFileType, setDefaultFileType] = useState('');
  const [defaultTool, setDefaultTool] = useState('');

  /* useEffect(() => console.log(props), [props]); */
  useEffect(() => console.log(defaultTool), [defaultTool]);
  return (
    <Container>
      <div className="d-flex w-100 flex-row align-items-center mb-5">
        <Link to="/">
          <ArrowBackIcon />
        </Link>
        <h3 className="m-0 ml-3 font-weight-bold">{t('Tools')}</h3>
      </div>
      <div className="d-flex flex-row">
        <div className="d-flex flex-column justify-content-center w-50 pt-5">
          <Card className="w-100 border-0 mt-4">
            <CardBody>
              <CardTitle tag="h5" className="font-weight-bold">
                {t('FileFormat')}
              </CardTitle>
              <FormGroup className="mt-3 d-flex flex-row mb-3">
                <Label for="defaultTool" className="w-50 m-auto">
                  <span>{t('defaultFileFormat')}:</span>
                </Label>
                <Input
                  type="select"
                  onChange={e => {
                    setDefaultFileType(e.target.value);
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
              <CardTitle tag="h5" className="font-weight-bold">
                {t('Tool')}
              </CardTitle>
              <FormGroup className="mt-3 d-flex flex-row mb-3">
                <Label for="defaultTool" className="w-50 m-auto">
                  <span>{t('defaultTool')}:</span>
                </Label>
                <Input
                  type="select"
                  onChange={e => {
                    setDefaultTool(e.target.value);
                  }}
                >
                  {mapTools(actions, defaultActionType, defaultFileType)}
                </Input>
              </FormGroup>
              {
                defaultTool ? (
                  <div className="d-flex flex-row w-50 mb-3">
                    <CheckCircleOutlineIcon style={{ color: green[500] }} />
                    <span className="ml-1">{defaultTool}</span>
                  </div>
                )
                  : (
                    <span>{t('noDefaultTools')}</span>
                  )
              }
            </CardBody>
          </Card>
          <Button
            color="success"
            value="Execute"
            className="w-25 mt-4 align-self-center"
            disabled={!defaultTool}
          >
            {t('Apply')}
          </Button>
        </div>
        <div className="w-50">
          <Card className="border-0">
            <CardBody>
              <FormGroup className="d-flex flex-column align-items-end mb-3">
                <CardTitle tag="h5" className="w-50 font-weight-bold text-center">
                  {t('ActionType')}
                </CardTitle>
                <Input
                  type="select"
                  className="w-50"
                  onChange={e => {
                    setDefaultActionType(e.target.value);
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
});

export default connect(mapStateToProps, {})(Settings);

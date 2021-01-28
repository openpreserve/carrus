/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Container, Card, CardTitle, FormGroup, Input, CardBody, Label } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { green } from '@material-ui/core/colors';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import mapTools from '../../utils/mapTools';
import setAcceptedActions from '../../utils/setAcceptedActions';

const Tools = props => {
  const { actions, tools } = props;
  const { t } = useTranslation();
  const PDFArray = [];
  const JPEGArray = [];
  setAcceptedActions(props.actions, props.fileFormats, 'application/pdf')
    .forEach(item => {
      !PDFArray.find(e => e === item.tool.id.name) ? PDFArray.push(item.tool.id.name) : null;
    });
  setAcceptedActions(props.actions, props.fileFormats, 'image/jpeg')
    .forEach(item => {
      !JPEGArray.find(e => e === item.tool.id.name) ? JPEGArray.push(item.tool.id.name) : null;
    });

  /* useEffect(() => console.log(props), [props]); */
  /* console.log(PDFArray);
  console.log(JPEGArray); */
  return (
    <Container>
      <div className="d-flex flex-column align-items-left">
        <div className="d-flex w-50 flex-row align-items-center mb-5">
          <Link to="/">
            <ArrowBackIcon />
          </Link>
          <h3 className="m-0 ml-3 font-weight-bold">{t('Tools')}</h3>
        </div>
        <Card className="w-50 border-0">
          <CardBody>
            <CardTitle tag="h5" className="font-weight-bold">
              PDF:
            </CardTitle>
            <FormGroup className="mt-3 d-flex flex-row mb-3">
              <Label for="defaultTool" className="w-50 m-auto">
                <span>{t('defaultTool')}:</span>
              </Label>
              <Input type="select">
                {PDFArray.map((e, i) => (
                  <option key={i}>{e}</option>
                ))}
              </Input>
            </FormGroup>
            {mapTools(tools, actions, 'pdf')}
          </CardBody>
        </Card>
        <Card className="w-50 border-0">
          <CardBody>
            <CardTitle tag="h5" className="font-weight-bold">
              Image:
            </CardTitle>
            <FormGroup className="mt-3 d-flex flex-row mb-3">
              <Label for="defaultTool" className="w-50 m-auto">
                <span>{t('defaultTool')}:</span>
              </Label>
              <Input type="select">
                {JPEGArray.map((e, i) => (
                  <option key={(i * 2) / 0.4}>{e}</option>
                ))}
              </Input>
            </FormGroup>
            {mapTools(tools, actions, 'image')}
          </CardBody>
        </Card>
      </div>
    </Container>
  );
};

const mapStateToProps = state => ({
  actions: state.actions,
  fileFormats: state.fileFormats,
  outputFolder: state.outputFolder,
  url: state.url,
  fileOrigin: state.fileOrigin,
  fileName: state.fileName,
  filePath: state.filePath,
  dirPath: state.dirPath,
  tools: state.tools,
});

export default connect(mapStateToProps, {})(Tools);

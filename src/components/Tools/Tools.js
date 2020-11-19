/* eslint-disable max-len */
import React from 'react';
import { connect } from 'react-redux';
import { Container, Card, CardTitle, FormGroup, Input, CardBody, Label } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { green } from '@material-ui/core/colors';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { setTool, updateJPEGTool } from '../../Redux/redux-reducers';

const Tools = props => {
  const { t } = useTranslation();
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
              <Input type="select" onChange={e => props.setTool(e.target.value)}>
                <option>PDF hul</option>
                <option>veraPDF</option>
              </Input>
            </FormGroup>
            <div className="d-flex flex-row w-50 mb-3">
              <CheckCircleOutlineIcon style={{ color: green[500] }} />
              <span className="ml-1">PDF hul</span>
            </div>
            <div className="d-flex flex-row w-50 mb-3">
              <CheckCircleOutlineIcon style={{ color: green[500] }} />
              <span className="ml-1">veraPDF</span>
            </div>
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
              <Input type="select" onChange={e => props.updateJPEGTool(e.target.value)}>
                <option>JPEG hul</option>
                <option>PNG dgm</option>
              </Input>
            </FormGroup>
            <div className="d-flex flex-row w-50 mb-3">
              <CheckCircleOutlineIcon style={{ color: green[500] }} />
              <span className="ml-1">JPEG hul</span>
            </div>
            <div className="d-flex flex-row w-50 mb-3">
              <CheckCircleOutlineIcon style={{ color: 'white' }} />

              <span className="ml-1">GIF hul</span>
            </div>
            <div className="d-flex flex-row w-50 mb-3">
              <CheckCircleOutlineIcon style={{ color: green[500] }} />
              <span className="ml-1">PNG dgm</span>
            </div>
            <div className="d-flex flex-row w-50 mb-3">
              <CheckCircleOutlineIcon style={{ color: 'white' }} />

              <span className="ml-1">JPEG2000 hul</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
};

const mapStateToProps = state => ({ defaultPDF: state.tool, defaultJPEG: state.defaultJPEGTool });

export default connect(mapStateToProps, { updateJPEGTool, setTool })(Tools);

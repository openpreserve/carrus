import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Progress, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import SemiHeader from '../Header/SemiHeader';
import { setStage } from '../../Redux/redux-reducers';

const ProgressBar = (props) => {
  const { stage } = props;
  const { t } = useTranslation();
  // eslint-disable-next-line no-console
  useEffect(() => {
    ipcRenderer.on('stage', (event, processStage) => {
      props.setStage(processStage);
    });
  });

  const findPC = () => {
    const PC = (stage.stage / stage.stages) * 100;
    return PC.toFixed(2);
  };

  const findStage = () => {
    if (stage.currentFile) {
      return `${stage.stage}/${stage.stages}`;
    }
    return null;
  };

  const getName = () => {
    if (stage?.currentFile) {
      return `( ${stage.currentFile} )`;
    }
    return '';
  };

  const handleCansel = () => {
    ipcRenderer.send('cancel-batch-processing');
    props.setStage({ cancel: true });
  };

  return stage?.stages ? (
    <div className="container d-flex flex-column">
      <SemiHeader />
      <Container className="align-items-center loader-content">
        <p className="lead" align="center">{t('Loading')}</p>
        <p align="center">{getName()}</p>
        <Progress bar animated color="success" value={findPC()} style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
          {findPC()}%
        </Progress>
        <p style={{ marginTop: '1rem' }} align="center">{findStage()}</p>
        <p className="align-content-center">
          <Button
            color="danger"
            value="Cancel"
            className="mt-3 align-self-center"
            align="center"
            onClick={handleCansel}
          >
            {t('Cancel')}
          </Button>
        </p>
      </Container>
    </div>
  ) : stage?.cancel ? (
    <div className="container d-flex flex-column">
      <SemiHeader />
      <Container fluid className="d-flex flex-column align-items-center loader-content">
        <p className="lead">{t('Cancel')}</p>
        <Progress bar animated color="danger" value="100" style={{ paddingTop: '1rem', paddingBottom: '1rem' }} />
      </Container>
    </div>
  ) : (
    <div className="container d-flex flex-column">
      <SemiHeader />
      <Container fluid className="d-flex flex-column align-items-center loader-content">
        <p className="lead">{t('Loading')}</p>
      </Container>
    </div>
  );
};

const mapStateToProps = state => ({
  stage: state.stage,
});
export default connect(mapStateToProps, { setStage })(ProgressBar);

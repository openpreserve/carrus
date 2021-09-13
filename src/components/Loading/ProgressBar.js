import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Progress } from 'reactstrap';
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
    return PC;
  };
  return (
    <div className="container d-flex flex-column">
      <SemiHeader />
      <Container fluid className="d-flex flex-column align-items-center loader-content">
        <p className="lead">{t('Loading')}</p>
        <Progress bar animated color="success" value={findPC()} />
        <p style={{ marginTop: '1rem' }}>{stage?.currentFile}</p>
      </Container>
    </div>
  );
};

const mapStateToProps = state => ({
  stage: state.stage,
});
export default connect(mapStateToProps, { setStage })(ProgressBar);

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Progress } from 'reactstrap';
import { ipcRenderer } from 'electron';
import SemiHeader from '../Header/SemiHeader';

const ProgressBar = () => {
  const { t } = useTranslation();
  const [stage, setStage] = useState();
  // eslint-disable-next-line no-console
  ipcRenderer.on('stage', async (event, processStage) => { await setStage(processStage); });
  console.log(stage);
  return (
    <div className="container d-flex flex-column">
      <SemiHeader />
      <Container fluid className="d-flex flex-column align-items-center loader-content">
        <p className="lead">{t('Loading')}</p>
        <Progress animated bar color="success" value="100" />
        <p>{stage?.currentFile}</p>
        {stage?.stage}/{stage?.stages}
      </Container>
    </div>
  );
};

export default ProgressBar;

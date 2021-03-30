/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Container, Jumbotron, Button } from 'reactstrap';
import { ipcRenderer } from 'electron';
import { useTranslation } from 'react-i18next';
import CancelIcon from '@material-ui/icons/Cancel';

const JobFailed = (props) => {
  const [report, setReport] = useState('');
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  ipcRenderer.on('receive-err', (event, arg) => {
    console.log(arg.report);
    setReport(arg.report);
  });

  useEffect(() => {
    ipcRenderer.once('config', (event, config) => {
      if (config.language && (config.language === 'fr' || config.language === 'ru')) {
        i18n.changeLanguage(config.language);
      }
    });

    ipcRenderer.once('PAR', (event, PAR) => {
      props.setParData(PAR);
    });
  }, []);

  return (
    <Container>
      <Jumbotron className="p-4 bg-white mt-5 d-flex flex-column align-items-center">
        <div className="d-flex flex-column align-items-center mb-5">
          <CancelIcon style={{ fontSize: 70 }} color="secondary" className="mb-3" />
          <span style={{ color: 'red', fontSize: 25 }}>{t('JobFailed')}</span>
        </div>
        <div className="mt-5 mb-5">
          <span className="mx-auto">{report}</span>
        </div>
        <Button color="danger">{t('SendReport')}</Button>
      </Jumbotron>
    </Container>
  );
};

export default JobFailed;

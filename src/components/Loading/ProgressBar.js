import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Progress } from 'reactstrap';
import SemiHeader from '../Header/SemiHeader';

const ProgressBar = () => {
  const { t } = useTranslation();

  return (
    <div className="container d-flex flex-column">
      <SemiHeader />
      <Container fluid className="d-flex flex-column align-items-center loader-content">
        <p className="lead">{t('Loading')}</p>
        <Progress animated bar color="success" value="100" />
      </Container>
    </div>
  );
};

export default ProgressBar;

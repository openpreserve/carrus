import React from 'react';
import { Jumbotron, Container } from 'reactstrap';
import GetAppIcon from '@material-ui/icons/GetApp';
import { green } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useTranslation } from 'react-i18next';
import logo from '../assets/big_logo.png';

const About = () => {
  const { t } = useTranslation();
  const version = process.env.npm_package_version;
  let date = new Date(process.env.npm_package_buildDate * 1);
  date = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  return (
    <Container>
      <div className="d-flex w-50 flex-row align-items-center mb-5">
        <Link to="/">
          <ArrowBackIcon />
        </Link>
        <h3 className="m-0 ml-3 font-weight-bold">{t('About')}</h3>
      </div>
      <div className="d-flex flex-row">
        <Jumbotron className="container m-0 p-3 bg-white w-50 d-flex flex-column align-items-center">
          <div>
            <img src={logo} alt="" className="" />
          </div>
          <p className="w-75">
            {t('DerivedFrom')}
          </p>
          <p className="w-75"> {t('GNULicense')} </p>
        </Jumbotron>
        <Jumbotron className="container m-0 p-3 bg-white w-50 d-flex flex-column align-items-center">
          <div className="m-auto">
            <p className="mb-1">{t('Release', { version, date })}</p>
            <p className="mb-1">{t('outOfDate')}</p>
            <p className="mb-1">
              <span style={{ color: green[500] }}>
                <GetAppIcon /> {t('Update')}
              </span>{' '}
              {t('latestVersion')}
            </p>
          </div>
        </Jumbotron>
      </div>
    </Container>
  );
};

export default About;

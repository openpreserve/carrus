import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const SemiHeader = () => {
  const { t } = useTranslation();
  return (
    <div className="d-flex flex-row justify-content-between align-items-center">
      <div className="w-50">
        <img src={logo} alt="" className="" />
      </div>
      <div className="d-flex w-25">
        <h3 className="m-auto">
          <Link to="/tools">{t('Tools')} </Link>
        </h3>
        <h3 className="m-auto">
          <Link to="/about">{t('About')}</Link>
        </h3>
      </div>
    </div>
  );
};

export default SemiHeader;

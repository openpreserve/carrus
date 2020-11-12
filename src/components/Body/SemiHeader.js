import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png';
import { updateLanguage } from '../Redux/redux-reducers';

const SemiHeader = props => {
  const { t, i18n } = useTranslation();
  const { activeLanguage } = props;

  useEffect(() => {
    i18n.changeLanguage(activeLanguage);
  }, [props]);

  return (
    <div className="d-flex flex-row justify-content-between align-items-center">
      <div className="w-50">
        <img src={logo} alt="" className="" />
      </div>
      <div className="d-flex w-25">
        <h3 className="m-auto">{t('Tools')}</h3>
        <h3 className="m-auto">{t('About')}</h3>
      </div>
      <ButtonGroup size="md" className="m-auto bg-light">
        <Button
          value="en"
          color={activeLanguage === 'en' ? 'success' : 'light'}
          onClick={e => props.updateLanguage(e.target.value)}
        >
          en
        </Button>
        <Button
          value="fr"
          color={activeLanguage === 'fr' ? 'success' : 'light'}
          onClick={e => props.updateLanguage(e.target.value)}
        >
          fr
        </Button>
      </ButtonGroup>
    </div>
  );
};

const mapStateToProps = state => ({
  activeLanguage: state.currentLanguage,
});

export default connect(mapStateToProps, { updateLanguage })(SemiHeader);

/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { remote, ipcRenderer } from 'electron';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Main from './Main/Main';
import Header from './Header/Header';
import Tools from './Tools/Tools';
import About from './About/About';
import Report from './Report/Report';
import JobFailed from './Report/JobFailed';
import Settings from './Tools/Settings';
import { setParData, setConfig } from '../Redux/redux-reducers';

const App = props => {
  const { i18n } = useTranslation();
  const currentWindow = (() => remote.getCurrentWindow()._id)();

  useEffect(() => {
    ipcRenderer.once('config', (event, config) => {
      props.setConfig(config);
      if (config.language && (config.language === 'fr' || config.language === 'ru')) {
        i18n.changeLanguage(config.language);
      }
    });

    ipcRenderer.once('PAR', (event, PAR) => {
      props.setParData(PAR);
    });
  }, []);

  return (
    <div className="mb-3">
      <Header />
      <div className="main-content">
        <Switch>
          <Route exact path="/">
            {currentWindow === 'main' ? <Main /> : null}
            {currentWindow === 'report' ? <Report /> : null}
            {currentWindow === 'jobFailed' ? <JobFailed /> : null}
          </Route>
          {/* <Route exact path="/tools">
            <Tools />
          </Route> */}
          <Route exact path="/tools">
            <Settings />
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  actions: state.actions,
  config: state.config,
});

export default connect(mapStateToProps, {
  setParData,
  setConfig,
})(App);

import React/* , { useEffect } */ from 'react';
import { Switch, Route } from 'react-router-dom';
import { remote, ipcRenderer } from 'electron';
import { useTranslation } from 'react-i18next';
/* import useI18next from '../i18next/i18next'; */
import Main from './Main/Main';
import Header from './Header/Header';
import Tools from './Tools/Tools';
import About from './About/About';
import Report from './Report/Report';
// import JobFailed from './Report/JobFailed';

const App = () => {
  const { i18n } = useTranslation();
  const currentWindow = (() => remote.getCurrentWindow()._id)();

  ipcRenderer.on('config', (event, config) => {
    if (config.language && (config.language === 'fr' || config.language === 'ru')) {
      i18n.changeLanguage(config.language);
    }
  });

  return (
    <div className="mb-3">
      <Header />
      <Switch>
        <Route exact path="/">
          {currentWindow === 'main' ? <Main /> : <Report />}
        </Route>
        <Route exact path="/tools">
          <Tools />
        </Route>
        <Route exact path="/about">
          <About />
        </Route>
      </Switch>
    </div>
  );
};

export default App;

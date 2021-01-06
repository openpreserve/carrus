import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { ipcRenderer } from 'electron';
import { HashRouter as Router } from 'react-router-dom';
import App from '../components/App';
import store from '../Redux/redux-store';
import useI18next from '../i18next/i18next';
import '../styles/index.css';
import '../utils/contextMenu';

ipcRenderer.on('translate', (event, translate) => {
  useI18next(translate).then(() => {
    ReactDOM.render(
      <Router>
        <Provider store={store}>
          <App />
        </Provider>
      </Router>,
      document.getElementById('app'),
    );
  });
});

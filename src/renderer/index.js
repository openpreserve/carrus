/* eslint-disable no-new */
import React from 'react';
import ReactDOM from 'react-dom';
import { Titlebar, Color } from 'custom-electron-titlebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import App from '../components/App';
import store from '../components/Redux/redux-store';
import '../i18next/i18next';

const titleBar = new Titlebar({
  backgroundColor: Color.fromHex('#e6e6e6'),
});

titleBar.updateTitle('JHOVE 2020');

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
);

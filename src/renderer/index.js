import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import App from '../components/App';
import store from '../Redux/redux-store';
import '../i18next/i18next';
import '../index.css';

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('app'),
);

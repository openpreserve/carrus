/* eslint-disable no-new */
import React from 'react';
import ReactDOM from 'react-dom';
import { Titlebar, Color } from 'custom-electron-titlebar';
import App from '../components/App';
import 'bootstrap/dist/css/bootstrap.min.css';

const titleBar = new Titlebar({
  backgroundColor: Color.fromHex('#e6e6e6'),
});

titleBar.updateTitle('JHOVE 2020');

ReactDOM.render(<App />, document.getElementById('app'));

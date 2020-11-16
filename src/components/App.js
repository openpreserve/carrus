import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Main from './Main/Main';
import Header from './Header/Header';
import Tools from './Tools/Tools';
import About from './About/About';

const App = () => (
  <div className="mb-3">
    <Header />
    <Switch>
      <Route exact path="/">
        <Main />
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

export default App;

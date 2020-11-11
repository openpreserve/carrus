import React from 'react';
import logo from '../assets/logo.png';

const SemiHeader = () => (
  <div className="d-flex flex-row justify-content-between align-items-center">
    <div className="w-75">
      <img src={logo} alt="" className="" />
    </div>
    <div className="d-flex w-25">
      <h3 className="m-auto">Tools</h3>
      <h3>About</h3>
    </div>
  </div>
);

export default SemiHeader;

/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import logo from '../assets/logo.png';
import FileHandler from './FileHandler';
import UrlHandler from './UrlHandler';

function Body() {
  const [activeTab, setActiveTab] = useState('1');

  return (
    <div className="container d-flex flex-column mt-5">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="w-75">
          <img src={logo} alt="" className="" />
        </div>
        <div className="d-flex w-25">
          <h3 className="m-auto">Tools</h3>
          <h3>About</h3>
        </div>
      </div>
      <Nav tabs className="mt-5">
        <NavItem className="mr-1">
          <NavLink
            className={
              activeTab === '1' ? 'active text-success font-weight-bold' : 'bg-light text-dark'
            }
            onClick={() => setActiveTab('1')}
          >
            Your File
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={
              activeTab === '2' ? 'active text-success font-weight-bold' : 'bg-light text-dark '
            }
            onClick={() => setActiveTab('2')}
          >
            From URL
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <FileHandler />
        </TabPane>
        <TabPane tabId="2">
          <UrlHandler />
        </TabPane>
      </TabContent>
    </div>
  );
}

export default Body;

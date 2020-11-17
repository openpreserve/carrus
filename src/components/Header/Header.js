/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';

import { Navbar, NavbarBrand, DropdownToggle, Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import { remote } from 'electron';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icons from './Icons';

const Header = () => {
  const currentWindow = (() => remote.getCurrentWindow()._id)();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);
  const { t } = useTranslation();
  console.log(currentWindow);

  return (
    <div className="titlebar mb-3">
      <Navbar color="faded" light>
        <Dropdown
          isOpen={dropdownOpen}
          style={{ visibility: currentWindow === 'main' ? '' : 'hidden' }}
          toggle={toggle}
        >
          <DropdownToggle color="white">☰</DropdownToggle>
          <DropdownMenu>
            <DropdownItem to="/" tag={Link}>
              {t('mainPage')}
            </DropdownItem>
            <DropdownItem to="/tools" tag={Link}>
              {t('Tools')}
            </DropdownItem>
            <DropdownItem to="/about" tag={Link}>
              {t('About')}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavbarBrand href="/" className="mx-auto">
          JHove 2020
        </NavbarBrand>
        <Icons />
      </Navbar>
    </div>
  );
};

export default Header;

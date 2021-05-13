import React, { useState } from 'react';
import { Navbar, NavbarBrand, DropdownToggle, Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import { remote } from 'electron';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icons from './Icons';
import { APP_NAME } from '../../utils/constants';

const Header = () => {
  const currentWindow = (() => remote.getCurrentWindow()._id)();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);
  const { t } = useTranslation();

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
            <DropdownItem active={location.hash === '#/'} to="/" tag={Link}>
              {t('mainPage')}
            </DropdownItem>
            <DropdownItem active={location.hash === '#/tools'} to="/tools" tag={Link}>
              {t('Tools')}
            </DropdownItem>
            <DropdownItem active={location.hash === '#/about'} to="/about" tag={Link}>
              {t('About')}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavbarBrand href="/" className="mx-auto">
          {APP_NAME}
        </NavbarBrand>
        <Icons />
      </Navbar>
    </div>
  );
};

export default Header;

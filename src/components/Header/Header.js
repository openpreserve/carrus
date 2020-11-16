import React, { useState } from 'react';

import { Navbar, NavbarBrand, DropdownToggle, Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icons from './Icons';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);
  const { t } = useTranslation();

  return (
    <div className="titlebar mb-3">
      <Navbar color="faded" light>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
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

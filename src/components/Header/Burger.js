import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';

const Burger = (props) => {
  const { classes } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <IconButton edge="start" className={classes} color="inherit" aria-label="menu">
      <MenuIcon aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => handleClick(e)} />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => handleClose()}
      >
        <MenuItem onClick={() => handleClose()}>Main Page</MenuItem>
        <MenuItem onClick={() => handleClose()}>Tools</MenuItem>
        <MenuItem onClick={() => handleClose()}>About</MenuItem>
      </Menu>
    </IconButton>
  );
};

Burger.propTypes = {
  classes: PropTypes.string.isRequired,
};

export default Burger;

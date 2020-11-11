import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Burger from './Burger';
import Icons from './Icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: 44,
    height: 44,
    backgroundColor: 'whisper',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    textAlign: 'center',
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: 'whisper',
  },
}));

const Header = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Burger classes={classes.menuButton} />
          <Typography variant="h6" className={classes.title}>
            JHove 2020
          </Typography>
          <Icons />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;

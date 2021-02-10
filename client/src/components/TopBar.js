import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Menu from '@material-ui/core/Menu';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import './style.css';

export default function TopBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.topBar}>
        <Toolbar>
          {/*<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>*/}
          <Typography variant="h6" className={classes.title}>
            Masquerade_LOGO
          </Typography>
          {(
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
              <Badge badgeContent={1} color="secondary">
                <NotificationsIcon />
              </Badge> 
                </IconButton>
              <Menu
                className={classes.notificationMenu}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem className={classes.menuItem}>21.25 - Ordine in consegna</MenuItem>
                <MenuItem className={classes.menuItem}>21.16 - Ordine in lavorazione</MenuItem>
                <MenuItem className={classes.menuItem}>20.53 - Ordine inviato</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: '#202020'
    },
    topBar: {
        backgroundColor: '#ffc300'
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    menuItem: {
      fontSize: 12,
      backgroundColor: '#202020',
      color: '#fff'
    },
    title: {
      flexGrow: 1,
    },
  }));
import React from 'react'
import logo from './logo.svg';
import './App.css';
import { fade, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appbar: {
    flexGrow: 1,
    // position: 'absolute',
  },
  toolbar: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,                // 這個容器長好長滿
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',    // flexDirection: 現在是由上到下排列
    justifyContent: 'center',   // justifyContent: 在flex方向上的排列
    alignItems: 'center',       // alignItems: 子物件在格子中的位置
  },
  searchbar: {
    position: 'relative',
    // borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputInput: {
    color: 'inherit',
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '30ch',
      '&:focus': {
        width: '60ch',
      },
    },
  },
}))

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar className={classes.appbar}
        // color="transparent"
        >
        <Toolbar className={classes.toolbar}>
          <Typography className={classes.toolbar}>
            Toolbar (Add logo here)
          </Typography>
          <Box borderRadius={50} className={classes.searchbar}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              className={classes.inputInput}
              placeholder="Search restaurant!" />
          </Box>
        </Toolbar>
      </AppBar>
      <header className={classes.content}>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

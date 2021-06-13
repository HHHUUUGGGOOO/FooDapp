import React, { useEffect, useState } from 'react'
import { fade, makeStyles } from '@material-ui/core/styles';
import {
  CssBaseline, Box, AppBar, Toolbar, InputBase,
  Typography, Select, MenuItem, IconButton, LinearProgress
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn'

import CustomerPage from './CustomerPage';
import DeliverymanPanel from './DeliverymanPanel';
import StorePanel from './StorePanel2';

import FooDappContract from './build/contracts/Store_Order.json'

import getWeb3 from './utils/getWeb3';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: "column",
    height: '100vh',
  },
  appbar: {
    flexGrow: 1,
  },
  toolbar: {
    flexGrow: 1,
  },
  identitySelectorTabs: {
    flexGrow: 0.9,
    borderRadius: 50,
    backgroundColor: fade(theme.palette.common.white, 0.25),
  },
  identitySelectorTab: {
    minWidth: 0,
    margin: 5,
    flexGrow: 0.9,
    borderRadius: 50,
    // backgroundColor: fade(theme.palette.common.white, 0.25),
    // width: 30,
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
      // width: 50,
    }
  },
  identitySelectorBox: {
    color: 'inherit',
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: theme.spacing(2),
    // width: '100%',
    borderRadius: 50,
    // padding: theme.spacing(1),
  },
  identitySelectorSelect: {
    color: 'inherit',
    '&:before': {
      borderColor: theme.palette.common.white,
    },
    '&:after': {
      borderColor: theme.palette.common.white,
    },
    margin: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  identitySelectorSelectIcon: {
    fill: 'white',
  },
  searchBarBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
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
    borderRadius: 50,
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    // position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchReturnButton: {
    padding: theme.spacing(1),
    marginRight: theme.spacing(1),
    height: '100%',
    // pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputInput: {
    color: 'inherit',
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    // paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '30ch',
      '&:focus': {
        width: '60ch',
      },
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,                // 這個容器長好長滿

    display: 'flex',
    flexDirection: 'column',    // flexDirection: 現在是由上到下排列
    // justifyContent: 'center',   // justifyContent: 在flex方向上的排列
    alignItems: 'center',       // alignItems: 子物件在格子中的位置
    height: '100vh',
  },
  page: {
    display: 'flex',
    flexGrow: 1,
  },
}))

function App() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [identity, setIdentity] = useState("Customer")
  const [searchWord, setSearchWord] = useState('')
  const [web3States, setWeb3States] = useState({ web3: null, accounts: null, contract: null })
  const handleIdentityChange = (event) => {
    setIdentity(event.target.value);
  };
  const handleSearchWordChange = (event) => {
    console.log("Search~~")
  };

  const Login = async () => {
    console.log("logining...");
    setIsLoading(true);
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FooDappContract.networks[networkId];
      const instance = new web3.eth.Contract(
        FooDappContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setWeb3States({ web3, accounts, contract: instance });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    };
    setIsLoading(false);
  }

  useEffect(() => {
    Login();
  }, [])

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
          <Box className={classes.searchBarBox}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              className={classes.inputInput}
              defaultValue={searchWord}
              placeholder="Search restaurant!"
              onChange={(event) => { setSearchWord(event.target.value) }}
            />
            <IconButton className={classes.searchReturnButton} color="inherit" onClick={handleSearchWordChange} variant='contained'>
              <KeyboardReturnIcon />
            </IconButton>
          </Box>
          <Box className={classes.identitySelectorBox}>
            <Select
              className={classes.identitySelectorSelect}
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              // open={open}
              // onClose={handleClose}
              // onOpen={handleOpen}
              value={identity}
              onChange={handleIdentityChange}
              inputProps={{
                classes: {
                  icon: classes.identitySelectorSelectIcon,
                },
              }}
            >
              <MenuItem value="Customer">我想訂餐</MenuItem>
              <MenuItem value="Deliveryman">我是外送員</MenuItem>
              <MenuItem value="Store">我是店家</MenuItem>
            </Select>
          </Box>
        </Toolbar>
        {isLoading && <LinearProgress />}
      </AppBar>
      {/* a place covered by appbar */}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {identity === "Customer" &&
          <CustomerPage
            className={classes.page}
            isLoadingPair={{isLoading, setIsLoading}}
            web3States={web3States}
          />}
        {identity === "Deliveryman" && 
          <DeliverymanPanel 
            className={classes.page} 
            isLoadingPair={{isLoading, setIsLoading}} 
            web3States={web3States}
          />}
        {identity === "Store" && 
          <StorePanel 
            className={classes.page} 
            isLoadingPair={{isLoading, setIsLoading}} 
            web3States={web3States}
          />}
      </main>
    </div>
  );
}

export default App;

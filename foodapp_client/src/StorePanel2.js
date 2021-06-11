import {
  Box, Container, Dialog, Divider, Grid,
  Fab, Typography, TextField, Paper, Button,
  CircularProgress, makeStyles
} from "@material-ui/core";
import {
  Add, ArrowBack, ArrowForward, Edit
} from "@material-ui/icons"

import { useState, useEffect } from "react";
import Web3 from "web3";

import StoreSingleOrder from "./StoreSingleOrder";

const useStyles = makeStyles((theme) => ({
  storePanelBox: {
    display: 'flex',
    width: '100vw',
    margin: theme.spacing(1),
  },
  storePanelFabsBox: {
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
  },
  storePanelFab: {
    marginTop: theme.spacing(1),
  },
  StorePanelContainer: {
  },
  storePanelStoreTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  storePanelPaper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    minWidth: "500px",
  },
  storePanelTitle: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(0),
  },
  storePanelDetails: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
  },
  storePanelButtonBox: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  storePanelButtonWrapper: {
    position: 'relative',
  },
  storePanelButtonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))

export default function StorePanel(props) {
  const classes = useStyles();
  const { web3, accounts, contract } = props.web3States;
  const { isLoading, setIsLoading } = props.isLoadingPair;
  const [myStoresIDList, setMyStoresIDList] = useState([]);
  const [currentStoreIndex, setCurrentStoreIndex] = useState(0);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  const [storeID, setStoreID] = useState(0);
  const [storeName, setStoreName] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [cityName, setCityName] = useState("");
  const [moreInfo, setMoreInfo] = useState("");
  const [menuString, setMenuString] = useState("");
  const [storeTitle, setStoreTitle] = useState("");
  const [storeOrderIDs, setStoreOrderIDs] = useState([]);

  const load_my_storeIDs = async () => {
    if (contract === null) {
      return;
    }
    setIsLoading(true);
    console.log("loading my stores...");

    var _myStoreIDList = [];
    await contract.methods.AddressGetStoreID().call({ from: accounts[0] })
      .then((idArray) => {
        _myStoreIDList = idArray.map((_idString) => { return parseInt(_idString, 10); });
        setMyStoresIDList(_myStoreIDList);
      });

    console.log("loaded. StoreList: ", _myStoreIDList);
    if (!myStoresIDList.length) {
      console.log("there are no store at all.")
      return;
    }
    setIsLoading(false);
    await load_store_by_storeID();
  }

  const load_store_by_storeID = async () => {
    if (!myStoresIDList.length) {
      return;
    }
    var _storeID = myStoresIDList[currentStoreIndex]
    setStoreID(_storeID);
    if (_storeID === 0) {
      console.log("storeID is zero")
      return;
    }
    setIsLoading(true);
    console.log("loading store ", _storeID);
    await contract.methods.StoreIDGetStoreDetail(_storeID)
      .call({ from: accounts[0] })
      .then((Result) => {
        console.log("Store ", _storeID, " details: ", Result);
        setStoreID(Result[0]);
        setOwnerAddress(Result[1]);
        setStoreName(Result[2]);
        setStoreTitle("Edit " + Result[2]);
        setCityName(Result[3]);
        setMoreInfo(Result[4]);
        setMenuString(Result[5]);
      })
    await contract.methods.GetOrderbyStoreID(_storeID)
      .call({ from: accounts[0] })
      .then((Result) => {
        console.log("Store ", _storeID, " Orders: ", Result);
        var _storeOrderIDs = Result.map((_idString) => { return parseInt(_idString, 10); })
        setStoreOrderIDs(_storeOrderIDs);
      })
    console.log("loaded store ", _storeID);
    setIsLoading(false);
  }

  const handleSaveChanges = async () => {
    // expect: send to contract, then refresh. may need a loading animation
    setIsSavingChanges(true);
    console.log("StoreSetStore(", storeID, ", ", storeName, ", ", cityName, ", ", moreInfo, ", ", menuString, ")");
    await contract.methods.StoreSetStore(storeID.toString(), storeName, cityName, moreInfo, menuString)
      .send({ from: accounts[0], value: Web3.utils.toWei("0.001", "ether") })
      .on("receipt", function (receipt) {
        console.log("StoreSetStore receipt: ", receipt);
      })
      .on("error", function (error) {
        alert(error);
      })
    await load_my_storeIDs();
    setIsSavingChanges(false);
    setIsEditingInfo(false);
  }

  const handleAddStore = () => {
      console.log("Creating new Store!")
      setStoreTitle("Create a new restaurant!")
      setStoreID(0);
      setOwnerAddress("");
      setStoreName("");
      setCityName("");
      setMoreInfo("");
      setMenuString("");
      setIsEditingInfo(true);
    }

  useEffect(() => {
    load_my_storeIDs();
  }, [contract])


  useEffect(() => {
    load_store_by_storeID();
  }, [currentStoreIndex, myStoresIDList])

  return (
    <Box className={classes.storePanelBox}>
      {myStoresIDList.length && (
        <Container className={classes.StorePanelContainer}>
          <Typography variant="h2" className={classes.storePanelStoreTitle}>{"Orders for " + storeName}</Typography>
          <Divider />
          <Grid container spacing={4}>
            {storeOrderIDs.map((id, index) => (
              <Grid item key={id} xs={12} sm={6} md={4}>
                <StoreSingleOrder
                  orderID={id}
                  isLoadingPair={props.isLoadingPair}
                  web3States={props.web3States}
                  menuString={menuString}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
      <Dialog open={isEditingInfo}
        onClose={() => {
          setIsEditingInfo(false);
          load_my_storeIDs();
        }}
      >
        <Box className={classes.storePanelTitle}>
          <Typography variant="h3">{storeTitle}</Typography>
        </Box>
        <Divider />
        <Box className={classes.storePanelDetails}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="storeName"
                name="storeName"
                label="Store Name"
                value={storeName}
                fullWidth
                variant="outlined"
                onChange={(event) => { setStoreName(event.target.value) }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="cityName"
                name="cityName"
                label="City"
                value={cityName}
                fullWidth
                variant="outlined"
                onChange={(event) => { setCityName(event.target.value) }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="moreInfo"
                name="moreInfo"
                label="More Information"
                value={moreInfo}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                onChange={(event) => { setMoreInfo(event.target.value) }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="menu"
                name="menu"
                label="Menu (separate with new lines)"
                value={menuString}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                onChange={(event) => { setMenuString(event.target.value) }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.storePanelButtonBox}>
          <Box className={classes.storePanelButtonWrapper}>
            <Button
              variant="contained"
              color='primary'
              onClick={handleSaveChanges}
              disabled={isSavingChanges}
            >
              Save Changes
              </Button>
            {isSavingChanges && <CircularProgress size={24} className={classes.storePanelButtonProgress} />}
          </Box>
        </Box>
      </Dialog>
      <Box className={classes.storePanelFabsBox}>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.storePanelFab}
          onClick={handleAddStore}
        >
          <Add />
        </Fab>
        <Fab
          color="primary"
          aria-label="next store"
          className={classes.storePanelFab}
          disabled={currentStoreIndex === myStoresIDList.length - 1}
          onClick={() => { setCurrentStoreIndex(currentStoreIndex + 1) }}
        >
          <ArrowForward />
        </Fab>
        <Fab
          color="primary"
          aria-label="current store"
          className={classes.storePanelFab}
          disabled
        >
          <Typography>{(currentStoreIndex+1) + "/" + myStoresIDList.length}</Typography>
        </Fab>
        <Fab
          color="primary"
          aria-label="prev store"
          className={classes.storePanelFab}
          disabled={currentStoreIndex === 0}
          onClick={() => { setCurrentStoreIndex(currentStoreIndex - 1) }}
        >
          <ArrowBack />
        </Fab>
        <Fab
          color="primary"
          aria-label="edit store info"
          className={classes.storePanelFab}
          disabled={!myStoresIDList.length}
          onClick={() => { setIsEditingInfo(true) }}
        >
          <Edit />
        </Fab>
      </Box>
    </Box>
  )
}
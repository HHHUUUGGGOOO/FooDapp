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
import { RateWideBar } from "./Rate";

import SingleOrder from "./SingleOrder";
import { useStylesForOrdersPage, TitleWithBigTail } from "./Utils";

const useStyles = makeStyles((theme) => ({
  storePanelTitle: {
    display: 'flex',
    alignItems: 'baseline',
  },
  storePanelTitleFirst: {
    marginRight: theme.spacing(2),
  },
  storeDialogPaper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    minWidth: "500px",
  },
  storeDialogTitle: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(0),
  },
  storeDialogDetails: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
  },
  storeDialogMenu: {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  storeDialogPriceGrid: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  storeDialogPriceBox: {
    display: 'flex',
  },
  storeDialogAddItemButton: {
    height: '100%',
    width: '100%',
  },
  storeDialogButtonBox: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  storeDialogButtonWrapper: {
    position: 'relative',
  },
  storeDialogButtonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))

export default function StorePanel(props) {
  const classes = useStyles();
  const classesP = useStylesForOrdersPage();
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
  const [itemsPrice, setItemsPrice] = useState([]);
  const [menuArray, setMenuArray] = useState([]);

  const [storeTitle, setStoreTitle] = useState("");
  const [storeOrderIDs, setStoreOrderIDs] = useState([]);
  const [rateArray, setRateArray] = useState([0, 0, 0, 0, 0]);

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
        _myStoreIDList.push(0);
        setMyStoresIDList(_myStoreIDList);
      });

    console.log("loaded. StoreList: ", _myStoreIDList);
    if (myStoresIDList.length === 1) {
      console.log("there are no store at all.");
      setIsEditingInfo(true);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    await load_store_by_storeID();
  }
  const load_store_by_storeID = async () => {
    if (contract === null) {
      return;
    }
    if (!myStoresIDList.length) {
      return;
    }
    var _storeID = myStoresIDList[currentStoreIndex]
    setStoreID(_storeID);
    if (_storeID === 0) {
      console.log("Creating new store ...")
      setStoreName("");
      setOwnerAddress(accounts[0]);
      setCityName("");
      setMoreInfo("");
      setMenuString("");
      setItemsPrice([]);
      setMenuArray([]);
      setStoreTitle("Create New Store!");
      setStoreOrderIDs([]);
      setRateArray([0, 0, 0, 0, 0]);
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
        setMenuArray(Result[5].split("\n"));
        setItemsPrice(Result[6]);
      })
    await contract.methods.GetOrderbyStoreID(_storeID)
      .call({ from: accounts[0] })
      .then((Result) => {
        console.log("Store ", _storeID, " Orders: ", Result);
        var _storeOrderIDs = Result.map((_idString) => { return parseInt(_idString, 10); })
        setStoreOrderIDs(_storeOrderIDs);
      })
    await contract.methods.StoreIDGetRate(_storeID)
      .call({ from: accounts[0] })
      .then((result) => {
        var i = 0, _array=[];
        for (i = 0; i < 5; i++) {
          _array.push(result[i]);
        }
        setRateArray(_array);
      })
    console.log("loaded store ", _storeID);
    setIsLoading(false);
  }
  const handleModifyMenuItem = async (event, index) => {
    console.log(menuArray);
    console.log(itemsPrice);
    let temMenuArray = menuArray;
    temMenuArray[index] = event.target.value;
    setMenuArray(temMenuArray);
    let temMenuString = ""
    for (let i = 0; i < temMenuArray.length; i++) {
      temMenuString += temMenuArray[i];
      if (i !== temMenuArray.length - 1) {
        temMenuString += "\n";
      }
    }
    console.log(temMenuString);
    setMenuString(temMenuString);
    // TODO
    // if index = -1, it is going to be a new one
    // when empty, delete the item
  }
  const handleModifyMenuPrice = async (event, index) => {
    console.log(menuArray);
    console.log(itemsPrice);
    console.log(itemsPrice);
    let temitemsPrice = [...itemsPrice];

    temitemsPrice[index] = event.target.value.toString();
    setItemsPrice(temitemsPrice);
    // TODO
    // with error handle
  }
  const handleModifyMenuPair = (event, index) => {
    setItemsPrice([...itemsPrice, ""]);
    setMenuArray([...menuArray, ""]);
  }
  const handleSaveChanges = async () => {
    // TODO: should handle menu items and prices
    // expect: send to contract, then refresh. may need a loading animation
    setIsSavingChanges(true);
    let parse = menuArray.indexOf("");
    let temMenuArray = menuArray.slice(0, parse);
    console.log(menuArray);
    console.log(temMenuArray);
    parse = itemsPrice.indexOf("");
    let temItemsPrice = itemsPrice.slice(0, parse);
    console.log(itemsPrice);

    console.log("StoreSetStore(", storeID, ", ", storeName, ", ", cityName, ", ", moreInfo, ", ", menuArray, ", ", itemsPrice, ")");
    await contract.methods.StoreSetStore(storeID.toString(), storeName, cityName, moreInfo, menuString, itemsPrice)
      .send({ from: accounts[0], value: Web3.utils.toWei("0.001", "ether") })
      .on("receipt", function (receipt) {
        console.log("StoreSetStore receipt: ", receipt);
        load_my_storeIDs();
        setIsSavingChanges(false);
        setIsEditingInfo(false);
      })
      .on("error", function (error) {
        alert(error);
        setIsSavingChanges(false);
      })
  }
  const handleAddStore = () => {
    setCurrentStoreIndex(myStoresIDList.length - 1);
    // console.log("Creating new Store!")
    // setStoreTitle("Create a new restaurant!")
    // setStoreID(0);
    // setOwnerAddress("");
    // setStoreName("");
    // setCityName("");
    // setMoreInfo("");
    // setMenuString("");
    setIsEditingInfo(true);
    // let parse = menuArray.indexOf("");
    // let newMenuArray = menuArray.slice(0, parse);
    // parse = itemsPrice.indexOf("");
    // let newitemsPrice = itemsPrice.slice(0, parse);
    // setMenuArray(newMenuArray);
    // setItemsPrice(newitemsPrice);
  }
  const test = () => {
    console.log("aaaa");
    setMenuArray([]);
    setItemsPrice([]);
  }

  useEffect(() => {
    load_my_storeIDs();
  }, [contract])

  useEffect(() => {
    load_store_by_storeID();
  }, [currentStoreIndex, myStoresIDList])

  return (
    <Box className={classesP.panelBox}>
      {myStoresIDList.length && (
        <Container className={classesP.panelContainer}>
          <Box className={classesP.panelTitle}>
            <Box className={classes.storePanelTitle}>
              <Typography variant='h4' className={classesP.marginRight2}>{"Orders for"}</Typography>
              <Typography variant='h2'>{storeName}</Typography>
            </Box>
            <Typography>{moreInfo}</Typography>
          </Box>
          <RateWideBar id={storeID + "rates"} rateArray={rateArray} />
          <Divider />
          <Grid container spacing={4} className={classesP.panelOrders}>
            {storeOrderIDs.map((id, index) => (
              <Grid item key={id} xs={12} sm={6} md={4}>
                <SingleOrder
                  orderID={id}
                  isLoadingPair={props.isLoadingPair}
                  web3States={props.web3States}
                  menuString={menuString}
                  parentIs="Store"
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
      <Dialog open={isEditingInfo}
        onClose={() => {
          if (currentStoreIndex === myStoresIDList.length - 1 && currentStoreIndex >= 1){
            setCurrentStoreIndex(currentStoreIndex - 1);
          }
          setIsEditingInfo(false);
          // load_my_storeIDs();
        }}
      >
        <Box className={classes.storeDialogTitle}>
          <Typography variant="h3">{storeTitle}</Typography>
        </Box>
        <Divider />
        <Box className={classes.storeDialogDetails}>
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
          </Grid>
        </Box>
        <Divider />
        <Box className={classes.storeDialogMenu}>
          <Grid container direction='column' spacing={1}>
            <Grid item container spacing={3} id="-1" >
              <Grid item xs={8}>
                <Typography variant="h5">Dish</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h5">Price</Typography>
              </Grid>
            </Grid>
            {menuArray.map((item, index) => (
              <Grid item container spacing={3} id={index} >
                <Grid item xs={8} className={classes.storeDialogPriceGrid}>
                  <TextField fullWidth multiline variant="standard"
                    defaultValue={item}
                    onChange={(event) => { handleModifyMenuItem(event, index) }}
                  />
                </Grid>
                <Grid item xs className={classes.storeDialogPriceGrid}>
                  <Box className={classes.storeDialogPriceBox}>
                    <Typography className={classesP.marginRight1} variant="h6" >$</Typography>
                    <TextField fullWidth multiline variant="standard"
                      defaultValue={itemsPrice[index]}
                      onChange={(event) => { handleModifyMenuPrice(event, index) }}
                    />
                  </Box>
                </Grid>
              </Grid>
            ))}
            <Grid item container spacing={3} id={-1} >
              {/* <Grid item xs={8} className={classes.storeDialogPriceGrid}>
                <TextField fullWidth multiline variant="standard" placeholder="New dish"
                  // onChange={(event)=>{ setNewMenuItemStr(event.target.value) }}
                />
              </Grid> */}
              <Grid item xs>
                <Button onClick={(event) => { handleModifyMenuPair(event, -1) }} variant='outlined' className={classes.storeDialogAddItemButton}>
                  <Add className={classesP.marginRight1} />
                  Add
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.storeDialogButtonBox}>
          <Box className={classes.storeDialogButtonWrapper}>
            <Button
              variant="contained"
              color='primary'
              onClick={handleSaveChanges}
              disabled={isSavingChanges}
            >
              Save Changes
            </Button>
            {isSavingChanges && <CircularProgress size={24} className={classes.storeDialogButtonProgress} />}
          </Box>
        </Box>
      </Dialog>
      <Box className={classesP.fabsBox}>
        <Fab
          color="primary"
          aria-label="add"
          className={classesP.fab}
          onClick={handleAddStore}
        >
          <Add />
        </Fab>
        <Fab
          color="primary"
          aria-label="next store"
          className={classesP.fab}
          disabled={currentStoreIndex >= myStoresIDList.length - 2}
          onClick={() => { setCurrentStoreIndex(currentStoreIndex + 1) }}
        >
          <ArrowForward />
        </Fab>
        <Fab
          color="primary"
          aria-label="current store"
          className={classesP.fab}
          disabled
        >
          <Typography>{(currentStoreIndex + 1) + "/" + (myStoresIDList.length - 1)}</Typography>
        </Fab>
        <Fab
          color="primary"
          aria-label="prev store"
          className={classesP.fab}
          disabled={currentStoreIndex <= 0}
          onClick={() => { setCurrentStoreIndex(currentStoreIndex - 1) }}
        >
          <ArrowBack />
        </Fab>
        <Fab
          color="primary"
          aria-label="edit store info"
          className={classesP.fab}
          disabled={!myStoresIDList.length}
          onClick={() => { setIsEditingInfo(true) }}
        >
          <Edit />
        </Fab>
      </Box>
    </Box>
  )
}
import {
  Box,
  Button,
  CircularProgress,
  Container, Dialog, DialogContent, DialogTitle, Divider, Grid, LinearProgress, makeStyles, Paper,
  TextField, ThemeProvider, Typography
} from "@material-ui/core";
import { useEffect, useState } from "react";
import Web3 from 'web3'

const useStyles = makeStyles((theme) => ({
  storePanelContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 700,
    flexGrow: 1,
  },
  storePanelPaper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
  storePanelTitle: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    // paddingBottom: theme.spacing(5),
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
  const set_is_loading = props.setIsLoading;
  const { web3, accounts, contract } = props.web3States;
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const myStore = {
    storeID: 1,
    ownerAddress: "0xC27a5270dCd16Ca93145ca54b67014A4F5BFF0c1",
    storeName: "I'm Pasta",
    cityName: "Taipei",
    moreInfo: "Free drink for NTU students!",
    menu: [
      "Spaghetti with chicken white sauce",
      "Conchiglie with meat sauce"
    ],
    PeopleNumRateTheStar: {
      1: 10,
      2: 6,
      3: 16,
      4: 35,
      5: 60
    }
  };
  const [myStoreList, setMyStoreList] = useState([]);
  const [storeID, setStoreID] = useState(0);
  const [storeName, setStoreName] = useState(myStore.storeName);
  const [ownerAddress, setOwnerAddress] = useState(myStore.ownerAddress);
  const [cityName, setCityName] = useState(myStore.cityName);
  const [moreInfo, setMoreInfo] = useState(myStore.moreInfo);
  const [menuString, setMenuString] = useState(myStore.menu.join("\n"));

  const Loading = async () => {
    set_is_loading(true);
    // expect loading...
    console.log("loading...")
    console.log(props.web3States.contract)
    var _storeIDArray = await contract.methods.AddressGetStoreID().call()
      .then(console.log());
    console.log(_storeIDArray);
    // setMyStoreList(_storeIDArray.map((storeID)=>{}))
    // setMyStoreList([myStore]);
    console.log("loaded.")
    set_is_loading(false);
  }

  useEffect(async () => {
    await Loading();
  }, [])


  const handleSaveChanges = async () => {
    // expect: send to contract, then refresh. may need a loading animation
    setIsSavingChanges(true);
    await contract.methods.StoreSetStore(storeID, storeName, cityName, moreInfo, menuString)
      .send({ from: accounts[0], value: Web3.utils.toWei("0.001", "ether") })
      .on("receipt", function(receipt) {
        Loading();
      })
      .on("error", function(error) {
        alert(error);
      })

    setIsSavingChanges(false);
  }

  return (
    <div>
      {/* <Container className={classes.storePanelContainer}> */}
      {myStoreList.map((myStore) => (
        <Paper className={classes.storePanelPaper}>
          <Box className={classes.storePanelTitle}>
            <Typography variant="h3" gutterBottom align="center">Edit Store Information</Typography>
            {/* </ Box>
            <Box className={classes.storePanelDetails}> */}
            <TextField
              disabled
              value={myStore.storeID}
              id="storeID"
              name="storeID"
              label="Store ID"
              fullWidth
              variant="outlined"
            />
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
                  defaultValue={myStore.storeName}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="cityName"
                  name="cityName"
                  label="City"
                  defaultValue={myStore.cityName}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="moreInfo"
                  name="moreInfo"
                  label="More Information"
                  defaultValue={myStore.moreInfo}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="menu"
                  name="menu"
                  label="Menu (separate with new lines)"
                  defaultValue={myStore.menuString}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
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
        </Paper>
      ))}
      <Dialog open={myStoreList.length === 0}>
        <DialogTitle>Register your store!</DialogTitle>
        <DialogContent>
          <Box className={classes.storePanelDetails}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="storeName"
                  name="storeName"
                  label="Store Name"
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
        </DialogContent>
      </Dialog>
    </div>
  )
}
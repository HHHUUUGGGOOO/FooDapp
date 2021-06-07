import {
  Box, Button, CircularProgress, Divider, Grid, 
  makeStyles, Paper, TextField, Typography
} from "@material-ui/core";
import { useEffect, useState } from "react";
import Web3 from 'web3'

const useStyles = makeStyles((theme) => ({
  storePanelPaper: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    minWidth: "500px",
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

export default function StorePage(props) {
  const classes = useStyles();
  const { isLoading, setIsLoading } = props.isLoadingPair;
  const { web3, accounts, contract } = props.web3States;
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  const [storeID, setStoreID] = useState(props.storeID);
  const [storeName, setStoreName] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [cityName, setCityName] = useState("");
  const [moreInfo, setMoreInfo] = useState("");
  const [menuString, setMenuString] = useState("");
  const [storeTitle, setStoreTitle] = useState("")

  const load_store_by_storeID = async () => {
    if (storeID === 0) {
      setStoreTitle("Create a new restaurant!")
      return;
    }
    setIsLoading(true);
    console.log("loading store details...");
    console.log(storeID);
    await contract.methods.StoreIDGetStoreDetail(storeID)
      .call({ from: accounts[0] })
      .then((Result) => {
        console.log("_returnObject: ", Result)
        setStoreID(Result[0]);
        setOwnerAddress(Result[1]);
        setStoreName(Result[2]);
        setStoreTitle("Edit "+Result[2]);
        setCityName(Result[3]);
        setMoreInfo(Result[4]);
        setMenuString(Result[5]);
      })
    console.log("loaded.")
    setIsLoading(false);
  }

  useEffect(() => {
    load_store_by_storeID();
  }, [])

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
    setStoreID()
    await load_store_by_storeID();
    setIsSavingChanges(false);
  }

  return (
    <Paper className={classes.storePanelPaper}>
      <Box className={classes.storePanelTitle}>
        <Typography variant="h3" gutterBottom align="center">{storeTitle}</Typography>
        <TextField
          disabled
          value={storeID}
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
    </Paper>
  )
}
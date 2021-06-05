import {
  Box,
  Button,
  CircularProgress,
  Container, Divider, Grid, LinearProgress, makeStyles, Paper,
  TextField, ThemeProvider, Typography
} from "@material-ui/core";
import { useEffect, useState } from "react";

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
  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // const setIsLoading = props.setIsLoading;
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
  const [myStoreList, setMyStoreList] = useState([myStore]);
  const [storeName, setStoreName] = useState(myStore.storeName);
  const [ownerAddress, setOwnerAddress] = useState(myStore.ownerAddress);
  const [cityName, setCityName] = useState(myStore.cityName);
  const [moreInfo, setMoreInfo] = useState(myStore.moreInfo);
  const [menuString, setMenuString] = useState(myStore.menu.join("\n"));

  const Loading = async () => {
    setIsLoading(true);
    // expect loading...
    console.log("loading...")
    await new Promise(r => setTimeout(r, 2000));
    // setMyStoreList([myStore]);
    console.log("loaded.")
    setIsLoading(false);
  }

  useEffect(async ()=>{
    await Loading();
    console.log("trying to load...")
  }, [])

  const handleSaveChanges = async () => {
    // expect: send to contract, then refresh. may need a loading animation
    setIsSavingChanges(true);
    await new Promise(r => setTimeout(r, 2000));
    Loading();
    setIsSavingChanges(false);
  }

  return (
    <div>
      {isLoading && <LinearProgress />}
      <Container className={classes.storePanelContainer}>
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
      </Container>
    </div>
  )
}
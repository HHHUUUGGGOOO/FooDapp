import {
  Box,
  Button,
  Container, Divider, Grid, makeStyles, Paper,
  TextField, ThemeProvider, Typography
} from "@material-ui/core";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  storePanelContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 700,
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
  }
}))

export default function StorePanel() {
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(true);
  const yourStore = {
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
  const [storeName, setStoreName] = useState(yourStore.storeName);
  const [ownerAddress, setOwnerAddress] = useState(yourStore.ownerAddress);
  const [cityName, setCityName] = useState(yourStore.cityName);
  const [moreInfo, setMoreInfo] = useState(yourStore.moreInfo);
  const [menuString, setMenuString] = useState(yourStore.menu.join("\n"));

  const handleSaveChanges = () => {}

  return (
    <Container className={classes.storePanelContainer}>
      {isEditing ? (
        <Paper className={classes.storePanelPaper}>
          <Box className={classes.storePanelTitle}>
            <Typography variant="h3" gutterBottom align="center">Edit Store Information</Typography>
          {/* </ Box>
          <Box className={classes.storePanelDetails}> */}
            <TextField
              disabled
              value={yourStore.storeID}
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
                  defaultValue={yourStore.storeName}
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
                  defaultValue={yourStore.cityName}
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
                  defaultValue={yourStore.moreInfo}
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
                  defaultValue={yourStore.menuString}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>
          <Box className={classes.storePanelButtonBox}>
            <Button
              variant="contained"
              color='primary'
            >
              Save Changes
            </Button>
          </Box>
        </Paper>
      ) : (
        <Paper>
          <div className={classes.storePanelTitle}>
            <Typography variant="h1">{yourStore.storeName}</Typography>
            <Typography variant="subtitle1">{yourStore.moreInfo}</Typography>
          </div>
          <Divider />
          <div className={classes.storePanelDetails}>
            <Typography variant="h4">{"storeID: " + yourStore.storeID}</Typography>
            <Typography variant="h4">{"owner:   " + yourStore.ownerAddress}</Typography>
            <Typography variant="h4">{"city:    " + yourStore.cityName}</Typography>
            <Typography variant="h4">Menu:    </Typography>
            {yourStore.menu.map((item) => (
              <Typography variant="body1">{"🥡 " + item}</Typography>
            ))}
          </div>
        </Paper>
      )}
    </Container>
  )
}
import { Container, Divider, makeStyles, Paper, Typography } from "@material-ui/core";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  customerPageContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  customerPageStorePaper: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
  customerPageStoreInfoSection: {
    margin: theme.spacing(1),
  },
  customerPageStoreMenuSection: {
    margin: theme.spacing(1),
  }
}));

export default function CustomerPage() {
  const classes = useStyles();
  const city = "Taipei";
  const [storeList, setStoreList] = useState([
    {
      storeID: 1,
      storeName: "I'm Pasta",
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
    },
    {
      storeID: 2,
      storeName: "Smile Kitchen",
      moreInfo: "Free Soup, drinks, and ice cream!",
      menu: [
        "Spaghetti with chicken white sauce",
        "Spaghetti with meat sauce"
      ],
      PeopleNumRateTheStar: {
        1: 10,
        2: 6,
        3: 16,
        4: 35,
        5: 60
      }
    },
    {
      storeID: 3,
      storeName: "Discovery",
      moreInfo: "Free soup, and drink!",
      menu: [
        "Conchiglie with chicken white sauce",
        "Conchiglie with meat sauce"
      ],
      PeopleNumRateTheStar: {
        1: 10,
        2: 6,
        3: 16,
        4: 35,
        5: 60
      }
    }
  ]);

  return (
    <Container className={classes.customerPageContainer}>
      {storeList.map((store) => (
        <Paper className={classes.customerPageStorePaper}>
          <div className={classes.customerPageStoreInfoSection}>
            <Typography variant="h5">{store.storeName}</Typography>
            <Typography variant="subtitle2">{store.moreInfo}</Typography>
          </div>
          <Divider />
          <div className={classes.customerPageStoreMenuSection}>
            {store.menu.map((item) => (
              <Typography variant="body1">{"🥡 "+item}</Typography>
            ))}
          </div>
        </Paper>
      ))}
    </Container>
  )
}
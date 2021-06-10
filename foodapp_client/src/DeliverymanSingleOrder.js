import {
  Box, Button, CircularProgress, Divider, Grid,
  makeStyles, Paper, Typography
} from "@material-ui/core";
import { useEffect, useState } from "react";
import Web3 from 'web3'

const useStyles = makeStyles((theme) => ({
  DeliverymanOrderPaper: {
  },
  DeliverymanOrderTitle: {
    padding: theme.spacing(2),
  },
  DeliverymanOrderMenu: {
    padding: theme.spacing(2),
  },
  DeliverymanOrderFooterBox: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  DeliverymanOrderButtonWrapper: {
    position: 'relative',
  },
  DeliverymanOrderButtonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))

export default function DeliverymanSingleOrder(props) {
  const classes = useStyles();
  const { isLoading, setIsLoading } = props.isLoadingPair;
  const { web3, accounts, contract } = props.web3States;
  const [isTakingOrder, setIsTakingOrder] = useState(false);

  const [storeName, setStoreName] = useState("I'm Pasta");
  const [cityName, setCityName] = useState("Taipei");
  const [menuString, setMenuString] = useState("Meal a\nMeal b\nCake c\nDessert d\nSalad e\nDrink f");

  const [setTime, setSetTime] = useState("Just now");
  const [orderID, setOrderID] = useState(1)
  const [storeID, setStoreID] = useState(1);
  const [itemsID, setItemsID] = useState([1, 2, 4, 5]);
  const [itemsNumber, setItemsNumber] = useState([1, 2, 2, 1]);
  const [menuArray, setMenuArray] = useState(menuString.split("\n"))
  const [tipMulti, setTipMulti] = useState(5);

  const load_order_basic_info_by_orderID = async () => {
    // if (storeID === 0) {
    //   setStoreTitle("Create a new restaurant!")
    //   return;
    // }
    setIsLoading(true);
    console.log("loading order basic info...");
    // console.log(storeID);
    // await contract.methods.StoreIDGetStoreDetail(storeID)
    //   .call({ from: accounts[0] })
    //   .then((Result) => {
    //     console.log("_returnObject: ", Result)
    //     setStoreID(Result[0]);
    //     setOwnerAddress(Result[1]);
    //     setStoreName(Result[2]);
    //     setStoreTitle("Edit "+Result[2]);
    //     setCityName(Result[3]);
    //     setMoreInfo(Result[4]);
    //     setMenuString(Result[5]);
    //   })
    console.log("loaded.")
    setIsLoading(false);
  }

  useEffect(() => {
    load_order_basic_info_by_orderID();
  }, [])

  const handleTakeOrder = async () => {
    // expect: send to contract, then refresh. may need a loading animation
    setIsTakingOrder(true);
    // console.log("StoreSetStore(", storeID, ", ", storeName, ", ", cityName, ", ", moreInfo, ", ", menuString, ")");
    // await contract.methods.StoreSetStore(storeID.toString(), storeName, cityName, moreInfo, menuString)
    //   .send({ from: accounts[0], value: Web3.utils.toWei("0.001", "ether") })
    //   .on("receipt", function (receipt) {
    //     console.log("StoreSetStore receipt: ", receipt);
    //   })
    //   .on("error", function (error) {
    //     alert(error);
    //   })
    // setStoreID()
    await load_order_basic_info_by_orderID();
    setIsTakingOrder(false);
  }

  return (
    <Paper className={classes.DeliverymanOrderPaper}>
      <Box className={classes.DeliverymanOrderTitle}>
        <Typography variant="h3" gutterBottom>{storeName}</Typography>
        <Typography variant="subtitle1">{cityName}</Typography>
        <Typography variant="subtitle1">{setTime}</Typography>
      </Box>
      <Divider />
      <Box className={classes.DeliverymanOrderMenu}>
        {itemsID.map((itemID, index) => (
          <Grid container xs={12} spacing={1}>
            <Grid item xs={12} sm={9}>
              <Typography>{menuArray[itemID]}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography align="right">{itemsNumber[index]}</Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
      <Divider />
      <Box className={classes.DeliverymanOrderFooterBox}>
        <Typography variant="h5">{"Tips: $ " + tipMulti.toString()}</Typography>
        <Box className={classes.DeliverymanOrderButtonWrapper}>
          <Button
            variant="contained"
            color='primary'
            onClick={handleTakeOrder}
            disabled={isTakingOrder}
          >
            Take This !
            </Button>
          {isTakingOrder && <CircularProgress size={24} className={classes.DeliverymanOrderButtonProgress} />}
        </Box>
      </Box>
    </Paper>
  )
}
import {
  Box, Button, CircularProgress, Divider, Grid,
  makeStyles, Paper, Typography
} from "@material-ui/core";
import { useEffect, useState } from "react";
import Web3 from 'web3'

const useStyles = makeStyles((theme) => ({
  storeOrderPaper: {
  },
  storeOrderTitle: {
    padding: theme.spacing(2),
  },
  storeOrderMenu: {
    padding: theme.spacing(2),
  },
  storeOrderFooterBox: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  storeOrderButtonsBox: {
    
  },
  storeOrderButtonWrapper: {
    position: 'relative',
  },
  storeOrderButtonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))

export default function StoreSingleOrder(props) {
  const classes = useStyles();
  const { isLoading, setIsLoading } = props.isLoadingPair;
  const { web3, accounts, contract } = props.web3States;
  const [isConfirming, setIsConfirming] = useState(false);

  const [setTime, setSetTime] = useState("Just now");
  const [orderID, setOrderID] = useState(props.orderID)
  const [storeID, setStoreID] = useState(0);
  const [itemsNumber, setItemsNumber] = useState([1, 2, 2, 1]);
  const [menuArray, setMenuArray] = useState(props.menuString.split("\n"));
  const [tipMulti, setTipMulti] = useState(5);

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDelivering, setIsDelivering] = useState(false);
  const [deliverymanAddr, setDeliverymanAddr] = useState("")

  const load_order_by_orderID = async () => {
    setIsLoading(true);
    console.log("loading order", orderID);
    await contract.methods.OrderIDGetOrderBasicInfo(orderID)
      .call({ from: accounts[0] })
      .then((Result) => {
        console.log("Order: ", Result)
        setSetTime(Result[0]);
        setOrderID(Result[1]);
        setStoreID(Result[2]);
        setItemsNumber(Result[3]);
        setTipMulti(Result[4]);
      })
    await contract.methods.OrderIDGetOrderConditionAndOwner(orderID)
      .call({ from: accounts[0] })
      .then((Result) => {
        console.log("Order Status: ", Result)
        setIsConfirmed(Result[0]);
        setIsDelivering(Result[1]);
        setDeliverymanAddr(Result[5]);
      })
  console.log("loaded.")
    setIsLoading(false);
  }

  useEffect(() => {
    load_order_by_orderID();
  }, [])

  const handleConfirm = async () => {
    // expect: send to contract, then refresh. may need a loading animation
    setIsConfirming(true);
    // console.log("StoreSetStore(", storeID, ", ", storeName, ", ", cityName, ", ", moreInfo, ", ", menuString, ")");
    await contract.methods.StoreSetOrderConfirm(orderID)
      .send({ from: accounts[0] })
      .on("receipt", function (receipt) {
        console.log("Confirmed: ", receipt);
      })
      .on("error", function (error) {
        alert("Confirm error:", error);
        // setIsConfirming(false);
      })
    // setStoreID()
    load_order_by_orderID();
    setIsConfirming(false);
  }

  return (
    <Paper className={classes.storeOrderPaper}>
      <Box className={classes.storeOrderTitle}>
        <Typography variant="h3">{setTime}</Typography>
        {/* <Typography variant="subtitle1">{deliverymanAddr}</Typography> */}
      </Box>
      <Divider />
      <Box className={classes.storeOrderMenu}>
        {menuArray.map((item, index) => (
          <Grid container xs={12} spacing={1}>
            <Grid item xs={12} sm={9}>
              <Typography>{item}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography align="right">{itemsNumber[index]}</Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
      <Divider />
      <Box className={classes.storeOrderFooterBox}>
        <Typography variant="h5">{"Tips: $ " + tipMulti.toString()}</Typography>
        {isDelivering && (
          <Typography>Delivering...</Typography>
        )}
        <Box>
          <Box className={classes.storeOrderButtonWrapper}>
            <Button
              variant="contained"
              color='primary'
              onClick={handleConfirm}
              disabled={isConfirming || isConfirmed}
            >
              Confirm
              </Button>
            {isConfirming && <CircularProgress size={24} className={classes.storeOrderButtonProgress} />}
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}
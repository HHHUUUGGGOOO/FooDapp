import {
  Box, Button, CircularProgress, Divider, Grid,
  makeStyles, Paper, Dialog, Typography
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { useEffect, useState } from "react";
import { RatingDialogContent } from "./Rate";

const useStyles = makeStyles((theme) => ({
  orderPaper: {
  },
  orderTitle: {
    padding: theme.spacing(2),
  },
  orderMenu: {
    padding: theme.spacing(2),
  },
  orderMenuItemsGrid: {
  },
  orderFinalInfos: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  orderFooterBox: {
    padding: theme.spacing(2),
    display: 'flex',
    // justifyContent: 'space-between',
    justifyContent: 'flex-end'
  },
  orderButtonWrapper: {
    position: 'relative',
    marginLeft: theme.spacing(1),
  },
  orderButtonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  rateBox: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateRowBox: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

export default function SingleOrder(props) {
  const classes = useStyles();
  const { isLoading, setIsLoading } = props.isLoadingPair;
  const { web3, accounts, contract } = props.web3States;
  const [isConfirming, setIsConfirming] = useState(false);
  const [isTakingOrder, setIsTakingOrder] = useState(false);
  const [isDeliveringOrder, setIsDeliveringOrder] = useState(false);

  const myOrderChart = props.myOrderChart;
  const parentIs = props.parentIs;
  const [menuArray, setMenuArray] = useState([]);
  const [itemsPrice, setItemsPrice] = useState([])
  const [storeName, setStoreName] = useState([]);
  // const [setTime, setSetTime] = useState(0);
  const [setTimeInt     , setSetTimeInt     ] = useState(0);
  const [orderID        , setOrderID        ] = useState(props.orderID)
  const [storeID        , setStoreID        ] = useState(0);
  const [itemsNumber    , setItemsNumber    ] = useState([1, 2, 2, 1]);
  const [tipMulti       , setTipMulti       ] = useState(5);
  const [totalPrice     , setTotalPrice     ] = useState(0);

  const [isConfirmed    , setIsConfirmed    ] = useState(false);
  const [isDelivering   , setIsDelivering   ] = useState(false);
  const [isDelivered    , setIsDelivered    ] = useState(false);
  const [isReceived     , setIsReceived     ] = useState(false);
  const [userAddr       , setUserAddr       ] = useState("");
  const [deliverymanAddr, setDeliverymanAddr] = useState("");
  const [targetPlace, setTargetPlace] = useState("");

  const [isToRate, setIsToRate] = useState(false);

  const [passedTime, setPassedTime] = useState("");

  const load_order_by_orderID = async () => {
    setIsLoading(true);
    console.log("loading order", orderID);
    let Result = await contract.methods.OrderIDGetOrderBasicInfo(orderID).call({ from: accounts[0] })
    console.log("Order Detail: ", Result)
    setSetTimeInt(new Date(parseInt(Result[0], 10)));
    setOrderID(Result[1]);
    setStoreID(Result[2]);
    setItemsNumber(Result[3]);
    setTipMulti(Result[4]);
    let itemsnum = Result[3];
    Result = await contract.methods.OrderIDGetOrderConditionAndOwner(orderID).call({ from: accounts[0] })
    console.log("Order Status: ", Result)
    setIsConfirmed(Result[0]);
    setIsDelivering(Result[1]);
    setIsDelivered(Result[2]);
    setIsReceived(Result[3]);
    setUserAddr(Result[4]);
    setDeliverymanAddr(Result[5]);
    let place = await contract.methods.UserAddrGetTargetPlace().call({ from: accounts[0] });
    setTargetPlace(place);
    Result = await contract.methods.StoreIDGetStoreDetail(storeID).call({ from: accounts[0]})
    console.log("Store Detail: ", Result);
    setStoreName(Result[2]);
    setMenuArray(Result[5].split("\n"));
    setItemsPrice(Result[6]);
    let itemsprice = Result[6];
    let totalcost = 0
    for (let i=0;i<itemsnum.length;i++){
      totalcost = totalcost + itemsprice[i]*itemsnum[i]
    }
    setTotalPrice(totalcost);
    console.log("loaded.")
    setIsLoading(false);
  }
  
  const calculateTimePassedAuto = setInterval(() => {
    var timePassed = Date.now()-setTimeInt*1000;
    var sec = (Math.floor(timePassed / 1000)) % 60;
    var min = (Math.floor(timePassed / (60*1000))) % 60;
    var hour = (Math.floor(timePassed / (60*60*1000))) % 24;
    var days = Math.floor(timePassed / (24*60*60*1000))
    setPassedTime(days.toString() + " days, " + hour.toString() + ":" + min.toString())
  }, 1000);

  const myOwnDeliveringChart = async () => {
    
  }

  useEffect(() => {
    load_order_by_orderID();
  }, [storeName, myOrderChart])

  const handleConfirm = async () => {
    // expect: send to contract, then refresh. may need a loading animation
    setIsConfirming(true);
    // console.log("StoreSetStore(", storeID, ", ", storeName, ", ", cityName, ", ", moreInfo, ", ", menuString, ")");
    await contract.methods.StoreSetOrderConfirm(orderID)
      .send({ from: accounts[0] })
      .on("receipt", function (receipt) {
        console.log("Confirmed: ", receipt);
        setIsConfirming(false);
      })
      .on("error", function (error) {
        alert("Confirm error:", error);
        setIsConfirming(false);
      })
    // setStoreID()
    load_order_by_orderID();
  }

  const handleTakeOrder = async () => {
    setIsTakingOrder(true);
    await contract.methods.SetOrderDelivering(orderID)
      .send({ from: accounts[0] })
      .on("receipt", function (receipt) {
        console.log("You are delivering: ", receipt);
        setIsDelivering(true);
      })
      .on("error", function (error) {
        alert("Confirm error:", error);
        setIsTakingOrder(false);
      })
      load_order_by_orderID();
  }

  const handleArrived = async () => {
    console.log(isTakingOrder, isDelivering, isDelivered);
    setIsDeliveringOrder(true);
    await contract.methods.SetOrderDelivered(orderID)
      .send({ from: accounts[0] })
      .on("receipt", function (receipt) {
        console.log("You have arrived");
        setIsDelivered(true);
      })
      .on("error", function (error) {
        alert("Confirm error:", error);
        setIsDeliveringOrder(false);
      })
      load_order_by_orderID();
  }

  const handleRate = async () => {
    console.log("please handle it")
    setIsToRate(true);
  }

  return (
    <Paper className={classes.orderPaper}>
      <Box className={classes.orderTitle}>
        <Typography variant="h3">{storeName}</Typography>
        <Typography variant="subtitle1">{"Time Passed : " + passedTime}</Typography>
        <Typography variant="subtitle1">{"Delivered by: ..." + deliverymanAddr.slice(-8)}</Typography>
        <Typography>Send to: {targetPlace}</Typography>
      </Box>
      <Divider />
      <Box className={classes.orderMenu}>
        {menuArray.map((item, index) => (
          itemsNumber[index]>0 && (
          <Grid container xs={12} spacing={1}>
            <Grid item xs={7} sm={7}>
              <Typography>{item}</Typography>
            </Grid>
            <Grid item xs={5} sm={5}>
              <Typography align="left">{"$ " + itemsPrice[index] + " * " + itemsNumber[index] + " = " + itemsPrice[index]*itemsNumber[index]}</Typography>
            </Grid>
          </Grid>
        )))}
      </Box>
      <Divider />
      <Box className={classes.orderFinalInfos}>
        <Typography variant="h5">{"Tips: $ " + tipMulti.toString()}</Typography>
        <Typography variant="h5">{"Total: $ " + totalPrice.toString()}</Typography>
        <Typography variant="h6">{"Status: " + (
          !isConfirmed? ("Restaurant confirming..."): 
          !isDelivering? ("Waiting for deliveryman..."):
          !isDelivered? ("Deliverying..."):
          !isReceived? ("Delivered."):
          ("Received."))
        }</Typography>
      </Box>
      <Box className={classes.orderFooterBox}>
        {parentIs === 'Store' && (
          <Box className={classes.orderButtonWrapper}>
            <Button
              variant="contained"
              color='primary'
              onClick={handleConfirm}
              disabled={isConfirming || isConfirmed}
            >
              Confirm
            </Button>
            {isConfirming && <CircularProgress size={24} className={classes.orderButtonProgress} />}
          </Box>
        )}
        {(parentIs === 'Deliveryman' && myOrderChart == false) && (
          <Box className={classes.orderButtonWrapper}>
            <Button
              variant="contained"
              color='primary'
              onClick={handleTakeOrder}
              disabled={isTakingOrder || isDelivering}
            >
              Take Order
            </Button>
            {/* {isTakingOrder && <CircularProgress size={24} className={classes.orderButtonProgress} />} */}
          </Box>
        )}
        {parentIs === "Customer" && (
          <Box className={classes.orderButtonWrapper}>
            <Button
              variant="contained"
              color='primary'
              onClick={handleRate}
              disabled={isToRate}
            >
              Rate
            </Button>
            {isToRate && <CircularProgress size={24} className={classes.orderButtonProgress} />}
          </Box>
        )}
        {(parentIs === 'Deliveryman' && myOrderChart == true) && (
          <Box className={classes.orderButtonWrapper}>
            <Button
              variant="contained"
              color='primary'
              onClick={handleArrived}
              disabled={isDelivered}
            >
              arrived
            </Button>
            {isToRate && <CircularProgress size={24} className={classes.orderButtonProgress} />}
          </Box>
        )}
      </Box>
      <Dialog open={isToRate} onClose={() => {setIsToRate(false)}}>
        <RatingDialogContent id={orderID}  web3States={props.web3States} parentIs={parentIs} />
      </Dialog>
    </Paper>
  )
}
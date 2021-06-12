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
  const orderDetails = props.orderDetails;
  const storeDetails = props.storeDetails;
  const orderCondition = props.orderCondition;

  const [isTakingOrder, setIsTakingOrder] = useState(false);

  const [storeName, setStoreName] = useState("");
  const [cityName, setCityName] = useState("");
  const [setTime, setSetTime] = useState(0);
  const [orderID, setOrderID] = useState(0);
  const [storeID, setStoreID] = useState(0);
  const [itemsNumber, setItemsNumber] = useState([]);
  const [menuArray, setMenuArray] = useState([]);
  const [tipMulti, setTipMulti] = useState(4);

  const [isConfirmed, setisConfirmed] = useState(false);
  const [isDelivering, setisDelivering] = useState(false);
  const [isDelivered, setisDelivered] = useState(false);
  const [isReceived, setisReceived] = useState(false);
  const [userAddr, setuserAddr] = useState(0);
  const [deliverymanAddr, setdeliverymanAddr] = useState(0);



  
  const load_order_basic_info_by_orderID = async () => {
    setIsLoading(true);
    
    if ((orderDetails === undefined)||(storeDetails === undefined)||orderCondition === undefined) return;
    setSetTime(Date(orderDetails[0]));
    setOrderID(orderDetails[1]);
    setStoreID(orderDetails[2]);
    setItemsNumber(orderDetails[3]);
    setTipMulti(orderDetails[4]);
    setStoreName(storeDetails[2]);
    setCityName(storeDetails[3]);
    setMenuArray(storeDetails[5].split("\n"));

    setisConfirmed(orderCondition[0]);
    console.log(orderCondition[1]);
    setisDelivering(orderCondition[1]);
    setisDelivered(orderCondition[2]);
    setisReceived(orderCondition[3]);
    setuserAddr(orderCondition[4]);
    setdeliverymanAddr(orderCondition[5]);

    setIsLoading(false);
  }

  useEffect(() => {
    load_order_basic_info_by_orderID();
  }, [orderDetails, storeDetails, orderCondition])

  const handleTakeOrder = async () => {
    await contract.methods.SetOrderDelivering(orderID).send({ from: accounts[0] });
    // setisConfirmed(orderCondition[0]);
    setisDelivering(true);
    // setisDelivered(orderCondition[2]);
    // setisReceived(orderCondition[3]);
    // setuserAddr(orderCondition[4]);
    // setdeliverymanAddr(orderCondition[5]);
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
        {itemsNumber.map((itemNumber, index) => {
          if (itemNumber.toString()!=="0"){
            return (<Grid container xs={12} spacing={1}>
                    <Grid item xs={12} sm={9}>
                      <Typography>{menuArray[index]}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography align="right">{itemsNumber[index]}</Typography>
                    </Grid>
                  </Grid>)
          }
        })}
      </Box>
      <Divider />
      <Box className={classes.DeliverymanOrderFooterBox}>
        <Typography variant="h5">{"Tips: $ " + tipMulti.toString()}</Typography>
        <Box className={classes.DeliverymanOrderButtonWrapper}>
          <Button
            variant="contained"
            color='primary'
            onClick={handleTakeOrder}
            disabled={isDelivering}
          >
            Take This !
            </Button>
          {/* {isDelivering && <CircularProgress size={24} className={classes.DeliverymanOrderButtonProgress} />} */}
        </Box>
      </Box>
    </Paper>
  )
}
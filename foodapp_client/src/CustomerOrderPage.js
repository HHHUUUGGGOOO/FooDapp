import {
  Box, Button, CircularProgress, Divider, Grid,
  makeStyles, Paper, Typography, TextField
} from "@material-ui/core";
import { useEffect, useState } from "react";
import Web3 from 'web3'
const useStyles = makeStyles((theme) => ({
  customerOrderPaper: {
  },
  customerOrderTitle: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(0),
  },
  customerStoreOrderInfos: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  customerOrderMenu: {
    padding: theme.spacing(2),
  },
  customerStoreMenuItemBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  customerStoreMenuItemName: {
    alignSelf: 'flex-start',
  },
  customerStoreMenuItemPrice: {
    alignSelf: 'flex-end',
  },
  customerStoreMenuItemAmountGrid: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  customerOrderFooterBox: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  customerOrderTipBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  customerOrderTipTextField: {
    width: '30%',
    marginLeft: theme.spacing(1),
  },
  customerOrderButtonWrapper: {
    position: 'relative',
  },
  customerOrderButtonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))

export default function CustomerOrderPage(props) {
  const { isLoading, setIsLoading } = props.isLoadingPair;
  const { web3, accounts, contract } = props.web3States;
  const orderDetail = props.orderDetail;
  const orderTime = props.orderTime;
  const classes = useStyles();
  const [isTakingOrder, setIsTakingOrder] = useState(false);
  const [itemsNumber, setItemsNumber] = useState(new Array(orderDetail[5].split('\n').length));
  const [tipValue, setTipValue] = useState(0);
     
  const isZero = (number) => number===0 

  const handleTakeOrder = async () => {
    const newPostID = 0;
    if (itemsNumber.every(isZero)){
      alert("Please Order Something")
      return;
    }
    await contract.methods.UserSetMyOrderPost(newPostID, Number(orderDetail[0]), itemsNumber, tipValue).send({ from: accounts[0] });
  }


  return (
    <Paper className={classes.customerOrderPaper}>
      <Typography className={classes.customerOrderTitle} variant="h3">{orderDetail[2]}</Typography>
      <Box className={classes.customerStoreOrderInfos}>
        <Typography variant="subtitle1">{orderDetail[3]}</Typography>
        <Typography variant="subtitle1">{orderTime}</Typography>
      </Box>
      {/* <Divider /> */}
      <Box className={classes.customerOrderMenu}>
        {orderDetail[5].split("\n").map((dish, dish_index) => (
          <>
            <Divider />
            <Grid container xs={12} spacing={1}>
              <Grid item xs={9} sm={9}>
                <Box className={classes.customerStoreMenuItemBox}>
                  <Typography className={classes.customerStoreMenuItemName}>{dish}</Typography>
                  <Typography className={classes.customerStoreMenuItemPrice}>NTD$ 100</Typography>
                </ Box>
              </Grid>
              <Grid item xs={3} sm={3} className={classes.customerStoreMenuItemAmountGrid}>
                <TextField
                  onChange={(event) => {
                    console.log(Number(event.target.value));
                    let itemsNumberChange = itemsNumber;
                    if (!isNaN(Number(event.target.value))){
                      itemsNumberChange[dish_index] = Number(event.target.value);
                    }
                    else{
                      itemsNumberChange[dish_index] = Number(0);
                    }
                    console.log(itemsNumberChange);
                    setItemsNumber(itemsNumberChange);
                  }}
                />
              </Grid>
            </Grid>
          </>
        ))}
      </Box>
      <Divider />
      <Box className={classes.customerOrderFooterBox}>
        <Box className={classes.customerOrderTipBox}>
          <Typography variant="h5">Tips: $ </Typography>
          <TextField
            className={classes.customerOrderTipTextField}
            onChange={(event) => { 
              let tips = 0;
              if (!isNaN(Number(event.target.value))) {
                tips = Number(event.target.value)
              }
              setTipValue(tips); 
            }}
          />
        </Box>
        <Box className={classes.customerOrderButtonWrapper}>
          <Button
            variant="contained"
            color='primary'
            onClick={handleTakeOrder}
            disabled={isTakingOrder}
          >
            Take These !
    </Button>
          {isTakingOrder && <CircularProgress size={24} className={classes.customerOrderButtonProgress} />}
        </Box>
      </Box>
    </Paper>
  )
}
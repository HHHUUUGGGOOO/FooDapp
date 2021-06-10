import {
  Box, Container, Fab, Grid, makeStyles
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add"
import { useState, useEffect } from "react";
import DeliverymanSingleOrder from "./DeliverymanSingleOrder";

const useStyles = makeStyles((theme) => ({
  DeliverymanPanelContainer: {
  },
}))

export default function DeliverymanPanel(props) {
  const classes = useStyles();
  const { web3, accounts, contract } = props.web3States;
  const { isLoading, setIsLoading } = props.isLoadingPair;
  const [myStoresIDList, setMyStoresIDList] = useState([]);


  const orderIDsList = [0, 1, 2, 3];


  const load_available_orderIDs = async () => {
    setIsLoading(true);
    // expect loading...
    console.log("loading...");
    // // var _tmpStoreList = [];
    // var _tmpStoreIDList = [];
    // await contract.methods.AddressGetStoreID().call({ from: accounts[0] })
    //   .then((idArray) => {
    //     idArray.map((idString) => {
    //       _tmpStoreIDList.push(parseInt(idString, 10));
    //     })
    //   });
    // if (!_tmpStoreIDList.length) {
    //   _tmpStoreIDList.push(0);
    // }
    // setMyStoresIDList(_tmpStoreIDList);
    console.log("loaded.")
    setIsLoading(false);
  }

  useEffect(() => {
    load_available_orderIDs();
  }, [])

  return (
    <Container className={classes.DeliverymanPanelContainer}>
      <Grid container spacing={4}>
        {orderIDsList.map((id, index) => (
          <Grid item key={id} xs={12} sm={6} md={4}>
            <DeliverymanSingleOrder
              orderID={id}
              isLoadingPair={props.isLoadingPair}
              web3States={props.web3States}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
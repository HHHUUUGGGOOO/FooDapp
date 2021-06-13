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
  const [orderIDsList, setOrderIDsList] = useState([]);
  const [orderDetailsList, setOrderDetailsList] = useState([]);
  const [storeDetailsList, setStoreDetailsList] = useState([]);
  const [orderConditionList, setOrderConditionList] = useState([]);
  // const orderIDsList = [1,2,3,4]

  const load_available_orderIDs = async () => {
    if (contract === null ) return
    const AllOrderList = await contract.methods.GetAllOrderInformation().call({ from: accounts[0] });
    console.log(AllOrderList);
    setOrderIDsList(AllOrderList);
    let orderList = [];
    let storeList = [];
    let orderInfoList = [];
    for (let i=0;i<AllOrderList.length;i++){
      const orderDetail = await contract.methods.OrderIDGetOrderBasicInfo(AllOrderList[i]).call({ from: accounts[0] });
      orderList.push(orderDetail);
      const storeDetail = await contract.methods.StoreIDGetStoreDetail(orderDetail[2]).call({ from: accounts[0] });
      storeList.push(storeDetail);
      const orderInfo = await contract.methods.OrderIDGetOrderConditionAndOwner(AllOrderList[i]).call({ from: accounts[0] });
      orderInfoList.push(orderInfo);
    }
    setOrderDetailsList(orderList);
    setStoreDetailsList(storeList);
    setOrderConditionList(orderInfoList);
    console.log(orderInfoList);
  }

  useEffect(() => {
    load_available_orderIDs();
  }, [contract])

  return (
    <Container className={classes.DeliverymanPanelContainer}>
      <Grid container spacing={4}>
        {orderIDsList.map((id, index) => (
          <Grid item key={id} xs={12} sm={6} md={4}>
            <DeliverymanSingleOrder
              orderID={id}
              isLoadingPair={props.isLoadingPair}
              web3States={props.web3States}
              orderDetails={orderDetailsList[index]}
              storeDetails={storeDetailsList[index]}
              orderCondition={orderConditionList[index]}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
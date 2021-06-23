import {
  Box, Container, Fab, Grid, Typography, 
  Divider, makeStyles
} from "@material-ui/core";
import { ShoppingCart } from "@material-ui/icons";
import { useState, useEffect } from "react";
import SingleOrder from "./SingleOrder";
import { RateWideBar } from "./Rate";
import { AddressWithBigTail, useStylesForOrdersPage } from "./Utils";

const useStyles = makeStyles((theme) => ({
}))

export default function DeliverymanPanel(props) {
  const classes = useStyles();
  const classesP = useStylesForOrdersPage();
  const { web3, accounts, contract } = props.web3States;
  const { isLoading, setIsLoading } = props.isLoadingPair;
  const [orderIDsList, setOrderIDsList] = useState([]);
  const [orderDetailsList, setOrderDetailsList] = useState([]);
  const [storeDetailsList, setStoreDetailsList] = useState([]);
  const [orderConditionList, setOrderConditionList] = useState([]);
  const [myRateIntArray, setMyRateIntArray] = useState([50, 20, 5, 5, 20]);
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
    <Box className={classesP.panelBox}>
      <Container className={classesP.panelContainer}>
        <Box className={classesP.panelTitle}>
          <AddressWithBigTail address={accounts === null ? ("Loading..."):(accounts[0])} />
        </Box>
        <RateWideBar />
        <Divider />
        <Grid container spacing={4} className={classesP.panelOrders}>
          {orderIDsList.map((id, index) => (
            <Grid item key={id} xs={12} sm={6} md={4}>
              {/* <DeliverymanSingleOrder
                orderID={id}
                isLoadingPair={props.isLoadingPair}
                web3States={props.web3States}
                orderDetails={orderDetailsList[index]}
                storeDetails={storeDetailsList[index]}
                orderCondition={orderConditionList[index]}
              /> */}
              <SingleOrder
                orderID={id}
                isLoadingPair={props.isLoadingPair}
                web3States={props.web3States}
                parentIs="Deliveryman"
              />
            </Grid>
          ))}
        </Grid>
      </Container>
      <Box className={classesP.fabsBox}>
        <Fab
          color="primary"
          aria-label="edit store info"
          className={classesP.panelFab}
          disabled={false}
          onClick={() => {}}
        >
          <ShoppingCart />
        </Fab>
      </Box>

    </Box>
  )
}
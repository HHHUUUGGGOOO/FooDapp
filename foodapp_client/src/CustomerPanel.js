import {
  Button, Container, Dialog, DialogContent, DialogTitle, Divider,
  makeStyles, Paper, Typography, Box, CircularProgress, Grid, Fab
} from "@material-ui/core";
import { ShoppingCart, Store } from "@material-ui/icons";
import React, { useEffect, useState } from 'react'
import CustomerOrderPage from "./CustomerOrderPage";
import { RateWideBar, SimpleShowRating } from "./Rate";
import SingleOrder from "./SingleOrder";
import { AddressWithBigTail, useStylesForOrdersPage } from "./Utils";

const useStyles = makeStyles((theme) => ({
  customerPanelStorePaper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  customerPanelStoreRate: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  customerPanelStoreInfoSection: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(0),
  },
  customerPanelStoreMenuSection: {
    margin: theme.spacing(2),
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
}));

export default function CustomerPage(props) {
  const classes = useStyles();
  const classesP = useStylesForOrdersPage();
  const { web3, accounts, contract } = props.web3States;

  // const accounts = props.accounts
  // const contract = props.constract
  const city = "Taipei";
  const [isOrdering, setIsOrdering] = useState(false);
  const { isLoading, setIsLoading } = props.isLoadingPair;
  const [orderingStoreID, setOrderingStoreID] = useState(0);
  const [menuList, setMenuList] = useState([])
  const [storeList, setStoreList] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [ordertime, setOrderTime] = useState('');
  const [isOpenCart, setIsOpenCart] = useState(false);
  const [orderIDsList, setOrderIDsList] = useState([]);

  const [targetPlace, setTargetPlace] = useState("");

  const timeStamp = async () => {
    const timestamp = Date.now();
    const date = new Date(timestamp);
    setOrderTime(date.toString());
  }

  const handleClickStore = async (storeID) => {
    setOrderingStoreID(storeID);
    const detail = await contract.methods.StoreIDGetStoreDetail(storeID).call({ from: accounts[0] });
    setOrderDetail(detail);
    timeStamp();
    setIsOrdering(true);
  }
  const test = async () => {
    console.log("hihi");
    console.log(storeList); 
  }
  const loadStore = async () => {
    let storesDetail = []
    if (contract != null) {
      let idArray = await contract.methods.ListAllStore().call({ from: accounts[0] })
      for (let i = 0; i < idArray.length; i++) {
        let detail = await contract.methods.StoreIDGetStoreDetail(idArray[i]).call({ from: accounts[0] });
        // console.log(detail);
        storesDetail.push({
          storeID: detail[0],
          storeName: detail[2],
          moreInfo: detail[4],
          menu: detail[5].split("\n"),
          itemsPrice: detail[6]
        })
      }
      console.log(storesDetail);
      setStoreList(storesDetail);
      let place = await contract.methods.UserAddrGetTargetPlace().call({ from: accounts[0] });
      setTargetPlace(place)
    }
  }

  useEffect(() => {
    loadStore();
  }, [contract])

  return (
    <Box className={classesP.panelBox}>
      {!isOpenCart ? (
        <Container className={classesP.panelContainer}>
          <Grid container spacing={4}>
            {storeList.map((store, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Paper
                  className={classes.customerPanelStorePaper}
                  onClick={() => { handleClickStore(store.storeID) }}
                  key={store.storeID}
                >
                  <Box className={classes.customerPanelStoreInfoSection}>
                    <Typography variant="h4">{store.storeName}</Typography>
                    <Typography variant="subtitle2">{store.moreInfo}</Typography>
                    <Box className={classes.customerPanelStoreRate}>
                      <SimpleShowRating rate={4.5} />
                    </Box>
                  </Box>
                  {/* <Divider /> */}
                  <Box className={classes.customerPanelStoreMenuSection}>
                    {store.menu.map((item, menu_index) => (
                      <Box className={classes.customerStoreMenuItemBox}>
                        <Divider />
                        <Typography className={classes.customerStoreMenuItemName}>{item}</Typography>
                        <Typography className={classes.customerStoreMenuItemPrice}>NTD${store.itemsPrice[menu_index]}</Typography>
                      </ Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      ) : (
        <Container className={classesP.panelContainer}>
          <Box className={classesP.panelTitle}>
            <AddressWithBigTail address={accounts === null ? ("Loading...") : (accounts[0])} />
          </Box>
          <RateWideBar />
          <Divider />
          <Grid container spacing={4} className={classesP.panelOrders}>
            {orderIDsList.map((id, index) => (
              <Grid item key={id} xs={12} sm={6} md={4}>
                <SingleOrder
                  orderID={id}
                  isLoadingPair={props.isLoadingPair}
                  web3States={props.web3States}
                  parentIs="Customer"
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
      <Box className={classesP.fabsBox}>
        <Fab
          color="primary"
          aria-label="test"
          className={classesP.fab}
          onClick={test}
        >
          <Typography>test</Typography>
        </Fab>
        <Fab
          color="primary"
          aria-label="check cart"
          className={classesP.fab}
          onClick={async () => { 
            setIsOpenCart(!isOpenCart);
            const orderList = await contract.methods.UserAddrGetOrder().call({ from: accounts[0] })
            setOrderIDsList(orderList);
            console.log("orderList");
            console.log(orderList);
          }}
        >
          {isOpenCart ? (
            <Store />
          ) : (
            <ShoppingCart />
          )}
        </Fab>
      </Box>
      <Dialog open={isOrdering} onClose={() => { setIsOrdering(false) }}>
        <CustomerOrderPage
          isLoadingPair={props.isLoadingPair}
          web3States={props.web3States}
          orderDetail={orderDetail}
          orderTime={ordertime}
          // orderIDsList={orderIDsList}
          targetPlace={targetPlace}
        >
        </CustomerOrderPage>
      </Dialog>
    </Box>
  )
}
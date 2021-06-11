import {
  Button, Container, Dialog, DialogContent, DialogTitle, Divider,
  makeStyles, Paper, Typography, Box, CircularProgress, Grid
} from "@material-ui/core";
import React, { useEffect, useState } from 'react'
import CustomerOrderPage from "./CustomerOrderPage";

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
  },
}));

export default function CustomerPage(props) {
  const classes = useStyles();
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
    const order = await contract.methods.GetAllOrderInformation().call({ from: accounts[0] })
    console.log(order);
  }
  const loadStore = async () => {
    let storesDetail = []
    if (contract != null) {
      let idArray = await contract.methods.ListAllStore().call({ from: accounts[0] })
      for (let i = 0; i < idArray.length; i++) {
        let detail = await contract.methods.StoreIDGetStoreDetail(idArray[i]).call({ from: accounts[0] });
        console.log(detail);
        storesDetail.push({
          storeID: detail[0],
          storeName: detail[2],
          moreInfo: detail[4],
          menu: detail[5].split("\n")
        })
      }
      setStoreList(storesDetail);
    }
  }

  useEffect(() => {
    loadStore();
  }, [contract])



  return (
    <Container className={classes.customerPageContainer}>
      { storeList.map((store) => (
        <Paper
          className={classes.customerPageStorePaper}
          onClick={() => { handleClickStore(store.storeID) }}
          key={store.storeID}
        >
          <div className={classes.customerPageStoreInfoSection}>
            <Typography variant="h5">{store.storeName}</Typography>
            <Typography variant="subtitle2">{store.moreInfo}</Typography>
          </div>
          <Divider />
          <div className={classes.customerPageStoreMenuSection}>
            {store.menu.map((item) => (
              <Typography variant="body1">{"🥡 " + item}</Typography>
            ))}
          </div>
        </Paper>
      ))}
      <Button onClick={test}></Button>
      <Dialog open={isOrdering} onClose={() => { setIsOrdering(false) }}>
        <CustomerOrderPage
          isLoadingPair={props.isLoadingPair}
          web3States={props.web3States}
          orderDetail={orderDetail}
          orderTime={ordertime}
        >
        </CustomerOrderPage>
      </Dialog>
    </Container>
  )
}
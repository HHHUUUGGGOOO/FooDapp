import {
  Box, Fab, makeStyles
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add"
import { useState, useEffect } from "react";
import StorePage from "./StorePage";

const useStyles = makeStyles((theme) => ({
  storePanelBox: {
    display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'flex-start',
    // maxWidth: 700,
    // flexGrow: 1,
    // padding: theme.spacing(1),
    width: '100%',
    margin: theme.spacing(1),
  },
  storePanelFab: {
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}))

export default function StorePanel(props) {
  const classes = useStyles();
  const { web3, accounts, contract } = props.web3States;
  const { isLoading, setIsLoading } = props.isLoadingPair;
  const [myStoresIDList, setMyStoresIDList] = useState([]);

  const loading_my_storeIDs = async () => {
    setIsLoading(true);
    // expect loading...
    console.log("loading...");
    // var _tmpStoreList = [];
    var _tmpStoreIDList = [];
    await contract.methods.AddressGetStoreID().call({ from: accounts[0] })
      .then((idArray) => {
        idArray.map((idString) => {
          _tmpStoreIDList.push(parseInt(idString, 10));
        })
      });
    if (!_tmpStoreIDList.length) {
      _tmpStoreIDList.push(0);
    }
    setMyStoresIDList(_tmpStoreIDList);
    console.log("loaded.")
    setIsLoading(false);
  }

  useEffect(() => {
    loading_my_storeIDs();
  }, [])

  return (
    <Box className={classes.storePanelBox}>
      {myStoresIDList.map((id, index) => (
        <StorePage storeID={id} isLoadingPair={props.isLoadingPair} web3States={props.web3States} />
      ))}
      <Fab
        color="primary"
        aria-label="add"
        className={classes.storePanelFab}
        onClick={() => {setMyStoresIDList([...myStoresIDList, 0])}}
        >
        <AddIcon />
      </Fab>
    </Box>
  )
}
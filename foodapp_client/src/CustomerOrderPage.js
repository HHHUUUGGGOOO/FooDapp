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

export default function CustomerOrderPage(props) {
    const classes = useStyles();
    const [isTakingOrder, setIsTakingOrder] = useState(false);
    const { isLoading, setIsLoading } = props.isLoadingPair;
    const { web3, accounts, contract } = props.web3States;
    const orderDetail = props.orderDetail;
    const orderTime = props.orderTime;
    //test
    const load_order_basic_info_by_orderID = async () => {
        setIsLoading(true);
        console.log("loading order basic info...");
        console.log("loaded.")
        setIsLoading(false);
    }
    const handleTakeOrder = async () => {
        setIsTakingOrder(true);
        await load_order_basic_info_by_orderID();
        setIsTakingOrder(false);
    }


    return (
        <Paper className={classes.DeliverymanOrderPaper}>
            <Box className={classes.DeliverymanOrderTitle}>
                <Typography variant="h3" gutterBottom>{orderDetail[2]}</Typography>
                <Typography variant="subtitle1">{orderDetail[3]}</Typography>
                <Typography variant="subtitle1">{orderTime}</Typography>
            </Box>
            <Divider />
            <Box className={classes.DeliverymanOrderMenu}>
                <Grid container xs={12} spacing={1}>
                    <Grid item xs={12} sm={9}>
                        {orderDetail[5].split("\n").map((dish) => (
                            <Typography>{dish}</Typography>
                        ))}
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography align="right">{[1, 2, 3]}</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Divider />
            <Box className={classes.DeliverymanOrderFooterBox}>
                <Typography variant="h5">{"Tips: $ " + '5'}</Typography>
                <Box className={classes.DeliverymanOrderButtonWrapper}>
                    <Button
                        variant="contained"
                        color='primary'
                        onClick={handleTakeOrder}
                        disabled={isTakingOrder}
                    >
                        Take These !
                </Button>
                    {isTakingOrder && <CircularProgress size={24} className={classes.DeliverymanOrderButtonProgress} />}
                </Box>
            </Box>
        </Paper>
    )
}
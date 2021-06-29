import {
  Grid, Typography, LinearProgress, CircularProgress, Divider,
  Box, Button,
  makeStyles, withStyles
} from "@material-ui/core"
import {
  Rating
} from "@material-ui/lab"
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  rateGrid: {
    margin: theme.spacing(2)
  },
  rateLabel: {
    marginRight: theme.spacing(2),
  },
  rateBar: {
    flexGrow: 1,
    alignSelf: 'center',
    marginRight: theme.spacing(2),
  },
  rateAmount: {
    width: theme.spacing(5)
  },
  rateSummaryGrid: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateBox: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateRowBox: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    minWidth: '250px',
    justifyContent: 'center',
  },
  rateRowTypography: {
    alignSelf: 'flex-start',
  },
  rateRowRating: {
    alignSelf: 'flex-end',
  },
  rateLoadingProgress: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    // transform: 'translate(-50%, -50%)'
  }
}))

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#ffdd00',
  },
}))(LinearProgress);

const parseRateArray = (rateArray) => {
  let n = 0, weighted_n = 0;
  let _array = rateArray.map((rate, index) => {
    let _a = parseInt(rate);
    let value = (_a === _a) ? _a : 0;
    n += value;
    weighted_n += value * (index + 1);
    return value;
  });
  if (!n) {
    n += 1;
  }
  return { 
    amount: n, 
    averageFloat: (weighted_n / n),
    averageStr: (weighted_n / n).toFixed(1),
    array: _array
  }
}

export function RateWideBar(props) {
  const classes = useStyles();
  const { rateArray } = props;

  const [totalAmount, setTotalAmount] = useState(0);
  const [average, setAverage] = useState(0.0);
  const [array, setArray] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    let Result = parseRateArray(props.rateArray);
    setTotalAmount(Result.amount);
    setAverage(Result.averageFloat);
    setArray(Result.array);
  }, [props])

  return (
    <Grid container spacing={1} className={classes.rateGrid} xs={12}>
      <Grid item xs={9} md={10} container direction='column' spacing={1}>
        <Grid item container spacing={1}>
          <Typography className={classes.rateLabel}>5⭐</Typography>
          <BorderLinearProgress variant='determinate' className={classes.rateBar} value={array[4] / totalAmount * 100} />
          <Typography className={classes.rateAmount}>{array[4]}</Typography>
        </Grid>
        <Grid item container spacing={1}>
          <Typography className={classes.rateLabel}>4⭐</Typography>
          <BorderLinearProgress variant='determinate' className={classes.rateBar} value={array[3] / totalAmount * 100} />
          <Typography className={classes.rateAmount}>{array[3]}</Typography>
        </Grid>
        <Grid item container spacing={1}>
          <Typography className={classes.rateLabel}>3⭐</Typography>
          <BorderLinearProgress variant='determinate' className={classes.rateBar} value={array[2] / totalAmount * 100} />
          <Typography className={classes.rateAmount}>{array[2]}</Typography>
        </Grid>
        <Grid item container spacing={1}>
          <Typography className={classes.rateLabel}>2⭐</Typography>
          <BorderLinearProgress variant='determinate' className={classes.rateBar} value={array[1] / totalAmount * 100} />
          <Typography className={classes.rateAmount}>{array[1]}</Typography>
        </Grid>
        <Grid item container spacing={1}>
          <Typography className={classes.rateLabel}>1⭐</Typography>
          <BorderLinearProgress variant='determinate' className={classes.rateBar} value={array[0] / totalAmount * 100} />
          <Typography className={classes.rateAmount}>{array[0]}</Typography>
        </Grid>
      </Grid>
      <Grid item xs sm md className={classes.rateSummaryGrid}>
        <Typography variant="h2" align='center'>{average.toFixed(1)}</Typography>
        <Rating readOnly value={average} precision={0.1} />
      </Grid>
    </Grid>
  )
}

export function RatingDialogContent(props) {
  const classes = useStyles();
  const { parentIs, orderID } = props
  const { web3, accounts, contract } = props.web3States;

  const [userRate, setUserRate] = useState(0);
  const [deliRate, setDeliRate] = useState(0);
  const [storRate, setStorRate] = useState(0);

  const [hasRated, setHasRated] = useState(false);
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  const sendRatings = async () => {
    setIsLoadingRate(true);
    if (parentIs === "Customer") {
      if (!deliRate) {
        alert("Please rate the deliveryman.")
      }
      else if (!storRate) {
        alert("Please rate the store.")
      }
      else {
        await contract.methods.UserRateDeliveryman(orderID, deliRate).send({ from: accounts[0] })
          .on("receipt", (receipt) => {
            console.log("Deliveryman Rated.");
          })
          .on("error", (error, receipt) => {
            alert(error, receipt);
            console.log(error, receipt);
          });
        await contract.methods.UserRateStore(orderID, storRate).send({ from: accounts[0] })
          .on("receipt", (receipt) => {
            console.log("StoreRated.");
          })
          .on("error", (error, receipt) => {
            alert(error, receipt);
            console.log(error, receipt);
          });
      }
    }
    else if (parentIs === "Deliveryman") {
      if (!userRate) {
        alert("Please rate the customer.")
      }
      await contract.methods.DeliverymanRateCustomer(orderID, userRate).send({ from: accounts[0] })
        .on("receipt", (receipt) => {
          console.log("StoreRated.");
        })
        .on("error", (error, receipt) => {
          alert(error, receipt);
          console.log(error, receipt);
        });
    }
    setIsLoadingRate(false)
    loadRates();
  }

  const loadRates = async () => {
    setIsLoadingRate(true);
    await contract.methods.OrderIDGetOrderScore(orderID).call({ from: accounts[0] })
      .then((result) => {
        let deliToUserScore = (parseInt(result[1]) === parseInt(result[1])) ? parseInt(result[1]) : 0;
        let userToDeliScore = (parseInt(result[0]) === parseInt(result[0])) ? parseInt(result[0]) : 0;
        let userToStorScore = (parseInt(result[2]) === parseInt(result[2])) ? parseInt(result[2]) : 0;
        if (parentIs === "Customer" && (userToDeliScore || userToStorScore)) {
          setHasRated(true);
          setUserRate(deliToUserScore);
          setDeliRate(userToDeliScore);
          setStorRate(userToStorScore);
        }
        if (parentIs === "Deliveryman" && deliToUserScore) {
          setHasRated(true);
          setUserRate(deliToUserScore);
          setDeliRate(userToDeliScore);
        }
        if (parentIs === "Store") {
          setHasRated(true);
          setStorRate(userToStorScore);
        }
      })
    setIsLoadingRate(false);
  }

  useEffect(() => {
    loadRates()
  }, [])

  return (
    <Box className={classes.rateBox}>
      <Typography variant="h4" gutterBottom>Rating...</Typography>
      {((parentIs === "Deliveryman") || (parentIs === "Customer" && hasRated)) && (
        <Box className={classes.rateRowBox} >
          <Divider />
          <Typography className={classes.rateRowTypography}>How is the Customer ?</Typography>
          <Rating className={classes.rateRowRating}
            name="user rate" value={userRate} disabled={parentIs !== "Deliveryman"}
            onChange={(event, newValue) => {
              setUserRate(newValue)
            }}
          />
        </Box>
      )}
      {((parentIs === "Customer") || (parentIs === "Deliveryman" && hasRated)) && (
        <Box className={classes.rateRowBox} >
          <Divider />
          <Typography className={classes.rateRowTypography}>Rate Deliveryman: </Typography>
          <Rating className={classes.rateRowRating}
            name="deliveryman rate" value={deliRate} disabled={parentIs !== "Customer"}
            onChange={(event, newValue) => {
              setDeliRate(newValue)
            }}
          />
        </Box>
      )}
      {((parentIs === "Customer") || (parentIs === "Store" && hasRated)) && (
        <Box className={classes.rateRowBox} >
          <Divider />
          <Typography className={classes.rateRowTypography}>Rate Store: </Typography>
          <Rating className={classes.rateRowRating}
            name="store rate" value={storRate} disabled={parentIs !== "Customer"}
            onChange={(event, newValue) => {
              setStorRate(newValue)
            }}
          />
        </Box>
      )}
      <Button fullWidth disabled={hasRated || isLoadingRate} variant="outlined"
        onClick={sendRatings}
      >
        <Typography variant="h6">Rate</Typography>
      </Button>
      <Typography variant="caption" >You can't change rating in the future.</Typography>
      {/* <Typography variant="caption" >You can see how you are</Typography> */}
      {(isLoadingRate) && (
        <CircularProgress className={classes.rateLoadingProgress} />
      )}
    </Box>
  )
}

export function ShowStoreRate(props) {
  const [average, setAverage] = useState(0);

  useEffect(() => {
    let Result = parseRateArray(props.rateArray);
    setAverage(Result.averageFloat);
  }, [props])
  return (
    <Rating name="rate" value={average} precision={0.1} readOnly />
  )
}
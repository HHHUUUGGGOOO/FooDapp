import {
  Grid, Typography, LinearProgress, Divider, Box,
  makeStyles, withStyles, Dialog
} from "@material-ui/core"
import {
  Rating
} from "@material-ui/lab"
import { useState } from "react";

const useStyles = makeStyles((theme)=> ({
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


export function RateWideBar(props){
  const classes = useStyles();
  const rateArray = props.rateArray;

  return (
    <Grid container spacing={1} className={classes.rateGrid} xs={12}>
      <Grid item xs={9} md={10} container direction='column' spacing={1}>
        <Grid item container spacing={1}>
          <Typography className={classes.rateLabel}>5⭐</Typography>
          <BorderLinearProgress variant='determinate' className={classes.rateBar} value={50/100*100}/>
          <Typography className={classes.rateAmount}>50</Typography>
        </Grid>
        <Grid item container spacing={1}>
          <Typography className={classes.rateLabel}>4⭐</Typography>
          <BorderLinearProgress variant='determinate' className={classes.rateBar} value={50/100*100}/>
          <Typography className={classes.rateAmount}>50</Typography>
        </Grid>
        <Grid item container spacing={1}>
          <Typography className={classes.rateLabel}>3⭐</Typography>
          <BorderLinearProgress variant='determinate' className={classes.rateBar} value={50/100*100}/>
          <Typography className={classes.rateAmount}>50</Typography>
        </Grid>
        <Grid item container spacing={1}>
          <Typography className={classes.rateLabel}>2⭐</Typography>
          <BorderLinearProgress variant='determinate' className={classes.rateBar} value={50/100*100}/>
          <Typography className={classes.rateAmount}>50</Typography>
        </Grid>
        <Grid item container spacing={1}>
          <Typography className={classes.rateLabel}>1⭐</Typography>
          <BorderLinearProgress variant='determinate' className={classes.rateBar} value={50/100*100}/>
          <Typography className={classes.rateAmount}>50</Typography>
        </Grid>
      </Grid>
      <Grid item xs sm md className={classes.rateSummaryGrid}>
        <Typography variant="h2" align='center'>3.6</Typography>
        <Rating readOnly value={3.6} precision={0.1}/>
      </Grid>
    </Grid>
  )
}

export function RatingDialogContent(props){
  const classes = useStyles();
  const parentIs = props.parentIs;
  const { web3, accounts, contract } = props.web3States;
  const orderID = props.id;

  const [userRate, setUserRate] = useState(0);
  const [deliRate, setDeliRate] = useState(0);
  const [storRate, setStorRate] = useState(0);

  return (
      <Box className={classes.rateBox}>
        <Typography variant="h4" gutterBottom>Rating...</Typography>
        {(parentIs !== "Customer") && (
          <Box className={classes.rateRowBox} >
            <Divider />
            <Typography className={classes.rateRowTypography}>How is the Customer ?</Typography>
            <Rating className={classes.rateRowRating} name="user rate" value={userRate} onChange={(event, newValue) => {
              setUserRate(newValue)}} />
          </Box>
        )}
        {(parentIs !== "Deliveryman") && (
          <Box className={classes.rateRowBox} >
            <Divider />
            <Typography className={classes.rateRowTypography}>Rate Deliveryman: </Typography>
            <Rating className={classes.rateRowRating} name="deliveryman rate" value={deliRate} onChange={(event, newValue) => {
              setDeliRate(newValue)}} />
          </Box>
        )}
        {(parentIs !== "Store") && (
          <Box className={classes.rateRowBox} >
            <Divider />
            <Typography className={classes.rateRowTypography}>Rate Store: </Typography>
            <Rating className={classes.rateRowRating} name="store rate" value={storRate} onChange={(event, newValue) => {
              setStorRate(newValue)}} />
          </Box>
        )}
      </Box>
  )
}

export function SimpleShowRating(props){
  return (
    <Rating name="rate" defaultValue={props.rate} precision={0.1} readOnly />
  )
}
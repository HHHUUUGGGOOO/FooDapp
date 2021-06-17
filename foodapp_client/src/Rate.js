import {
  Grid, Typography, LinearProgress,
  makeStyles, withStyles
} from "@material-ui/core"
import {
  Rating
} from "@material-ui/lab"

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
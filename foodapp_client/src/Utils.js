import { Box, Typography, makeStyles } from "@material-ui/core";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  titleWithBigTailBox: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
  }
}))

export function AddressWithBigTail(props) {
  const addr = (props.address.length < 10) ? (" ".repeat(11) + props.address) : (props.address);
  return (
    <TitleWithBigTail head={addr.slice(0, -10)} tail={addr.slice(-10)} />
  )
}

export function TitleWithBigTail(props) {
  const classes = useStyles();
  const { head, tail } = props;
  return (
    <Box className={classes.titleWithBigTailBox}>
      <Typography variant='h5'>{head}</Typography>
      <Typography variant='h2'>{tail}</Typography>
    </Box>
  )
}

export const useStylesForOrdersPage = makeStyles((theme) => ({
  panelBox: {
    display: 'flex',
    width: '100vw',
    margin: theme.spacing(1),
  },
  fabsBox: {
    position: 'absolute',
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
  },
  fab: {
    marginTop: theme.spacing(1),
  },
  panelContainer: {
  },
  panelTitle: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(0),
    // overflow: 'hidden',
  },
  panelOrders: {
    paddingTop: theme.spacing(3),
  },
  marginRight1: {
    marginRight: theme.spacing(1),
  },
  marginRight2: {
    marginRight: theme.spacing(2),
  },
  marginRight3: {
    marginRight: theme.spacing(3),
  },
  width100: {
    width: '100%',
  },
  height100: {
    height: '100%',
  },
}))
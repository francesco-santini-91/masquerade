import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import getOrderInfo from '../services/getOrderInfo';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function BottomBar(props) {
    const orders_URL = 'http://localhost:4000/orders/';
    const dish_URL = 'http://localhost:4000/dish/';
    const drink_URL = 'http://localhost:4000/drink/';
    const beer_URL = 'http://localhost:4000/beer/';
    const classes = useStyles();
    const [isMounted, setIsMounted] = useState(false);
    const [order, setOrder] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [updates, setUpdates] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [backdropOpen, setBackDropOpen] = useState(false);

    useEffect(() => {
      setIsMounted(true);
      props.socket.on('refresh', (orderID) => {
          getOrderInfo(props.orderID)
            .then((result) => {setOrder(result)})
            .catch((errors) => console.log(errors));        // <-------------- GESTIRE ERRORI!
      });
      setLoaded(true);
      console.log(order)
      return function cleanup() { setIsMounted(false); props.socket.removeListener('refresh') }
    }, []);

    useEffect(() => {
      async function getData() {
          await getOrderInfo(props.orderID)
            .then((result) => setOrder(result))
            .catch((errors) => console.log(errors));   //  <-------------- GESTIRE ERRORI!
      }
      if(props.orderID !== null) {
        getData();
        setLoaded(true);
      }
    }, [props.orderID])
  
    const handleMenu = () => {
      setExpanded(!expanded);
    };

    const getColorLabel = (state) => {
      switch(state) {
        case 'NOT_CONFIRMED':
          return '#c5bcbc';
        case 'CONFIRMED':
          return '#ffffff';
        case 'SENDED':
          return '#dbe000e8';
      }
    }

    const closeConfirmDialog = () => {
      setConfirmDialogOpen(setConfirmDialogOpen(false))
    }

    const confirmDialog = () => {
      return(
        <Dialog
          open={confirmDialogOpen}
          onClose={closeConfirmDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Vuoi confermare l'ordine?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Una volta confermato, l'ordine non sarà più modificabile.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirmDialog} color="primary">
              Annulla
            </Button>
            <Button onClick={() => {confirm(); closeConfirmDialog()}} color="primary" autoFocus>
              Conferma
            </Button>
          </DialogActions>
        </Dialog>
      );
    }   

    const removeDrink = async (drink) => {
      let result;
      await axios.patch(orders_URL + 'drink/' + props.orderID,
      {
        drink: drink
      })
        .then(response => result = response.data)
        .catch((errors) => console.log(errors));    //<------------ GESTIRE ERRORI!
      if(result.removed === true) {
        props.socket.emit('elementRemoved', props.orderID);
      }
      setBackDropOpen(false);
    } 

    const removeBeer = async (beer) => {
      let result;
      await axios.patch(orders_URL + 'beer/' + props.orderID,
      {
        beer: beer
      })
        .then(response => result = response.data)
        .catch((errors) => console.log(errors));    //<------------ GESTIRE ERRORI!
      if(result.removed === true) {
        props.socket.emit('elementRemoved', props.orderID);
      }
      setBackDropOpen(false);
    } 

    const removeDish = async (dish) => {
      let result;
      await axios.patch(orders_URL + 'dish/' + props.orderID,
      {
        dish: dish
      })
        .then(response => result = response.data)
        .catch((errors) => console.log(errors));    //<------------ GESTIRE ERRORI!
      if(result.removed === true) {
        props.socket.emit('elementRemoved', props.orderID);
      }
      setBackDropOpen(false);
    } 

    const confirm = async () => {
      await order.dishes.map(async (dish) => {
        let result;
        if(dish.applicant_ID === localStorage.getItem('applicant_ID') && dish.state === 'NOT_CONFIRMED') {
          await axios.post(dish_URL + 'update/' + dish._id, 
            {
              state: 'CONFIRMED'
            })
            .then(response => result = response.data)
            .catch((errors) => console.log(errors));    // <------------ GESTIRE ERRORI!
        }
      });
      await order.drinks.map(async (drink) => {
        let result;
        if(drink.applicant_ID === localStorage.getItem('applicant_ID') && drink.state === 'NOT_CONFIRMED') {
          await axios.post(drink_URL + 'update/' + drink._id, 
            {
              state: 'CONFIRMED'
            })
            .then(response => result = response.data)
            .catch((errors) => console.log(errors));    // <------------ GESTIRE ERRORI!
        }
      });
      await order.beers.map(async (beer) => {
        let result;
        if(beer.applicant_ID === localStorage.getItem('applicant_ID') && beer.state === 'NOT_CONFIRMED') {
          await axios.post(beer_URL + 'update/' + beer._id, 
            {
              state: 'CONFIRMED'
            })
            .then(response => result = response.data)
            .catch((errors) => console.log(errors));    // <------------ GESTIRE ERRORI!
        }
      });
      props.socket.emit('elementsConfirmed', props.orderID);
      setBackDropOpen(false);
    }

    const showInfo = () => {
      if(order !== null && order !== undefined) {
        return(loaded ?
          <div className={classes.tableInfo}>
            <Typography className={classes.basicInfo}>
              <div style={{display: 'flex', flexDirection: 'row', alignContent: 'space-between'}}>
                <div>
                  Tavolo: <span style={{fontWeight: 'bold'}}>{order.table === undefined ? '' : order.table.name}</span><br/>
                  Subtotale: <span style={{fontWeight: 'bold'}}>{order.subtotal === undefined ? '' : parseFloat(order.subtotal).toFixed(2)} €</span>
                </div>
                <div className="sendOrder" style={{marginRight: 0, marginLeft: 'auto', float: 'right', alignSelf: 'center'}}>
                  <Button variant="contained" style={{backgroundColor: '#ffc300'}} onClick={() => {setConfirmDialogOpen(true);}}>INVIA</Button>
                </div>
              </div>
              {confirmDialog()}
            </Typography>
            <div className={classes.details} hidden={!expanded}>
                <Divider style={{marginBottom: '10px'}} />
                <div style={{marginBottom: 20, fontSize: 14}}>
                  <div>
                    {order.dishes === undefined ? '' : order.dishes.length > 0 ? <span>Piatti:</span> : null}<br/>
                    {order.dishes === undefined ? '' : order.dishes.length > 0 ? order.dishes.map((dish) => <span style={{color: getColorLabel(dish.state), display: 'flex'}}> &nbsp; &nbsp; {dish.name}<div hidden={dish.state !== 'NOT_CONFIRMED' || dish.applicant_ID !== localStorage.getItem('applicant_ID')}><Button style={{fontSize: 11, padding: 0, color: '#fff'}} onClick={() => {removeDish(dish); setBackDropOpen(true);}}>Rimuovi</Button></div><br /></span>) : null}
                  </div>
                  <div style={{marginTop: 8}}>
                    {order.drinks === undefined ? '' : order.drinks.length > 0 ? <span>Bibite:</span> : null}<br />
                    {order.drinks === undefined ? '' : order.drinks.length > 0 ? order.drinks.map((drink) => <span style={{color: getColorLabel(drink.state), display: 'flex'}}> &nbsp; &nbsp; {drink.name + ' ' + drink.size}<div hidden={drink.state !== 'NOT_CONFIRMED' || drink.applicant_ID !== localStorage.getItem('applicant_ID')}><Button style={{fontSize: 11, padding: 0, color: '#fff'}} hidden={drink.state !== 'NOT_CONFIRMED'} onClick={() => {removeDrink(drink); setBackDropOpen(true);}}>Rimuovi</Button></div><br /></span>) : null}
                  </div>
                  <div style={{marginTop: 8}}>
                    {order.beers === undefined ? '' : order.beers.length > 0 ? <span>Birre:</span> : null}<br />
                    {order.beers === undefined ? '' : order.beers.length > 0 ? order.beers.map((beer) => <span style={{color: getColorLabel(beer.state), display: 'flex'}} >&nbsp; &nbsp; {beer.name + ' ' + beer.size}<div hidden={beer.state !== 'NOT_CONFIRMED' || beer.applicant_ID !== localStorage.getItem('applicant_ID')}><Button style={{fontSize: 11, padding: 0, color: '#fff'}} hidden={beer.state !== 'NOT_CONFIRMED'} onClick={() => {removeBeer(beer); setBackDropOpen(true);}}>Rimuovi</Button></div><br /></span>) : null}
                  </div>
                  <Backdrop open={backdropOpen}>
                    <CircularProgress color="inherit" />
                  </Backdrop>
                </div>
            </div>
          </div>
          :
          <div></div>
        );
      }
    }
    
    return (
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.bottomBar} style={{height: (expanded ? '70%' : '80px'), width: '100%', overflow: 'scroll'}}>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="espandi" onClick={handleMenu} style={{position: 'fixed'}}>
            {expanded ? <ExpandMoreIcon fontSize='large' /> : <ExpandLessIcon fontSize='large' />} 
          </IconButton>
            {showInfo()}
          </Toolbar>
        </AppBar>
      </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      textAlign: 'center'
    },
    bottomBar: {
        top: 'auto',
        bottom: 0,
        backgroundColor: '#1e7dff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    tableInfo: {
        textAlign: 'left',
        marginLeft: '50px',
        marginTop: 'auto',
        flexDirection: 'column',
        width: '-webkit-fill-available'
        
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    basicInfo: {
      flexGrow: 1,
      marginTop: 15
    },
    details: {
        marginTop: '20px'
    }
  }));
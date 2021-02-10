import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { Alert, AlertTitle } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';
import getFormattedDate from '../services/getFormattedDate';
import getFormattedTime from '../services/getFormattedTime';
import getFormattedEventTime from '../services/getFormattedEventTime';
import Grid from '@material-ui/core/Grid';
import QRCode from 'qrcode.react';
import EventIcon from '@material-ui/icons/Event';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ClearIcon from '@material-ui/icons/Clear';
import axios from 'axios';

export default function AllOrders__admin(props) {
    const orders_URL = 'http://localhost:4000/orders/';
    const [updates, setUpdates] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [error, setError] = useState(false);
    const [allOrders, setAllOrders] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [orderToOpen, setOrderToOpen] = useState({});
    const [orderInfo, setOrderInfo] = useState(
        {
            _id: null,
            table: null,
            date: Date.now(),
            starting_time: Date.now(),
            dishes: [],
            drinks: [],
            beers: []
        }
    );

    /*useEffect(() => {
        props.socket.on('elementsConfirmedByTable', (orderID) => {
            setUpdates(updates + 1);
        });
        return () => {props.socket.removeListener('elementsConfirmedByTable')}
    }, []);*/

    useEffect(() => {
        async function getAllOrders() {
            let result;
            await axios.post(orders_URL, {admin: 'admin'})
                .then(response => result = response.data)
                .catch((errors) => setError(true));
                if(result !== undefined && result.noResults === true)
                    setNoResults(true);
                else
                    setAllOrders(result);
                setLoaded(true);
        }
        getAllOrders();
    }, [updates]);

    useEffect(() => {
        async function getOrderInfo() {
            let result;
            await axios.post(orders_URL + orderToOpen._id)
                .then(response => result = response.data)
                .catch((errors) => console.log(errors));
            setOrderInfo(result);
        }
        getOrderInfo();
    }, [orderToOpen, updates])

    const removeDrink = async (drink) => {
        let result;
        await axios.patch(orders_URL + 'drink/' + orderInfo._id,
        {
          admin: 'admin',
          drink: drink
        })
          .then(response => result = response.data)
          .catch((errors) => console.log(errors));    //<------------ GESTIRE ERRORI!
        if(result.removed === true) {
            setUpdates(updates + 1);
        }
    } 
  
      const removeBeer = async (beer) => {
        let result;
        await axios.patch(orders_URL + 'beer/' + orderInfo._id,
        {
          admin: 'admin',
          beer: beer
        })
          .then(response => result = response.data)
          .catch((errors) => console.log(errors));    //<------------ GESTIRE ERRORI!
        if(result.removed === true) {
            setUpdates(updates + 1);
        }
    } 
  
      const removeDish = async (dish) => {
        let result;
        await axios.patch(orders_URL + 'dish/' + orderInfo._id,
        {
          admin: 'admin',
          dish: dish
        })
          .then(response => result = response.data)
          .catch((errors) => console.log(errors));    //<------------ GESTIRE ERRORI!
        if(result.removed === true) {
          setUpdates(updates + 1);
        }
    } 

    const showLoading = () => {
        if(loaded === false)
            return(
                <div className="loading" hidden={loaded}>
                    <CircularProgress color="secondary" />
                </div>
            );
    }

    const showTable = () => {
        if(loaded === true && noResults === false && error === false)
            return(
                <TableContainer component={Paper} elevation={5}>
                            <Table className="table" aria-label="customized table">
                                <TableHead>
                                <TableRow style={{backgroundColor: '#ffa001bd', color: '#ffffff'}}>
                                    <TableCell align="center">ORDINE</TableCell>
                                    <TableCell align="center">DATA</TableCell>
                                    <TableCell align="center">TAVOLO</TableCell>
                                    <TableCell align="center">STATO</TableCell>
                                    <TableCell align="center">PORTATE</TableCell>
                                    <TableCell align="center">SUBTOTALE</TableCell>
                                    <TableCell align="center" style={{width: 56}}>INFO</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allOrders.map((order) => (
                                        <TableRow key={order._id} style={{borderColor: '#c3c3c3', backgroundColor: '#ffffff'}}>
                                        <TableCell align="center" style={{fontWeight: 'bold'}}>{order._id}</TableCell>
                                        <TableCell align="center">{getFormattedDate(order.date)}</TableCell>
                                        <TableCell align="center">{order.table === undefined ? '' : order.table.name}</TableCell>
                                        <TableCell align="center" style={{fontWeight: 'bold'}}>{order.completed ? <span style={{color: '#dd0000'}}>COMPLETATO</span> : <span style={{color: '#00ee00'}}>ATTIVO</span>}</TableCell>
                                        <TableCell align="center">{order.dishes.length}</TableCell>
                                        <TableCell align="center" style={{fontWeight: 'bold'}}>{parseFloat(order.subtotal).toFixed(2) + ' €'}</TableCell>
                                        <TableCell align="center" style={{width: 50}}>
                                            <IconButton aria-label="Modifica" onClick={() => {setOrderToOpen(order); openDialog()}}>
                                                <InfoIcon color="secondary" />
                                            </IconButton> 
                                        </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
            );
    }

    const openDialog = () => {
        setDialogOpen(true);
    }

    const closeDialog = () => {
        setDialogOpen(false);
    }

    const showDialog = () => {
        return(
            <Dialog open={dialogOpen} onClose={closeDialog} aria-labelledby="form-dialog-title" style={{padding: 10}}>
                <DialogTitle id="form-dialog-title" style={{backgroundColor: '#fffe7299'}}>DETTAGLI ORDINE <Button onClick={() => setUpdates(updates + 1)}>Aggiorna</Button> </DialogTitle>
                <DialogContent style={{display: 'grid', minWidth: 500, backgroundColor: '#fffe7299'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <div style={{borderRadius: 10, padding: 10, margin: 5, backgroundColor: '#ff942fa1'}}>
                                    ID: <span style={{fontWeight: 'bold'}}>{orderInfo._id}</span>
                                </div>
                                <div style={{borderRadius: 10, padding: 10, margin: 5, backgroundColor: '#ff942fa1'}}>
                                    Tavolo: <span style={{fontWeight: 'bold'}}>{orderInfo.table === undefined || orderInfo.table === null ? '' : orderInfo.table.name}</span>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <Grid item xs={6}>
                                        <div style={{borderRadius: 10, padding: 10, margin: 5, backgroundColor: '#ff942fa1'}}>
                                            <EventIcon style={{fontSize: 'small'}} /> <span style={{fontWeight: 'bold'}}>{getFormattedDate(orderInfo.date)}</span>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <div style={{borderRadius: 10, padding: 10, margin: 5, backgroundColor: '#ff942fa1'}}>
                                            <AccessTimeIcon style={{fontSize: 'small'}} /> <span style={{fontWeight: 'bold'}}>{getFormattedTime(orderInfo.starting_time)}</span>
                                        </div>
                                    </Grid>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <QRCode value={orderInfo._id} style={{marginTop: 5, borderStyle: 'solid', borderWidth: 5, borderColor: '#fff'}} />
                        </Grid>
                    </Grid>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Grid item xs={4}>
                            <div style={{borderRadius: 10, padding: 10, margin: 5, backgroundColor: '#ff942fa1'}}>
                                Pagato: <span style={{fontWeight: 'bold'}}>{parseFloat(orderInfo.partial_paid).toFixed(2)} €</span>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div style={{borderRadius: 10, padding: 10, margin: 5, backgroundColor: '#ff2f2fa8'}}>
                                Residuo: <span style={{fontWeight: 'bold'}}>{parseFloat(orderInfo.subtotal - orderInfo.partial_paid).toFixed(2)} €</span>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div style={{borderRadius: 10, padding: 10, margin: 5, backgroundColor: '#6ce85b94'}}>
                                Totale: <span style={{fontWeight: 'bold'}}>{parseFloat(orderInfo.subtotal).toFixed(2)} €</span>
                            </div>
                        </Grid>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Grid item xs={4}>
                            <div style={{borderRadius: 10, margin: 5, backgroundColor: '#ff942fa1'}}>
                                <p style={{textAlign: 'center', margin: 6}}>PIATTI</p>
                                {orderInfo.dishes.map((dish, index) => <span key={dish._id} style={{backgroundColor: (index % 2 == 0 ? '#fff42bcd' : '#fffd5f'), display: 'flex', borderBottomLeftRadius: (index === orderInfo.dishes.length - 1 ? 10 : 0), borderBottomRightRadius: (index === orderInfo.dishes.length - 1 ? 10 : 0), fontSize: 13}}> - {dish.name} <Button onClick={() => {removeDish(dish); setUpdates(updates + 1)}}><ClearIcon style={{fontSize: 10}}/></Button> <br /></span>)}
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div style={{borderRadius: 10, margin: 5, backgroundColor: '#ff942fa1'}}>
                                <p style={{textAlign: 'center', margin: 6}}>BIBITE</p>
                                {orderInfo.drinks.map((drink, index) => <span key={drink._id} style={{backgroundColor: (index % 2 == 0 ? '#fff42bcd' : '#fffd5f'), display: 'flex', borderBottomLeftRadius: (index === orderInfo.drinks.length - 1 ? 10 : 0), borderBottomRightRadius: (index === orderInfo.drinks.length - 1 ? 10 : 0), fontSize: 13}}> - {drink.name + ' ' + drink.size} <Button onClick={() => removeDrink(drink)}><ClearIcon style={{fontSize: 10}}/></Button><br /></span>)}
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div style={{borderRadius: 10, margin: 5, backgroundColor: '#ff942fa1'}}>
                                <p style={{textAlign: 'center', margin: 6}}>BIRRE</p>
                                {orderInfo.beers.map((beer, index) => <span key={beer._id} style={{backgroundColor: (index % 2 == 0 ? '#fff42bcd' : '#fffd5f'), display: 'flex', borderBottomLeftRadius: (index === orderInfo.beers.length - 1 ? 10 : 0), borderBottomRightRadius: (index === orderInfo.beers.length - 1 ? 10 : 0), fontSize: 13}}> - {beer.name + ' ' + beer.size} <Button onClick={() => removeBeer(beer)}><ClearIcon style={{fontSize: 10}}/></Button><br /></span>)}
                            </div>
                        </Grid>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Grid item xs={12}>
                            <div style={{borderRadius: 10, margin: 5, backgroundColor: '#ff942fa1'}}>
                                <p style={{textAlign: 'center', margin: 6}}>LOG ORDINE</p>
                                {orderInfo.order_log === undefined ? null : orderInfo.order_log.map((event, index) => <span key={index} style={{backgroundColor: (index % 2 == 0 ? '#fff42bcd' : '#fffd5f'), display: 'flex', borderBottomLeftRadius: (index === orderInfo.order_log.length - 1 ? 10 : 0), borderBottomRightRadius: (index === orderInfo.order_log.length - 1 ? 10 : 0), fontSize: 13}}> &nbsp; {getFormattedEventTime(event)}<br /></span>)}
                            </div>
                        </Grid>
                    </div>
                </DialogContent>
                <DialogActions style={{backgroundColor: '#fffe7299'}}>
                    
                </DialogActions>
            </Dialog>
        );
    }

   {/* const addDrink = async () => {
        let result;
        if(newDrink.name !== undefined && newDrink.name !== null && newDrink.name !== '') {
            await axios.post(drinks_URL + 'add', newDrink)
                .then(response => result = response.data)
                .catch((errors) => setError(true));
                if(result.added)
                    setUpdates(updates + 1);
                else
                    setError(true);
                closeDialog();
            }
    }

    const editDrink = async () => {
        let result;
        if(newDrink.name !== undefined && newDrink.name !== null && newDrink.name !== '') {
            await axios.put(drinks_URL + newDrink._id, newDrink)
                .then(response => result = response.data)
                .catch((errors) => setError(true));
                if(result.edited) {
                    setUpdates(updates + 1);
                }
                setEdit(false);
                closeDialog();
            }
    }

    const deleteDrink = async () => {
        let result;
        await axios.patch(drinks_URL + newDrink._id)
            .then(response => result = response.data)
            .catch((errors) => setError(true));
            if(result.deleted) {
                setUpdates(updates + 1);
            }
            setEdit(false);
            closeDialog();
    } */}

    return(error ?
        <>
            <Alert severity="error" style={{marginTop: 75, width: '80%', display: 'inline-flex', justifyContent: 'center'}}>
            <AlertTitle>Errore</AlertTitle>
            Errore durante la comunicazione con il server. <Button onClick={() => window.location.reload()} >Ricarica</Button>
            </Alert>
        </>
        :
        <div className="allOrders" style={{marginTop: 65}}>
            {showLoading()}
            {showTable()}
            {openDialog && orderInfo !== undefined ? showDialog() : null}
            <div hidden={!loaded} style={{position: 'fixed', bottom: '16%', marginLeft: 10}}>
                <Fab 
                    color="primary" 
                    aria-label="add"
                    style={{marginTop: 10, backgroundColor: '#5cf746', height: 80, width: 80}} 
                    onClick={openDialog}>
                    <AddIcon fontSize="large" />
                </Fab>
                    </div>
        </div>
    );
}
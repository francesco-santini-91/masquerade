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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';

export default function AllDrinks__admin() {
    const drinks_URL = 'http://localhost:4000/drinks_menu/';
    const [updates, setUpdates] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [error, setError] = useState(false);
    const [allDrinks, setAllDrinks] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [qty, setQty] = useState("");
    const [price, setPrice] = useState("");
    const [edit, setEdit] = useState(false);
    const [newDrink, setNewDrink] = useState(
        {
            _id: null,
            name: null,
            producer: null,
            type: null,
            size: [],
            available: null,
            image_url: null
        });

    useEffect(() => {
        async function getAllDrinks() {
            let result;
            await axios.post(drinks_URL, {admin: 'admin'})
                .then(response => result = response.data)
                .catch((errors) => setError(true));
                if(result !== undefined && result.noResults === true)
                    setNoResults(true);
                else
                    setAllDrinks(result);
                setLoaded(true);
        }
        getAllDrinks();
    }, [updates]);

    const changeAvailability = async (event, drink_ID) => {
        let result;
        await axios.post(drinks_URL + 'setAvailability/' + drink_ID, {available: event.target.checked})
            .then(response => result = response.data)
            .catch((errors) => setError(true));
        setUpdates(updates + 1);
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
                                    <TableCell align="center">NOME</TableCell>
                                    <TableCell align="center">MARCA</TableCell>
                                    <TableCell align="center">TIPO</TableCell>
                                    <TableCell align="center">ORDINI</TableCell>
                                    <TableCell align="center">DISPONIBILE</TableCell>
                                    <TableCell align="center" style={{width: 56}}>MODIFICA</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allDrinks.map((drink) => (
                                        <TableRow key={drink._id} style={{borderColor: '#c3c3c3', backgroundColor: (!drink.available ? '#ff778d' : '#ffffff')}}>
                                        <TableCell align="center" style={{fontWeight: 'bold'}}>{drink.name.toUpperCase()}</TableCell>
                                        <TableCell align="center" style={{fontStyle: 'italic'}}>{drink.producer}</TableCell>
                                        <TableCell align="center">{drink.type}</TableCell>
                                        <TableCell align="center" style={{fontWeight: 'bold'}}>{drink.number_of_orders}</TableCell>
                                        <TableCell align="center">
                                            <Checkbox
                                                checked={drink.available}
                                                onChange={(event) => changeAvailability(event, drink._id)}
                                                inputProps={{ 'aria-label': 'Disponibilità' }}
                                            /></TableCell>
                                        <TableCell align="center" style={{width: 50}}>
                                            <IconButton aria-label="Modifica" onClick={() => {setNewDrink(drink); openDialog(); setEdit(true)}}>
                                                <EditIcon color="secondary" />
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
        setNewDrink({
            _id: null,
            name: null,
            producer: null,
            type: null,
            size: [],
            available: null,
            image_url: null
        });
        setEdit(false);
        setQty("");
        setPrice("");
    }

    const showFormats = (drink) => {
        let formats = [];
        if(newDrink.size !== undefined) {
            drink.size.map((size, index) => {formats.push(<span key={index} id={index+index} style={{padding: 3}}>{size.qty} - {parseFloat(size.price).toFixed(2)} € <Button onClick={() => {removeFormat(index);}}><DeleteIcon color="secondary" fontSize="small" /></Button><br /></span>)})
        }
        return formats;
    }

    const removeFormat = (index) => {
        newDrink.size.splice(index, 1);
        let node = document.getElementById(index+index);
        node.setAttribute("hidden", "true");
    }

    const addDrink = async () => {
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
    }

    return(error ?
        <>
            <Alert severity="error" style={{marginTop: 75, width: '80%', display: 'inline-flex', justifyContent: 'center'}}>
            <AlertTitle>Errore</AlertTitle>
            Errore durante la comunicazione con il server. <Button onClick={() => window.location.reload()} >Ricarica</Button>
            </Alert>
        </>
        :
        <div className="allDrinks" style={{marginTop: 65}}>
            {showLoading()}
            {showTable()}
            <Dialog open={dialogOpen} onClose={closeDialog} aria-labelledby="form-dialog-title" style={{padding: 10}}>
                <DialogTitle id="form-dialog-title">{edit ? 'MODIFICA' : 'AGGIUNGI'} BIBITA</DialogTitle>
                <DialogContent style={{display: 'grid'}}>
                <TextField
                    required={true}
                    variant="outlined"
                    defaultValue={newDrink.name}
                    margin="dense"
                    id="name"
                    label="Nome"
                    type="text"
                    onChange={(event) => setNewDrink({...newDrink, name: event.target.value})}
                />
                <TextField
                    variant="outlined"
                    defaultValue={newDrink.producer}
                    margin="dense"
                    id="producer"
                    label="Marca"
                    type="text"
                    onChange={(event) => setNewDrink({...newDrink, producer: event.target.value})}
                />
                <TextField
                    variant="outlined"
                    defaultValue={newDrink.type}
                    margin="dense"
                    id="type"
                    label="Tipo"
                    type="text"
                    onChange={(event) => setNewDrink({...newDrink, type: event.target.value})}
                />
                <div style={{borderColor: '#c3c3c3', borderWidth: 0, borderStyle: 'solid'}}>
                <TextField
                    variant="outlined"
                    style={{marginRight: 10}}
                    value={qty}
                    margin="dense"
                    id="qty"
                    label="Formato"
                    type="text"
                    onChange={(event) => setQty(event.target.value)}
                />
                <TextField
                    variant="outlined"
                    style={{maxWidth: 80}}
                    value={parseFloat(price).toFixed(2)}
                    inputProps={{step: 0.5}}
                    margin="dense"
                    id="price"
                    label="Prezzo"
                    type="number"
                    onChange={(event) => setPrice(event.target.value)}
                />           
                <Button onClick={() => {if(qty !== "" && price !== "") newDrink.size.push({qty, price}); setQty(""); setPrice("")}} color="primary" style={{height: 59}}>
                    <AddIcon color="secondary" fontSize="large" />
                </Button> 
                <div style={{borderWidth: 1, borderColor: '#c3c3c3',borderStyle: 'solid', borderRadius: 8, padding: 5}}><span>{showFormats(newDrink)}</span></div>
                </div>   
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={newDrink.available}
                            onChange={(event) => setNewDrink({...newDrink, available: event.target.checked})}
                        />}
                    label="Disponibile" />
                </DialogContent>
                <DialogActions>
                    <div hidden={!edit}>
                        <Button variant="contained" style={{marginRight: 30}} onClick={() => deleteDrink()} color="secondary">
                            ELIMINA BIBITA
                        </Button>
                    </div>
                    <Button onClick={closeDialog} color="secondary">
                        Annulla
                    </Button>
                    <Button onClick={() => {edit ? editDrink() : addDrink()}} color="secondary" variant="contained">
                        Salva
                    </Button>
                </DialogActions>
            </Dialog>
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
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

export default function AllBeers__admin() {
    const beers_URL = 'http://localhost:4000/beers_menu/';
    const [updates, setUpdates] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [error, setError] = useState(false);
    const [allBeers, setAllBeers] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [qty, setQty] = useState("");
    const [price, setPrice] = useState("");
    const [edit, setEdit] = useState(false);
    const [newBeer, setNewBeer] = useState(
        {
            _id: null,
            name: null,
            producer: null,
            grades: null,
            type: null,
            description: null,
            size: [],
            available: null,
            itIsNew: true,
            image_url: null
        });

    useEffect(() => {
        async function getAllBeers() {
            let result;
            await axios.post(beers_URL, {admin: 'admin'})
                .then(response => result = response.data)
                .catch((errors) => setError(true));
                if(result !== undefined && result.noResults === true)
                    setNoResults(true);
                else
                    setAllBeers(result);
                setLoaded(true);
        }
        getAllBeers();
    }, [updates]);

    const changeAvailability = async (event, beer_ID) => {
        let result;
        await axios.post(beers_URL + 'setAvailability/' + beer_ID, 
            {
                available: event.target.checked
            })
            .then(response => result = response.data)
            .catch((errors) => setError(true));
        setUpdates(updates + 1);
    }

    const changeItIsNew = async (event, beer_ID) => {
        let result;
        await axios.post(beers_URL + 'setItIsNew/' + beer_ID, 
            {
                itIsNew: event.target.checked
            })
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
                                    <TableCell align="center">BIRRIFICIO</TableCell>
                                    <TableCell align="center">TIPO</TableCell>
                                    <TableCell align="center">GRADI</TableCell>
                                    <TableCell align="center">ORDINI</TableCell>
                                    <TableCell align="center">DISPONIBILE</TableCell>
                                    <TableCell align="center">NOVITA'</TableCell>
                                    <TableCell align="center" style={{width: 56}}>MODIFICA</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allBeers.map((beer) => (
                                        <TableRow key={beer._id} style={{borderColor: '#c3c3c3', backgroundColor: (!beer.available ? '#ff778d' : '#ffffff')}}>
                                        <TableCell align="center" style={{fontWeight: 'bold'}}>{beer.name.toUpperCase()}</TableCell>
                                        <TableCell align="center" style={{fontStyle: 'italic'}}>{beer.producer}</TableCell>
                                        <TableCell align="center">{beer.type}</TableCell>
                                        <TableCell align="center" style={{fontStyle: 'italic'}}>{beer.grades + '°'}</TableCell>
                                        <TableCell align="center" style={{fontWeight: 'bold'}}>{beer.number_of_orders}</TableCell>
                                        <TableCell align="center">
                                            <Checkbox
                                                checked={beer.available}
                                                onChange={(event) => changeAvailability(event, beer._id)}
                                                inputProps={{ 'aria-label': 'Disponibilità' }}
                                            /></TableCell>
                                        <TableCell align="center">
                                            <Checkbox
                                                checked={beer.itIsNew}
                                                onChange={(event) => changeItIsNew(event, beer._id)}
                                                inputProps={{ 'aria-label': 'Novità' }}
                                            /></TableCell>
                                        <TableCell align="center" style={{width: 50}}>
                                            <IconButton aria-label="Modifica" onClick={() => {setNewBeer(beer); openDialog(); setEdit(true)}}>
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
        setNewBeer({
            _id: null,
            name: null,
            producer: null,
            grades: null,
            type: null,
            description: null,
            size: [],
            available: true,
            itIsNew: null,
            image_url: null
        });
        setEdit(false);
        setQty("");
        setPrice("");
    }

    const showFormats = (beer) => {
        let formats = [];
        if(newBeer.size !== undefined) {
            beer.size.map((size, index) => {formats.push(<span key={index} id={index+index} style={{padding: 3}}>{size.qty} - {parseFloat(size.price).toFixed(2)} € <Button onClick={() => {removeFormat(index);}}><DeleteIcon color="secondary" fontSize="small" /></Button><br /></span>)})
        }
        return formats;
    }

    const removeFormat = (index) => {
        newBeer.size.splice(index, 1);
        let node = document.getElementById(index+index);
        node.setAttribute("hidden", "true");
    }

    const addBeer = async () => {
        let result;
        if(newBeer.name !== undefined) {
            await axios.post(beers_URL + 'add', newBeer)
                .then(response => result = response.data)
                .catch((errors) => setError(true));
                if(result.added)
                    setUpdates(updates + 1);
                else
                    setError(true);
                closeDialog();
            }
    }

    const editBeer = async () => {
        let result;
        if(newBeer.name !== undefined) {
            await axios.put(beers_URL + newBeer._id, newBeer)
                .then(response => result = response.data)
                .catch((errors) => setError(true));
                if(result.edited) {
                    setUpdates(updates + 1);
                }
                setEdit(false);
                closeDialog();
            }
    }

    const deleteBeer = async () => {
        let result;
        await axios.patch(beers_URL + newBeer._id)
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
        <div className="allBeers" style={{marginTop: 65}}>
            {showLoading()}
            {showTable()}
            <Dialog open={dialogOpen} onClose={closeDialog} aria-labelledby="form-dialog-title" style={{padding: 15}}>
                <DialogTitle id="form-dialog-title">{edit ? 'MODIFICA' : 'AGGIUNGI'} BIRRA</DialogTitle>
                <DialogContent style={{display: 'grid'}}>
                <TextField
                    variant="outlined"
                    required={true}
                    defaultValue={newBeer.name}
                    margin="dense"
                    id="name"
                    label="Nome"
                    type="text"
                    onChange={(event) => setNewBeer({...newBeer, name: event.target.value})}
                />
                <TextField
                    variant="outlined"
                    defaultValue={newBeer.producer}
                    margin="dense"
                    id="producer"
                    label="Birrificio"
                    type="text"
                    onChange={(event) => setNewBeer({...newBeer, producer: event.target.value})}
                />
                <div>
                <TextField
                    variant="outlined"
                    value={parseFloat(newBeer.grades).toFixed(1)}
                    inputProps={{step: 0.5}}
                    style={{maxWidth: 70, marginRight: 10}}
                    margin="dense"
                    id="grades"
                    label="Gradi"
                    type="number"
                    onChange={(event) => setNewBeer({...newBeer, grades: event.target.value})}
                />
                <TextField
                    variant="outlined"
                    defaultValue={newBeer.type}
                    margin="dense"
                    id="type"
                    label="Tipo"
                    type="text"
                    onChange={(event) => setNewBeer({...newBeer, type: event.target.value})}
                />
                </div>
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
                    label="€"
                    type="number"
                    onChange={(event) => setPrice(event.target.value)}
                />           
                <Button onClick={() => {if(qty !== "" && price !== "") newBeer.size.push({qty, price}); setQty(""); setPrice("")}} color="primary" style={{height: 59}}>
                    <AddIcon color="secondary" fontSize="large" />
                </Button> 
                <div style={{borderWidth: 1, borderColor: '#c3c3c3',borderStyle: 'solid', borderRadius: 8, padding: 5}}><span>{showFormats(newBeer)}</span></div>
                </div>   
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={newBeer.available}
                            onChange={(event) => setNewBeer({...newBeer, available: event.target.checked})}
                        />}
                    label="Disponibile" />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={newBeer.itIsNew}
                            onChange={(event) => setNewBeer({...newBeer, itIsNew: event.target.checked})}
                        />}
                    label="Novità" />
                <TextField
                    variant="outlined"
                    defaultValue={newBeer.description}
                    fullWidth={true}
                    multiline={true}
                    rows={3}
                    margin="dense"
                    id="description"
                    label="Descrizione"
                    type="text"
                    onChange={(event) => setNewBeer({...newBeer, description: event.target.value})}
                />
                </DialogContent>
                <DialogActions style={{justifyContent: 'center'}}>
                    <div hidden={!edit}>
                        <Button variant="contained" style={{marginRight: 30}} onClick={() => deleteBeer()} color="secondary">
                            ELIMINA BIRRA
                        </Button>
                    </div>
                    <Button onClick={closeDialog} color="secondary">
                        Annulla
                    </Button>
                    <Button onClick={() => {edit ? editBeer() : addBeer()}} color="secondary" variant="contained">
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
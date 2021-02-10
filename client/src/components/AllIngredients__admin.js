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
import { Alert, AlertTitle } from '@material-ui/lab';
import axios from 'axios';

export default function AllIngredients__admin() {
    const ingredients_URL = 'http://localhost:4000/ingredients/';
    const [updates, setUpdates] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [error, setError] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [newIngredient, setNewIngredient] = useState(
        {
            _id: null,
            name: null,
            type: null,
            available: null
        });
    const [allIngredients, setAllIngredients] = useState([]);

    useEffect(() => {
        async function getAllIngredients() {
            let result;
            await axios.post(ingredients_URL)
                .then(response => result = response.data)
                .catch((errors) => setError(true));
                if(result !== undefined && result.noResults === true)
                    setNoResults(true);
                else
                    setAllIngredients(result);
                setLoaded(true);
        }
        getAllIngredients();
    }, [updates]);

    const changeAvailability = async (event, ingredient_ID) => {
        let result;
        await axios.post(ingredients_URL + 'setAvailability/' + ingredient_ID, {available: event.target.checked})
            .then(response => result = response.data)
            .catch((errors) => setError(true));
        setUpdates(updates + 1);
    }

    const openDialog = () => {
        setDialogOpen(true);
    }

    const closeDialog = () => {
        setDialogOpen(false);
        setNewIngredient(
            {
                _id: null,
                name: null,
                type: null,
                available: null
            }
        );
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
                            <Table className="table" aria-label="customized table" size="small">
                                <TableHead>
                                <TableRow style={{backgroundColor: '#ffa001bd', color: '#ffffff', height: 56}}>
                                    <TableCell align="center">NOME</TableCell>
                                    <TableCell align="center">GENERE</TableCell>
                                    <TableCell align="center">DISPONIBILE</TableCell>
                                    <TableCell align="center">MODIFICA</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allIngredients.map((ingredient) => (
                                        <TableRow key={ingredient._id} style={{borderColor: '#c3c3c3', backgroundColor: (!ingredient.available ? '#ff778d' : '#ffffff')}}>
                                        <TableCell align="center" style={{fontWeight: 'bold'}}>{ingredient.name.toUpperCase()}</TableCell>
                                        <TableCell align="center" style={{fontStyle: 'italic'}}>{ingredient.type}</TableCell>
                                        <TableCell align="center">
                                            <Checkbox
                                                checked={ingredient.available}
                                                onChange={(event) => changeAvailability(event, ingredient._id)}
                                                inputProps={{ 'aria-label': 'Disponibilità' }}
                                            /></TableCell>
                                        <TableCell align="center" style={{width: 50}}>
                                            <IconButton aria-label="Modifica" onClick={() => {setNewIngredient(ingredient); openDialog(); setEdit(true)}}>
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

    const addIngredient = async () => {
        let result;
        if(newIngredient.name !== undefined) {
            await axios.post(ingredients_URL + 'add', newIngredient)
            .then(response => result = response.data)
            .catch((errors) => setError(true));
            if(result.added === true)
                setUpdates(updates + 1);
            else
                setError(true);
            closeDialog();
        }
    }

    const editIngredient = async () => {
        let result;
        if(newIngredient.name !== undefined) {
            await axios.put(ingredients_URL + newIngredient._id, newIngredient)
            .then(response => result = response.data)
            .catch((errors) => setError(true));
            if(result.edited === true)
                setUpdates(updates + 1);
            else
                setError(true);
            closeDialog();
            setEdit(false);
        }
    }

    const deleteIngredient = async () => {
        let result;
        await axios.patch(ingredients_URL + newIngredient._id)
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
            Errore durante il caricamento della tabella. <strong>Riprova</strong>
            </Alert>
        </>
        :
        <div className="allIngredients" style={{marginTop: 65}}>
            {showLoading()}
            {showTable()}
            <Dialog open={dialogOpen} onClose={closeDialog} aria-labelledby="form-dialog-title" style={{padding: 10}}>
                <DialogTitle id="form-dialog-title">{edit ? 'MODIFICA' : 'AGGIUNGI'} INGREDIENTE</DialogTitle>
                <DialogContent style={{display: 'grid'}}>
                <TextField
                    required={true}
                    defaultValue={newIngredient.name}
                    margin="dense"
                    id="name"
                    label="Nome"
                    type="text"
                    onChange={(event) => setNewIngredient({...newIngredient, name: event.target.value})}
                />
                <TextField
                    defaultValue={newIngredient.type}
                    margin="dense"
                    id="type"
                    label="Tipo"
                    type="text"
                    onChange={(event) => setNewIngredient({...newIngredient, type: event.target.value})}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={newIngredient.available}
                            onChange={(event) => setNewIngredient({...newIngredient, available: event.target.checked})}
                        />}
                    label="Disponibile" 
                />
                 </DialogContent>
                <DialogActions>
                    <div hidden={!edit}>
                        <Button variant="contained" style={{marginRight: 30}} onClick={() => deleteIngredient()} color="secondary">
                            ELIMINA INGREDIENTE
                        </Button>
                    </div>
                    <Button onClick={closeDialog} color="secondary">
                        Annulla
                    </Button>
                    <Button onClick={() => {edit ? editIngredient() : addIngredient()}} color="secondary" variant="contained">
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
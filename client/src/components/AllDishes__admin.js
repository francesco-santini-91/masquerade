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
import Autocomplete from '@material-ui/lab/Autocomplete';
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
    const dishes_URL = 'http://localhost:4000/dishes_menu/';
    const ingredients_URL = 'http://localhost:4000/ingredients/';
    const [updates, setUpdates] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [error, setError] = useState(false);
    const [allDishes, setAllDishes] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newIngredient, setNewIngredient] = useState(null);
    const [newNecessaryIngredient, setNewNecessaryIngredient] = useState(null);
    const [edit, setEdit] = useState(false);
    const [newDish, setNewDish] = useState(
        {
            _id: null,
            name: null,
            description: null,
            type: null,
            ingredients: [],
            necessary_ingredients: [],
            divisible: false,
            price: null,
            available: false,
            itIsNew: false,
            editable: false,
            divisible: false,
            image_url: null
        });

    useEffect(() => {
        async function getAllDishes() {
            let result;
            await axios.post(dishes_URL, {admin: 'admin'})
                .then(response => result = response.data)
                .catch((errors) => setError(true));
                if(result !== undefined && result.noResults === true)
                    setNoResults(true);
                else
                    setAllDishes(result);
                setLoaded(true);
        }
        getAllDishes();
    }, [updates]);

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
        }
        getAllIngredients();
    }, [dialogOpen]);

    const changeAvailability = async (event, dish_ID) => {
        let result;
        await axios.post(dishes_URL + 'setAvailability/' + dish_ID, 
            {
                available: event.target.checked
            })
            .then(response => result = response.data)
            .catch((errors) => setError(true));
        setUpdates(updates + 1);
    }

    const changeItIsNew = async (event, dish_ID) => {
        let result;
        await axios.post(dishes_URL + 'setItIsNew/' + dish_ID, 
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
                                    <TableCell align="center">TIPO</TableCell>
                                    <TableCell align="center">INGREDIENTI</TableCell>
                                    <TableCell align="center">INGREDIENTI NECESSARI</TableCell>
                                    <TableCell align="center">PREZZO</TableCell>
                                    <TableCell align="center">ORDINI</TableCell>
                                    <TableCell align="center">DISPONIBILE</TableCell>
                                    <TableCell align="center">NOVITA'</TableCell>
                                    <TableCell align="center" style={{width: 56}}>MODIFICA</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allDishes.map((dish) => (
                                        <TableRow key={dish._id} style={{borderColor: '#c3c3c3', backgroundColor: (!dish.available ? '#ff778d' : '#ffffff')}}>
                                        <TableCell align="center" style={{fontWeight: 'bold'}}>{dish.name.toUpperCase()}</TableCell>
                                        <TableCell align="center">{dish.type}</TableCell>
                                        <TableCell align="center" style={{fontStyle: 'italic'}}>{dish.ingredients.map((ingredient, index) => <span>{ingredient.name + (index < dish.ingredients.length - 1 ? ', ' : '')}</span>)}</TableCell>
                                        <TableCell align="center" style={{fontStyle: 'italic'}}>{dish.necessary_ingredients.map((ingredient, index) => <span>{ingredient.name + (index < dish.necessary_ingredients.length - 1 ? ', ' : '')}</span>)}</TableCell>
                                        <TableCell align="center" style={{fontStyle: 'italic'}}>{parseFloat(dish.price).toFixed(2) + ' €'}</TableCell>
                                        <TableCell align="center" style={{fontWeight: 'bold'}}>{dish.number_of_orders}</TableCell>
                                        <TableCell align="center">
                                            <Checkbox
                                                checked={dish.available}
                                                onChange={(event) => changeAvailability(event, dish._id)}
                                                inputProps={{ 'aria-label': 'Disponibilità' }}
                                            /></TableCell>
                                        <TableCell align="center">
                                            <Checkbox
                                                checked={dish.itIsNew}
                                                onChange={(event) => changeItIsNew(event, dish._id)}
                                                inputProps={{ 'aria-label': 'Novità' }}
                                            /></TableCell>
                                        <TableCell align="center" style={{width: 50}}>
                                            <IconButton aria-label="Modifica" onClick={() => {setNewDish(dish); openDialog(); setEdit(true)}}>
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
        setNewDish({
            _id: null,
            name: null,
            description: null,
            type: null,
            ingredients: [],
            necessary_ingredients: [],
            divisible: false,
            price: null,
            available: false,
            itIsNew: false,
            editable: false,
            divisible: false,
            image_url: null
        });
        setEdit(false);
    }

    const showIngredients = (dish) => {
        let ingredients = [];
        if(newDish.ingredients !== undefined) {
            dish.ingredients.map(async (ingredient, index) => {ingredients.push(<span key={index} id={index+index} style={{padding: 3}}>{ingredient.name} <Button onClick={() => {removeIngredient(index);}}><DeleteIcon color="secondary" fontSize="small" /></Button><br /></span>)})
        }
        return ingredients;
    }
    
    const showNecessaryIngredients = (dish) => {
        let necessaryIngredients = [];
        if(newDish.necessary_ingredients !== undefined) {
            dish.necessary_ingredients.map(async (necessaryIngredient, index) => {necessaryIngredients.push(<span key={index} id={index+index} style={{padding: 3}}>{necessaryIngredient.name} <Button onClick={() => {removeNecessaryIngredient(index);}}><DeleteIcon color="secondary" fontSize="small" /></Button><br /></span>)})
        }
        return necessaryIngredients;
    }

    const removeIngredient = (index) => {
        newDish.ingredients.splice(index, 1);
        let node = document.getElementById(index+index);
        node.setAttribute("hidden", "true");
    }

    const removeNecessaryIngredient = (index) => {
        newDish.necessary_ingredients.splice(index, 1);
        let node = document.getElementById(index+index);
        node.setAttribute("hidden", "true");
    }

    const addDish = async () => {
        let result;
        if(newDish.name !== null && newDish.name !== '' && newDish.name !== undefined && newDish.price !== null && newDish.price !== '') {
            await axios.post(dishes_URL + 'add', newDish)
                .then(response => result = response.data)
                .catch((errors) => setError(true));
                if(result.added === true)
                    setUpdates(updates + 1);
                else
                    setError(true);
                closeDialog();
            }
    }

    const editDish = async () => {
        let result;
        if(newDish.name !== null && newDish.name !== '' && newDish.name !== undefined && newDish.price !== null && newDish.price !== '') {
            await axios.put(dishes_URL + newDish._id, newDish)
                .then(response => result = response.data)
                .catch((errors) => setError(true));
                if(result.edited) {
                    setUpdates(updates + 1);
                }
                setEdit(false);
                closeDialog();
            }
    }

    const deleteDish = async () => {
        let result;
        await axios.patch(dishes_URL + newDish._id)
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
        <div className="allDishes" style={{marginTop: 65}}>
            {showLoading()}
            {showTable()}
            <Dialog open={dialogOpen} onClose={closeDialog} aria-labelledby="form-dialog-title" style={{padding: 15}}>
                <DialogTitle id="form-dialog-title">{edit ? 'MODIFICA' : 'AGGIUNGI'} PIATTO</DialogTitle>
                <DialogContent style={{display: 'grid'}}>
                <TextField
                    variant="outlined"
                    required={true}
                    color="secondary"
                    defaultValue={newDish.name}
                    margin="dense"
                    id="name"
                    label="Nome"
                    type="text"
                    onChange={(event) => setNewDish({...newDish, name: event.target.value})}
                />
                <TextField
                    variant="outlined"
                    defaultValue={newDish.type}
                    color="secondary"
                    margin="dense"
                    id="type"
                    label="Tipo"
                    type="text"
                    onChange={(event) => setNewDish({...newDish, type: event.target.value})}
                />
                <TextField
                    variant="outlined"
                    required={true}
                    color="secondary"
                    style={{maxWidth: 80, marginBottom: 8}}
                    value={parseFloat(newDish.price).toFixed(2)}
                    inputProps={{step: 0.5}}
                    margin="dense"
                    id="price"
                    label="€"
                    type="number"
                    onChange={(event) => setNewDish({...newDish, price: event.target.value})}
                />  
                <div style={{width: 300, display: 'flex'}}>
                <Autocomplete
                    id="ingredientsList"
                    options={allIngredients}
                    style={{width: 250}}
                    getOptionLabel={(ingredient) => ingredient.name}
                    getOptionDisabled={ingredient => ingredient.available === false}
                    onChange={(event, value) => setNewIngredient(value)}
                    renderInput={(params) =><TextField 
                                                {...params}
                                                color="secondary"
                                                label="Ingredienti" 
                                                variant="outlined"
                                            />}
                />
                <Button onClick={() => {if(newIngredient !== null) newDish.ingredients.push(newIngredient); setNewIngredient({})}} color="primary" style={{height: 59}}>
                    <AddIcon color="secondary" fontSize="large" />
                </Button> 
                </div>
                <div style={{borderWidth: 1, borderColor: '#c3c3c3',borderStyle: 'solid', borderRadius: 8, padding: 5, marginBottom: 8}}><span>{showIngredients(newDish)}</span></div>
                <div style={{width: 300, display: 'flex'}}>
                <Autocomplete
                    id="necessaryIngredientsList"
                    options={newDish.ingredients}
                    style={{width: 250}}
                    getOptionLabel={(ingredient) => ingredient.name}
                    getOptionDisabled={ingredient => ingredient.available === false}
                    onChange={(event, value) => setNewNecessaryIngredient(value)}
                    renderInput={(params) =><TextField 
                                                {...params}
                                                color="secondary"
                                                label="Ingredienti necessari" 
                                                variant="outlined"
                                            />}
                />
                <Button onClick={() => {if(newNecessaryIngredient !== null) newDish.necessary_ingredients.push(newNecessaryIngredient); setNewNecessaryIngredient({})}} color="primary" style={{height: 59}}>
                    <AddIcon color="secondary" fontSize="large" />
                </Button> 
                </div>
                <div style={{borderWidth: 1, borderColor: '#c3c3c3',borderStyle: 'solid', borderRadius: 8, padding: 5}}><span>{showNecessaryIngredients(newDish)}</span></div>  
                <TextField
                    variant="outlined"
                    required={false}
                    color="secondary"
                    defaultValue={newDish.image_url}
                    margin="dense"
                    id="image_URL"
                    label="URL immagine"
                    type="text"
                    onChange={(event) => setNewDish({...newDish, image_url: event.target.value})}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={newDish.available}
                            onChange={(event) => setNewDish({...newDish, available: event.target.checked})}
                        />}
                    label="Disponibile" />
                <FormControlLabel
                    control={
                        <Checkbox
                            defaultChecked={newDish.itIsNew}
                            onChange={(event) => setNewDish({...newDish, itIsNew: event.target.checked})}
                        />}
                    label="Novità" />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={newDish.editable}
                            onChange={(event) => setNewDish({...newDish, editable: event.target.checked})}
                        />}
                    label="Modificabile" />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={newDish.divisible}
                            onChange={(event) => setNewDish({...newDish, divisible: event.target.checked})}
                        />}
                    label="Divisibile" />
                <TextField
                    variant="outlined"
                    defaultValue={newDish.description}
                    color="secondary"
                    fullWidth={true}
                    multiline={true}
                    rows={3}
                    margin="dense"
                    id="description"
                    label="Descrizione"
                    type="text"
                    onChange={(event) => setNewDish({...newDish, description: event.target.value})}
                />
                </DialogContent>
                <DialogActions style={{justifyContent: 'center'}}>
                    <div hidden={!edit}>
                        <Button variant="contained" style={{marginRight: 30}} onClick={() => deleteDish()} color="secondary">
                            ELIMINA PIATTO
                        </Button>
                    </div>
                    <Button onClick={closeDialog} color="secondary">
                        Annulla
                    </Button>
                    <Button onClick={() => {edit ? editDish() : addDish()}} color="secondary" variant="contained">
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
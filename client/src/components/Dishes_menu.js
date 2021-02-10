import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import { Alert, AlertTitle } from '@material-ui/lab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import axios from 'axios';
import Single_dish from './Single_dish';

export default function Beers(props) {
    const dishes_URL = 'http://localhost:4000/dishes_menu/';
    const ingredients_URL = 'http://localhost:4000/ingredients';
    const [loaded, setLoaded] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [error, setError] = useState(false);
    const [dishes, setDishes] = useState([]);
    const [allIngredients, setAllIngredients] = useState([])

    useEffect(() => {
        async function getDishesOnMenu() {
            let result
            await axios.post(dishes_URL, {})
                .then(response => result = response.data)
                .catch((errors) => setError(true));
                if(result !== undefined && result.noResults === true)
                    setNoResults(true);
                else
                    setDishes(result);
                setLoaded(true);
        }
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
        getDishesOnMenu();
    }, []);

    const showDishes = () => {
        let __dishes = [];
        if(dishes !== undefined)
            for(let dish of dishes)
                __dishes.push(<Single_dish key={dish._id} dish={dish} allIngredients={allIngredients} orderID={props.orderID} socket={props.socket} />);
        return __dishes;
    }

    return(error ? 
        <>
            <Alert severity="error" style={{marginTop: 75, width: '80%', display: 'inline-flex', justifyContent: 'center'}}>
            <AlertTitle>Errore</AlertTitle>
            Errore durante il caricamento del menu. <strong>Riprova</strong>
            </Alert>
            <div className="backButton" style={{marginTop: 10, marginLeft: 10, bottom: '17%', textAlign: 'left', position: 'fixed', zIndex: 100}}>
                <Fab color="secondary" size="large" aria-label="Indietro" style={{textAlign: 'center'}} onClick={() => props.setComponent(0)}>
                    <ArrowBackIcon />
                </Fab>
            </div>
        </>
       :
        <>
            <div className="backButton" style={{marginTop: 10, marginLeft: 10, bottom: '15%', textAlign: 'left', position: 'fixed', zIndex: 100}}>
                <Fab color="secondary" size="large" aria-label="Indietro" style={{textAlign: 'center'}} onClick={() => props.setComponent(0)}>
                    <ArrowBackIcon />
                </Fab>
            </div>
            <div hidden={loaded} className="loading" style={{marginTop: 100}}>
                <CircularProgress />
            </div>
            <div hidden={!loaded} className="dishMenu" style={{marginTop: 65, padding: 10, marginBottom: 130}}>
                {showDishes()}
            </div>
        </>
    );
}
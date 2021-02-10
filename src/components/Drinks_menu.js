import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import { Alert, AlertTitle } from '@material-ui/lab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import axios from 'axios';
import Single_drink from './Single_drink';

export default function Beers(props) {
    const drinks_URL = 'http://localhost:4000/drinks_menu/';
    const [loaded, setLoaded] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [error, setError] = useState(false);
    const [drinks, setDrinks] = useState([]);

    useEffect(() => {
        async function getDrinksOnMenu() {
            let result;
            await axios.post(drinks_URL, {})
                .then(response => result = response.data)
                .catch((errors) => console.log(errors));
                if(result !== undefined && result.noResults === true)
                    setNoResults(true);
                else
                    setDrinks(result);
                setLoaded(true);
        }
        getDrinksOnMenu();
    }, []);

    const showDrinks = () => {
        let __drinks = [];
        if(drinks !== undefined)
            for(let drink of drinks)
                __drinks.push(<Single_drink key={drink._id} drink={drink} orderID={props.orderID} socket={props.socket} />);
        return __drinks;
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
        <div hidden={!loaded} className="beerMenu" style={{marginTop: 65, padding: 10, marginBottom: 130}}>
            {showDrinks()}
        </div>
    </>
    );
}
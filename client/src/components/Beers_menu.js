import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import { Alert, AlertTitle } from '@material-ui/lab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import axios from 'axios';
import Single_beer from './Single_beer';

export default function Beers(props) {
    const beers_URL = 'http://localhost:4000/beers_menu/';
    const [loaded, setLoaded] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [error, setError] = useState(false);
    const [beers, setBeers] = useState([]);

    useEffect(() => {
        async function getBeersOnMenu() {
            let result
            await axios.post(beers_URL, {})
                .then(response => result = response.data)
                .catch((errors) => setError(true));
                if(result !== undefined && result.noResults === true)
                    setNoResults(true);
                else
                    setBeers(result);
                setLoaded(true);
        }
        getBeersOnMenu();
    }, []);

    const showBeers = () => {
        let __beers = [];
        if(beers !== undefined)
            for(let beer of beers)
                __beers.push(<Single_beer key={beer._id} beer={beer} orderID={props.orderID} socket={props.socket} />);
        return __beers;
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
                {showBeers()}
            </div>
        </>
    );
}

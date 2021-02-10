import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AllBeers__admin from './AllBeers__admin';
import AllDishes__admin from './AllDishes__admin';
import AllDrinks__admin from './AllDrinks__admin';
import AllIngredients__admin from './AllIngredients__admin';
import AllOrders__admin from './AllOrders__admin';

export default function AdminPanel(props) {
    const classes = useStyles();
    const [panel, setPanel] = useState(0);

    console.log(props)

    const getPanel = () => {
        switch(panel) {
            case 0:
                return(<div></div>);
            case 1:
                return(<AllBeers__admin />);
            case 2:
                return(<AllDishes__admin />);
            case 3:
                return(<AllDrinks__admin />);
            case 6:
                return(<AllIngredients__admin />);
            case 7:
                return(<AllOrders__admin socket={props.socket} />);
            default:
                return(<div>DEFAULT</div>)
        }
    }

    return(
    <div style={{marginBottom: 200, display: 'flex', marginRight: 10, marginTop: 10}}>
        <div className="Buttons" style={{marginTop: 65, padding: 10, display: 'grid', maxHeight: 360, marginBottom: 150}} >
            <Button className={classes.button} variant="contained" color="secondary" onClick={() => setPanel(1)}>BIRRE</Button>
            <Button className={classes.button} variant="contained" color="secondary" onClick={() => setPanel(2)}>PIATTI</Button>
            <Button className={classes.button} variant="contained" color="secondary" onClick={() => setPanel(3)}>BIBITE</Button>
            <Button className={classes.button} variant="contained" color="secondary" onClick={() => setPanel(4)}>DOLCI</Button>
            <Button className={classes.button} variant="contained" color="secondary" onClick={() => setPanel(5)}>BAR</Button>
            <Button className={classes.button} variant="contained" color="secondary" onClick={() => setPanel(6)}>INGREDIENTI</Button>
            <Button className={classes.button} variant="contained" color="secondary" onClick={() => setPanel(7)}>ORDINI</Button>
            <Button className={classes.button} variant="contained" color="secondary" onClick={() => setPanel(8)}>TAVOLI</Button>
        </div>
        <div className="panel" style={{width: '-webkit-fill-available'}}>
            {getPanel()}
        </div>
    </div>
    );
}

const useStyles = makeStyles({
    button: {
        margin: 10,
        height: 60,
        width: 100
    }
});
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import NewReleasesTwoToneIcon from '@material-ui/icons/NewReleasesTwoTone';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import axios from 'axios';

export default function Single_beer(props) {
    const dish_URL = 'http://localhost:4000/dish/';
    const orders_URL = 'http://localhost:4000/orders/dish/';
    const classes = useStyles();
    const [updates, setUpdates] = useState(0);
    const [missingIngredientsAlert, setMissingIngredientsAlert] = useState(false);
    const [missingIngredients, setMissingIngredients] = useState([]);
    const [missingNecessaryIngredientsAlert, setMissingNecessaryIngredientsAlert] = useState(false);
    const [showEditSection, setShowEditSection] = useState(false);
    const [backdropOpen, setBackDropOpen] = useState(false);
    const [dishToOrder, setDishToOrder] = useState(
      {
        applicant_ID: localStorage.getItem('applicant_ID'),
        name: props.dish.name,
        original: props.dish._id,
        ingredients: [],
        added_ingredient: null,
        removed_ingredients: [],
        necessary_ingredients: props.dish.necessary_ingredients,
        price: props.dish.price,
        modified: false,
        state: null,
        toDivided: false,
        notes: null,
        order: props.orderID,
        paid: false,
        dish_log: [],
        image_url: props.dish.image_url
      });

    useEffect(() => {
      let __missingIngredients = [];
      props.dish.ingredients.map((ingredient) => {
        if(ingredient.available === false) 
          __missingIngredients.push(ingredient);
        else
          if(dishToOrder.ingredients.indexOf(ingredient) === -1)
            dishToOrder.ingredients.push(ingredient);
      });
      if(__missingIngredients.length > 0)
        setMissingIngredientsAlert(true);
      setMissingIngredients(__missingIngredients);
      props.dish.necessary_ingredients.map((ingredient) => {
        if(ingredient.available === false) 
          setMissingNecessaryIngredientsAlert(true)
      });
    }, []);

    const handleIngredients = (event, ingredient) => {
      let index = dishToOrder.ingredients.indexOf(ingredient);
      if(event.target.checked === false && index > -1) {
        dishToOrder.ingredients.splice(index, 1);
        dishToOrder.removed_ingredients.push(ingredient);
      }
      else if(event.target.checked === true && index === -1) {
        dishToOrder.ingredients.push(ingredient);
        if(dishToOrder.removed_ingredients.indexOf(ingredient) !== -1)
          dishToOrder.removed_ingredients.splice(dishToOrder.removed_ingredients.indexOf(ingredient), 1);
      }
      setDishToOrder({...dishToOrder, modified: true});
      setUpdates(updates + 1);
    }

    const handleAddedIngredient = (event) => {
      if(event.target.checked === false) {
        let index = dishToOrder.ingredients.indexOf(dishToOrder.added_ingredient);
        dishToOrder.ingredients.splice(index, 1);
        setDishToOrder({...dishToOrder, added_ingredient: null});
      }
    }

    const showIngredientSelectors = () => {
      let ingredientsSelectors = [];
      props.dish.ingredients.map((ingredient) => {
        if(ingredient.available === true)
          ingredientsSelectors.push(<span><FormControlLabel
                                              control={<Checkbox disabled={dishToOrder.necessary_ingredients.indexOf(ingredient) === -1 ? false : true} defaultChecked={true} onChange={(event) => handleIngredients(event, ingredient)} name={ingredient.name} />}
                                              label={ingredient.name.toUpperCase()}
                                                            /><br /></span>)
      });
      //console.log(dishToOrder)    //  *********** <-------------- **##**  ORDINE IN CORSO       ******
      return ingredientsSelectors;
    }

    const showAddedIngredientSelector = () => {
      if(dishToOrder.added_ingredient !== null) {
        return(
          <span>
            <FormControlLabel
                    control={<Checkbox defaultChecked={true} onChange={(event) => handleAddedIngredient(event)} name={dishToOrder.added_ingredient.name} />}
                    label={<strong>{dishToOrder.added_ingredient.name.toUpperCase()}</strong>}
            /><br />
          </span>
        )
      }
    }

    const addIngredientForm = () => {
      return(
        <div style={{width: 300, display: 'flex'}}>
        <Autocomplete
            id="ingredientsList"
            options={props.allIngredients}
            disabled={dishToOrder.added_ingredient !== null ? true : false}
            style={{width: '100%', marginRight: 10, marginTop: 5}}
            color="secondary"
            getOptionLabel={(ingredient) => ingredient.name.toUpperCase()}
            getOptionDisabled={ingredient => ingredient.available === false}
            onChange={(event, value) => {dishToOrder.ingredients.push(value); setDishToOrder({...dishToOrder, added_ingredient: value}); setUpdates(updates + 1)}}
            renderInput={(params) =><TextField 
                                        {...params}
                                        color="secondary"
                                        label="Seleziona un ingrediente" 
                                        variant="outlined"
                                    />}
        />
        </div>
      );
    }

    const addToOrder = async() => {
      let result;
      await axios.post(dish_URL + 'add', dishToOrder)
        .then(response => result = response.data)
        .catch((errors) => console.log(errors));    //<------------ GESTIRE ERRORI!
        if(result.dishCreated === true) {
          let dish_ID = result.dish_ID;
          result = null;
          await axios.put(orders_URL + props.orderID, 
            {
              dish_ID: dish_ID,
              dish: dishToOrder
            })
            .then(response => result = response.data)
            .catch((errors) => console.log(errors));    //<----------- GESTIRE ERRORI!
            if(result.added === true) {
              props.socket.emit('elementAdded', props.orderID);
            }
        }
        setBackDropOpen(false);
    }

    return (
        <div className={classes.root}>
          <Accordion disabled={!props.dish.available || missingNecessaryIngredientsAlert} square={false} TransitionProps={{ unmountOnExit: true }} style={{borderRadius: 10}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}><span style={{fontWeight: 'bold'}}>{props.dish.name}</span></Typography>
              <div hidden={!props.dish.itIsNew}>
              <Chip
                icon={<NewReleasesTwoToneIcon color="secondary" />}
                variant="outlined"
                color="secondary"
                label="Novità"
                size="small"
                style={{marginLeft: 15, transform: 'rotateZ(-8deg)'}}
              />
              </div>
              <div hidden={!missingIngredientsAlert} style={{marginLeft: 10}}>
                <ErrorOutlineIcon style={{color: '#ff0000', fontSize: 22}} />
              </div>
            </AccordionSummary>
            <AccordionDetails style={{textAlign: 'left', flexDirection: 'column'}}>
              <div hidden={!missingIngredientsAlert} style={{borderWidth: 1, borderColor: '#da0000', borderStyle: 'solid', borderRadius: 8, fontSize: 12, color: '#da0000', backgroundColor: '#ef848442', textAlign: 'center', marginBottom: 5}}>
                ATTENZIONE!<br />
                I seguenti ingredienti non sono disponibili: <br />
                {missingIngredients.map((ingredient) => <div><span style={{fontWeight: 'bold', color: '#da0000'}}> - {ingredient.name}</span> (<span style={{fontStyle: 'italic'}}>{ingredient.type})</span><br /></div>)}
                Vuoi ordinare comunque questo piatto?
              </div>
              <img src={props.dish.image_url} alt="img" style={{maxWidth: '-webkit-fill-available', marginBottom: 8, borderRadius: 10}} />
              <Typography variant="body2">
                Prezzo: <span style={{fontStyle: 'italic', fontWeight: 'bold'}}>{parseFloat(props.dish.price).toFixed(2)} €</span> <br />
                <span style={{fontStyle: 'italic'}}>{props.dish.description}</span> <br />
              </Typography>
              <Typography variant="body2">
                <div hidden={!showEditSection} style={{borderWidth: 1, borderStyle: 'solid', borderColor: '#c3c3c3', borderRadius: 10, padding: 8}}>
                  Deseleziona gli ingredienti che non gradisci {props.dish.editable ? 'e/o aggiungine uno a tuo piacimento!' : null} <br />
                  {showIngredientSelectors()}
                  {showAddedIngredientSelector()}
                  {props.dish.editable ? addIngredientForm() : null}
                </div>
                <Button size="small" variant="outlined" style={{marginBottom: 5, marginTop: 5}} onClick={() => setShowEditSection(!showEditSection)}>{showEditSection ? 'Chiudi' : 'Piccola modifica?'} </Button>
                <div className="toDivided" hidden={!props.dish.divisible} style={{marginTop: 5}}>
                  Vuoi dividere questo piatto con qualcuno? <br />
                  <FormControlLabel
                    control={<Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} name="toDivided" onChange={(event) => setDishToOrder({...dishToOrder, toDivided: event.target.checked})} />}
                    label={dishToOrder.toDivided ? 'Diviso a metà' : 'Dividi a metà'}
                  />
                </div>
              </Typography>
              <Button variant="contained" color="secondary" style={{borderRadius: 10, marginTop: 10}} disabled={backdropOpen} onClick={() => {addToOrder(); setBackDropOpen(true);}}>
                  Aggiungi all' ordine
              </Button>
              <Backdrop open={backdropOpen}>
                <CircularProgress color="inherit" />
              </Backdrop>
            </AccordionDetails>
          </Accordion>
        </div>
      );
}

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      marginBottom: 15
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    button: {
        margin: theme.spacing(1),
        height: 30
    }
  }));
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import NewReleasesTwoToneIcon from '@material-ui/icons/NewReleasesTwoTone';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

export default function Single_drink(props) {
    const drink_URL = 'http://localhost:4000/drink/';
    const orders_URL = 'http://localhost:4000/orders/drink/';
    const classes = useStyles();
    const [size, setSize] = useState(null);
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [drinkToOrder, setDrinkToOrder] = useState(
      {
        applicant_ID: localStorage.getItem('applicant_ID'),
        name: props.drink.name,
        original: props.drink._id,
        size: null,
        price: null,
        order: props.orderID,
        paid: false,
        drink_log: [],
        image_URL: props.drink.image_URL
      }
    );

    const handleChange = (event) => {
        setSize(event.target.value);
    }

    const getSizes = () => {
        let __sizes = [];
        for(let size of props.drink.size)
            __sizes.push(
                <FormControlLabel 
                    value={size.qty} 
                    onChange={() => setDrinkToOrder({...drinkToOrder, size: size.qty, price: size.price})}
                    control={<Radio />} 
                    key={size.qty} 
                    label={size.qty + ' - ' + parseFloat(size.price).toFixed(2) + '€'}
                />);
        return __sizes;
    }

    const addToOrder = async() => {
      let result;
      await axios.post(drink_URL + 'add', drinkToOrder)
        .then(response => result = response.data)
        .catch((errors) => console.log(errors));    //<------------ GESTIRE ERRORI!
        if(result.drinkCreated === true) {
          let drink_ID = result.drink_ID;
          result = null;
          await axios.put(orders_URL + props.orderID, 
            {
              drink_ID: drink_ID,
              drink: drinkToOrder
            })
            .then(response => result = response.data)
            .catch((errors) => console.log(errors));    //<----------- GESTIRE ERRORI!
            if(result.added === true) {
              props.socket.emit('elementAdded', props.orderID);
            }
        }
        setBackdropOpen(false);
    }

    return (
        <div className={classes.root}>
          <Accordion disabled={!props.drink.available} square={false} TransitionProps={{ unmountOnExit: true }} style={{borderRadius: 10}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}><span style={{fontWeight: 'bold'}}>{props.drink.name}</span></Typography>
              <div hidden={!props.drink.itIsNew}>
              <Chip
                icon={<NewReleasesTwoToneIcon color="secondary" />}
                variant="outlined"
                color="secondary"
                label="Novità"
                size="small"
                style={{marginLeft: 15}}
              />
              </div>
            </AccordionSummary>
            <AccordionDetails style={{textAlign: 'left', flexDirection: 'column'}}>
              {/*<Typography variant="body2">
                Marca: <span style={{fontStyle: 'italic'}}>{props.drink.producer}</span><br />
                </Typography>*/}
              <FormControl component="fieldset">
                <RadioGroup aria-label="Formato" name="format1" value={size} onChange={handleChange}>
                    {getSizes()}
                </RadioGroup>
                </FormControl>
              <Button variant="contained" color="secondary" style={{borderRadius: 10, marginTop: 10}} disabled={(size == null ? true : false) || backdropOpen} onClick={() => {addToOrder(); setBackdropOpen(true);}}>
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
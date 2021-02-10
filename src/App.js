import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import TopBar from './components/TopBar';
import Wrapper from './components/Wrapper';
import MainPage from './components/MainPage';
import Beers_menu from './components/Beers_menu';
import Dishes_menu from './components/Dishes_menu';
import Drinks_menu from './components/Drinks_menu';
import AdminPanel from './components/AdminPanel';
import BottomBar from './components/BottomBar';
import getOrderInfo from './services/getOrderInfo';
import socketClient from 'socket.io-client';
import axios from 'axios';
import './App.css';

const socket = socketClient('http://localhost:4000/');

function App() {
  
  const orders_URL = 'http://localhost:4000/orders/';
  const [component, setComponent] = useState(0);
  const [updates, setUpdates] = useState(0);
  const [authenticated, setAuthenticated] = useState(false);
  const [table, setTable] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [orderID, setOrderID] = useState(null);

  useEffect(() => {
    async function getData() {
      await getOrderInfo('5fe37b7b8dfce101f4d96bb0')
        .then((result) => setOrderID(result._id))
        .catch((errors) => console.log(errors))
        .then(() => setLoaded(true));
    }
    getData();
    if(localStorage.getItem('applicant_ID') === null) {
      localStorage.setItem('applicant_ID', Math.random());
    }
  }, []);

  const refreshOrder = () => {
    setUpdates(updates + 1);
  }

  const getComponent = () => {
    if(loaded === true && noResults === false) {
      switch(component) {
        case 0:
          return(<MainPage setComponent={setComponent} orderID={orderID} />);
        case 1:
          return(<Beers_menu setComponent={setComponent} orderID={orderID} socket={socket} />);
        case 2:
          return(<Dishes_menu setComponent={setComponent} orderID={orderID} socket={socket} />);
        case 3:
          return(<Drinks_menu setComponent={setComponent} orderID={orderID} socket={socket} />);
        default:
          return(<div> </div>);
      }
    }
    else {
      return(
            <div hidden={loaded} className="loading" style={{marginTop: 100}}>
                <CircularProgress />
            </div>
      );
    }
  }

  return (
    <div className="App">
        <TopBar />
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Wrapper} component={getComponent} setComponent={setComponent} />
            <Route exact path="/private/admin" component={AdminPanel} setComponent={setComponent} />
          </Switch>
        </BrowserRouter>
        <BottomBar orderID={orderID} socket={socket} />
    </div>
  );
}

export default App;

/*
async function getOrderInfo() {
      let result;
      await axios.post(orders_URL + '5fe37b7b8dfce101f4d96bb0')
        .then(response => result = response.data)
        .catch((errors) => console.log(errors));        //<------------------- GESTIRE ERRORI!
      if(result !== undefined && result.noResults === true)
        setNoResults(true);
      else
        setOrderID(result._id);
      setLoaded(true);
    }
    getOrderInfo();
    */

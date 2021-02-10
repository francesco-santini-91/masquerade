import axios from 'axios';

export default async function getOrderInfo(__ID: String) {
    let result: any;
    if(__ID !== null && __ID !== undefined) {
        await axios.post('http://localhost:4000/orders/' + __ID)
          .then(response => result = response.data)
          .catch((errors) => console.log(errors));        //<------------------- GESTIRE ERRORI!
        if(result !== undefined && result.noResults === true)
          return null;
        else
          return result;
    }
  }

//    5fe37b7b8dfce101f4d96bb0
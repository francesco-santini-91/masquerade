var express = require('express');
var router = express.Router();
const beers_controller = require('../controllers/beers_menu_controller');

router.post('/', beers_controller.getAllBeers);

router.post('/available', beers_controller.getAllAvailableBeers);

router.post('/NOTAvailable', beers_controller.getAllNOTAvailableBeers);

router.post('/search', beers_controller.searchBeer);

router.post('/add', beers_controller.addBeer);

router.post('/incrementOrders', beers_controller.incrementOrdersNumber);

router.post('/:beer_ID', beers_controller.getBeerInfo);

router.put('/:beer_ID', beers_controller.editBeer);

router.patch('/:beer_ID', beers_controller.removeBeer);

router.post('/types/:type', beers_controller.getBeersByType);

router.post('/setAvailability/:beer_ID', beers_controller.setAvailability);

router.post('/setItIsNew/:beer_ID', beers_controller.setItIsNew);

module.exports = router;
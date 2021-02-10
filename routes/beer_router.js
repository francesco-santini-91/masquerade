var express = require('express');
var router = express.Router();
const beer_controller = require('../controllers/beer_controller');

router.post('/', beer_controller.getAllBeers);

router.post('/NOTConfirmed', beer_controller.getAllNOTConfirmedBeers);

router.post('/confirmed', beer_controller.getAllConfirmedBeers);

router.post('/served', beer_controller.getAllServedBeers);

router.post('/search', beer_controller.searchBeer)

router.post('/add', beer_controller.addBeer);

router.post('/:beer_ID', beer_controller.getBeerInfo);

router.put('/:beer_ID', beer_controller.editBeer);

router.patch('/:beer_ID', beer_controller.removeBeer);

router.post('/update/:beer_ID', beer_controller.updateBeerState);

router.post('/paid/:beer_ID', beer_controller.setBeerPaid);

module.exports = router;
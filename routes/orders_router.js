var express = require('express');
var router = express.Router();
const orders_controller = require('../controllers/orders_controller');

router.post('/', orders_controller.getAllOrders);

router.post('/active', orders_controller.getAllActiveOrders);

router.post('/completed', orders_controller.getAllCompletedOrders);

router.post('/search', orders_controller.searchOrder);

router.post('/new', orders_controller.newOrder);

router.post('/:order_ID', orders_controller.getOrderInfo);

router.put('/:order_ID', orders_controller.editOrder);

router.patch('/:order_ID', orders_controller.deleteOrder);

router.post('/payment/:order_ID', orders_controller.addPayment);

router.post('/date/:date', orders_controller.getOrdersByDate);

router.put('/dish/:order_ID/', orders_controller.addDishToOrder);

router.put('/drink/:order_ID', orders_controller.addDrinkToOrder);

router.put('/beer/:order_ID', orders_controller.addBeerToOrder);

router.patch('/dish/:order_ID/', orders_controller.removeDishFromOrder);

router.patch('/drink/:order_ID', orders_controller.removeDrinkFromOrder);

router.patch('/beer/:order_ID', orders_controller.removeBeerFromOrder);

router.post('/confirm/:order_ID', orders_controller.sendOrder);

module.exports = router;
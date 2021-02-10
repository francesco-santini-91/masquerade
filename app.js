var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var compression = require('compression');
var load = require('dotenv');
var logger = require('morgan');
var DBConnection = require('./database/DBConnection');

load.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users_router');
var tablesRouter = require('./routes/tables_router');
var ingredientsRouter = require('./routes/ingredients_router');
var drinksRouter = require('./routes/drinks_menu_router');
var beersRouter = require('./routes/beers_menu_router');
var dishesRouter = require('./routes/dishes_menu_router');
var ordersRouter = require('./routes/orders_router');
var drinkRouter = require('./routes/drink_router');
var beerRouter = require('./routes/beer_router');
var dishRouter = require('./routes/dish_router');

var app = express();

DBConnection(process.env.MONGODB_URL)
  .then(() => console.log('Connection ok'))
  .catch(error => console.log('Connection to MongoDB failed'));

app.use(logger('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(errors, request, response, next) {
    response.json({errors: errors});
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tables', tablesRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/drinks_menu', drinksRouter);
app.use('/beers_menu', beersRouter);
app.use('/dishes_menu', dishesRouter);
app.use('/orders', ordersRouter);
app.use('/drink', drinkRouter);
app.use('/beer', beerRouter);
app.use('/dish', dishRouter);

module.exports = app;

const Orders = require('../models/orders');
const Dish = require('../models/dish');
const Drink = require('../models/drink');
const Beer = require('../models/beer');

exports.getAllOrders = async function(request, response, next) {
    await Orders
        .find({}, '_id date starting_time table dishes beers drinks subtotal partial_paid order_log completed paid')
        .populate('dishes')
        .populate('drinks')
        .populate('beers')
        .populate('table')
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results.length == 0) {
                response.json({noResults: true});
            }
            else {
                response.json(results);
            }
        });
}

exports.getAllActiveOrders = async function(request, response, next) {
    await Orders
        .find({'completed': false})
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results.length == 0) {
                response.json({noResults: true});
            }
            else {
                response.json(results);
            }
        });
}

exports.getAllCompletedOrders = async function(request, response, next) {
    await Orders
        .find({'completed': true})
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results.length == 0) {
                response.json({noResults: true});
            }
            else {
                response.json(results);
            }
        });
}

exports.getOrdersByDate = async function(request, response, next) {
    await Orders
        .find({'date': request.params.date})
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results.length == 0) {
                response.json({noResults: true});
            }
            else {
                response.json(results);
            }
        })
}

exports.getActiveOrderByTable = async function(request, response, next) {
    await Orders
        .find({ $and: [{'completed': false}, {'table': request.params.table}]})
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results.length == 0) {
                response.json({noResults: true});
            }
            else {
                response.json(results);
            }
        });
}

exports.getOrderInfo = async function(request, response, next) {
    await Orders
        .findById(request.params.order_ID)
        .populate('dishes')
        .populate('drinks')
        .populate('beers')
        .populate('table')
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({orderNotFound: true});
            }
            else {
                response.json(results);
            }
        });
}

exports.searchOrder = async function(request, response, next) {

}

exports.newOrder = async function(request, response, next) {
    await Orders
        .findOne({ $and: [{'completed': false}, {'table_number': request.body.table_number/*"5fe1dc03e0a19a1d24826860"*/}]})
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                var newOrder = new Orders(
                    {
                        date: Date.now(),
                        starting_time: Date.now(),
                        table_number: request.body.table_number,
                        dishes: [],
                        beers: [],
                        drinks: [],
                        subtotal: 0,
                        partial_paid: 0,
                        order_log: [Date.now() + " - Ordine creato"],
                        bill_requested: false,
                        completed: false,
                        paid: false
                    }
                );
                await newOrder.save(function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({orderOpened: true});
                });
            }
            else {
                response.json({orderAlreadyOpened: true});
            }
        });
}

exports.editOrder = async function(request, response, next) {
    await Orders
        .findById(request.params.order_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({orderNotFound: true});
            }
            else {
                results.partial_paid = request.body.partial_paid;
                /* MODIFICA ORDINE */
                await results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({edited: true});
                });
            }
        });
}

exports.deleteOrder = async function(request, response, next) {
    await Orders
        .findById(request.params.order_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({orderNotFound: true});
            }
            else {
                await results.remove(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({deleted: true});
                });
            }
        });
}

exports.addPayment = async function(request, response, next) {
    await Orders
        .findById(request.params.order_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({orderNotFound: true});
            }
            else {
                if(results.paid == true || results.partial_paid == results.subtotal) {
                    response.json({orderAlreadyPaid: true});
                }
                else {
                    results.partial_paid = results.partial_paid + request.body.payment;
                    if(results.partial_paid == results.subtotal) {
                        results.paid = true;
                    }
                    await results.save(function(errors) {
                        if(errors) {
                            return next(errors);
                        }
                        response.json({updated: true});
                    });
                }
            }
        });
}

exports.completeOrder = async function(request, response, next) {
    await Orders
        .findById(request.params.order_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({orderNotFound: true});
            }
            else {
                results.completed = true;
                await results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({completed: true});
                });
            }
        });
}

exports.addDishToOrder = async function(request, response, next) {
    await Orders
        .findById(request.params.order_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({orderNotFound: true});
            }
            else {
                results.dishes.push(request.body.dish_ID);
                results.subtotal = results.subtotal + parseFloat(request.body.dish.price);
                await results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({added: true});
                });
            }
        });
}

exports.removeDishFromOrder = async function(request, response, next) {
    await Orders
        .findById(request.params.order_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({orderNotFound: true});
            }
            else {
                let index = results.dishes.indexOf(request.body.dish._id);  //  <-- DA VERIFICARE SE E' ID O OGGETTO!
                if(index > -1) {
                    results.dishes.splice(index, 1);
                    results.subtotal = results.subtotal - parseFloat(request.body.dish.price);
                    await results.save(async function(errors) {
                        if(errors) {
                            return next(errors);
                        }
                        await Dish
                            .findById(request.body.dish._id)
                            .exec(async function(errors, results) {
                                if(errors) {
                                    return next(errors);
                                }
                                if(results == null) {
                                    response.json({dishNotFound: true});
                                }
                                else {
                                    await results.remove(function(errors) {
                                        if(errors) {
                                            return next(errors);
                                        }
                                    })
                                }
                            });
                        response.json({removed: true});
                    });
                }
                else {
                    response.json({dishNotFound: true});
                }
            }
        });
}

exports.addDrinkToOrder = async function(request, response, next) {
    await Orders
        .findById(request.params.order_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({orderNotFound: true});
            }
            else {
                results.drinks.push(request.body.drink_ID);
                results.subtotal = results.subtotal + parseFloat(request.body.drink.price);
                await results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({added: true});
                });
            }
        });
}

exports.removeDrinkFromOrder = async function(request, response, next) {
    await Orders
        .findById(request.params.order_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({orderNotFound: true});
            }
            else {
                let index = results.drinks.indexOf(request.body.drink._id);
                if(index > -1) {
                    results.drinks.splice(index, 1);
                    results.subtotal = results.subtotal - parseFloat(request.body.drink.price);
                    await results.save(async function(errors) {
                        if(errors) {
                            return next(errors);
                        }
                        await Drink
                            .findById(request.body.drink._id)
                            .exec(async function(errors, results) {
                                if(errors) {
                                    return next(errors);
                                }
                                if(results == null) {
                                    response.json({drinkNotFound: true});
                                }
                                else {
                                    await results.remove(function(errors) {
                                        if(errors) {
                                            return next(errors);
                                        }
                                    })
                                }
                            });
                        response.json({removed: true});
                    });
                }
                else {
                    response.json({drinkNotFound: true});
                }
            }
        });
}

exports.addBeerToOrder = async function(request, response, next) {
    await Orders
        .findById(request.params.order_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({orderNotFound: true});
            }
            else {
                results.beers.push(request.body.beer_ID);
                results.subtotal = results.subtotal + parseFloat(request.body.beer.price);
                await results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({added: true});
                });
            }
        });
}

exports.removeBeerFromOrder = async function(request, response, next) {
    await Orders
        .findById(request.params.order_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({orderNotFound: true});
            }
            else {
                let index = results.beers.indexOf(request.body.beer._id);
                if(index > -1) {
                    results.beers.splice(index, 1);
                    results.subtotal = results.subtotal - parseFloat(request.body.beer.price);
                    await results.save(async function(errors) {
                        if(errors) {
                            return next(errors);
                        }
                        await Beer
                            .findById(request.body.beer._id)
                            .exec(async function(errors, results) {
                                if(errors) {
                                    return next(errors);
                                }
                                if(results == null) {
                                    response.json({beerNotFound: true});
                                }
                                else {
                                    await results.remove(function(errors) {
                                        if(errors) {
                                            return next(errors);
                                        }
                                    })
                                }
                            });
                        response.json({removed: true});
                    });
                }
                else {
                    response.json({beerNotFound: true});
                }
            }
        });
}

exports.sendOrder = async function(request, response, next) {
    await Orders
        .findById()
}
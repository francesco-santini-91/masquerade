const Drinks = require('../models/drinks_menu');

exports.getAllDrinks = async function(request, response, next) {
    await Drinks
        .find({}, 'name producer type size price available number_of_orders image_url')
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

exports.getAllAvailableDrinks = async function(request, response, next) {
    await Drinks
        .find({'available': true})
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

exports.getAllNOTAvailableDrinks = async function(request, response, next) {
    await Drinks
        .find({'available': false})
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

exports.getDrinksByType = async function(request, response, next) {
    await Drinks
        .find({'type': request.params.type})
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

exports.getDrinkInfo = async function(request, response, next) {
    await Drinks
        .findById(request.params.drink_ID)
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({drinkNotFound: true});
            }
            else {
                response.json(results);
            }
        });
}

exports.searchDrink = async function(request, response, next) {

}

exports.incrementOrdersNumber = async function(request, response, next) {
    await Drinks
        .findById(request.body.drink_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({drinkNotFound: true});
            }
            else {
                results.number_of_orders++;
                await results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({ordersIncremented: true});
                });
            }
        });
}

exports.addDrink = async function(request, response, next) {
    await Drinks
        .findOne({ $and: [{'name': request.body.name}, {'size': request.body.size}]})
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                var newDrink = new Drinks(
                    {
                        name: request.body.name,
                        producer: request.body.producer,
                        type: request.body.type,
                        size: request.body.size,
                        price: request.body.price,
                        available: true,
                        number_of_orders: 0,
                        image_url: request.body.image_url
                    }
                );
                await newDrink.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({added: true});
                });
            }
            else {
                response.json({drinkAlreadyExists: true});
            }
        });
}

exports.editDrink = async function(request, response, next) {
    await Drinks
        .findById(request.params.drink_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({drinkNotFound: true});
            }
            else {
                results.name = request.body.name;
                results.producer = request.body.producer;
                results.type = request.body.type;
                results.size = request.body.size;
                results.available = request.body.available;
                results.image_url = request.body.image_url;
                await results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({edited: true});
                });
            }
        });
}

exports.removeDrink = async function(request, response, next) {
    await Drinks
        .findById(request.params.drink_ID)
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
                    response.json({deleted: true});
                });
            }
        });
}

exports.setAvailability = async function(request, response, next) {
    await Drinks
        .findById(request.params.drink_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({drinkNotFound: true});
            }
            else {
                results.available = request.body.available;
                await results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({edited: true});
                });
            }
        });
}
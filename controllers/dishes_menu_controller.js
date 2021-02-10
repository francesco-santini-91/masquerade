const Dishes = require('../models/dishes_menu');

exports.getAllDishes = async function(request, response, next) {
    await Dishes
        .find({}, '_id name description type ingredients necessary_ingredients price number_of_orders available itIsNew editable divisible image_url')
        .populate('ingredients')
        .populate('necessary_ingredients')
        .sort(request.body.admin ? {'type': 1} : {'available': -1, 'type': 1, 'itIsNew': -1})
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

exports.getAllAvailableDishes = async function(request, response, next) {
    await Dishes
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

exports.getAllNOTAvailableDishes = async function(request, response, next) {
    await Dishes
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

exports.getDishesByType = async function(request, response, next) {
    await Dishes
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

exports.getDishInfo = async function(request, response, next) {
    await Dishes
        .findById(request.params.dish_ID)
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({dishNotFound: true});
            }
            else {
                response.json(results);
            }
        })
}

exports.searchDish = async function(request, response, next) {

}

exports.incrementOrdersNumber = async function(request, response, next) {
    await Dishes
        .findById(request.body.dish_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({dishNotFound: true});
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

exports.addDish = async function(request, response, next) {
    await Dishes
        .findOne({ $and: [{'name': request.body.name}, {'type': request.body.type}]})
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                var newDish = new Dishes(
                    {
                        name: request.body.name,
                        description: request.body.description,
                        type: request.body.type,
                        ingredients: request.body.ingredients,
                        necessary_ingredients: request.body.necessary_ingredients,
                        price: request.body.price,
                        available: request.body.available,
                        number_of_orders: 0,
                        itIsNew: request.body.itIsNew,
                        editable: request.body.editable,
                        divisible: request.body.divisible,
                        image_url: request.body.image_url
                    }
                );
                await newDish.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({added: true});
                });
            }
            else {
                response.json({dishAlreadyExists: true});
            }
        });
}

exports.editDish = async function(request, response, next) {
    await Dishes
        .findById(request.params.dish_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({dishNotFound: true});
            }
            else {
                results.name = request.body.name;
                results.description = request.body.description;
                results.type = request.body.type;
                results.ingredients = request.body.ingredients;
                results.necessary_ingredients = request.body.necessary_ingredients;
                results.divisible = request.body.divisible;
                results.price = request.body.price;
                results.available = request.body.available;
                results.itIsNew = request.body.itIsNew;
                results.editable = request.body.editable;
                results.divisible = request.body.divisible;
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

exports.removeDish = async function(request, response, next) {
    await Dishes
        .findById(request.params.dish_ID)
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
                    response.json({deleted: true});
                });
            }
        });
}

exports.setAvailability = async function(request, response, next) {
    await Dishes
        .findById(request.params.dish_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({dishNotFound: true});
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

exports.setItIsNew = async function(request, response, next) {
    await Dishes
        .findById(request.params.dish_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({dishNotFound: true});
            }
            else {
                results.itIsNew = request.body.itIsNew;
                await results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({edited: true});
                });
            }
        });
}

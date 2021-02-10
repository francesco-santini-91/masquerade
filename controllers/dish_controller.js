const Dish = require('../models/dish');

exports.getAllDishes = async function(request, response, next) {
    await Dish
        .find({}, 'applicant_ID name original ingredients price isModified state toDivided notes order paid dish_log image_url')
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

exports.getAllNOTConfirmedDishes = async function(request, response, next) {
    await Dish
        .find({'state': "NOT_CONFIRMED"})
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

exports.getAllConfirmedDishes = async function(request, response, next) {
    await Dish
        .find({'state': "CONFIRMED"})
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

exports.getAllServedDishes = async function(request, response, next) {
    await Dish
        .find({'state': "SERVED"})
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
    await Dish
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
        });
}

exports.searchDish = async function(request, response, next) {

}

exports.addDish = async function(request, response, next) {
    var newDish = new Dish(
        {
            applicant_ID: request.body.applicant_ID,
            name: request.body.name,
            original: request.body.original,
            ingredients: request.body.ingredients,
            price: request.body.price,
            isModified: request.body.isModified,
            state: "NOT_CONFIRMED",
            paid: false,
            toDivided: request.body.toDivided,
            notes: request.body.notes,
            order: request.body.order,
            dish_log: [],
            image_url: request.body.image_url
        }
    );
    await newDish.save(function(errors) {
        if(errors) {
            return next(errors);
        }
        response.json({dishCreated: true, dish_ID: newDish._id});
    });
}

exports.editDish = async function(request, response, next) {
    await Dish
        .findById(request.params.dish_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({dishNotFound: true});
            }
            else {
                if(results.state == "NOT_CONFIRMED") {
                    results.ingredients = request.body.ingredients;
                    results.toDivided = request.body.toDivided;
                    results.notes = request.body.notes;
                    results.dish_log.push(Date.now() + " - Piatto modificato\n");
                    await results.save(function(errors) {
                        if(errors) {
                            return next(errors);
                        }
                        response.json({edited: true});
                    });
                }
                else {
                    response.json({dishAlreadyConfirmed});
                }
            }
        });
}

exports.removeDish = async function(request, response, next) {
    await Dish
        .findById(request.params.dish_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({dishNotFound: true});
            }
            else {
                if(results.state == "NOT_CONFIRMED" || request.body.admin === 'admin') {
                    await results.remove(function(errors) {
                        if(errors) {
                            return next(errors);
                        }
                    })
                }
                else {
                    response.json({dishAlreadyConfirmed: true});
                }
            }
        });
}

exports.updateDishState = async function(request, response, next) {
    await Dish
        .findById(request.params.dish_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({dishNotFound: true});
            }
            else {
                results.state = request.body.state;
                switch(request.body.state) {
                    case "CONFIRMED":
                        results.dish_log.push(Date.now() + " - Confermato");
                        break;
                    case "SENDED":
                        results.dish_log.push(Date.now() + " - Ordine inviato");
                        break;
                    case "SERVED":
                        results.dish_log.push(Date.now() + " - Servito");
                        break;
                    default:
                        results.dish_log.push(Date.now() + " - " + request.body.state + "");    
                }
                await results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({updated: true});
                });
            }
        });
}

exports.setDishPaid = async function(request, response, next) {
    await Dish
        .findById(request.params.dish_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({dishNotFound: true});
            }
            else {
                results.paid = true;
                results.dish_log.push(Date.now() + " - Pagato\n");
                await results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({paid: true});
                });
            }
        });
}
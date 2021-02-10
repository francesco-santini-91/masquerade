const Drink = require('../models/drink');

exports.getAllDrinks = async function(request, response, next) {
    await Drink
        .find({}, 'applicant_ID name original size price state order paid drink_log image_url')
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

exports.getAllNOTConfirmedDrinks = async function(request, response, next) {
    await Drink
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

exports.getAllConfirmedDrinks = async function(request, response, next) {
    await Drink
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

exports.getAllServedDrinks = async function(request, response, next) {
    await Drink
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

exports.getDrinkInfo = async function(request, response, next) {
    await Drink
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

exports.addDrink = async function(request, response, next) {
    var newDrink = new Drink(
        {
            applicant_ID: request.body.applicant_ID,
            name: request.body.name,
            original: request.body.original,
            size: request.body.size,
            price: request.body.price,
            state: "NOT_CONFIRMED",
            order: request.body.order,
            paid: false,
            drink_log: [],
            image_url: request.body.image_url
        }
    );
    await newDrink.save(function(errors) {
        if(errors) {
            return next(errors);
        }
        response.json({drinkCreated: true, drink_ID: newDrink._id});
    });
}

exports.editDrink = async function(request, response, next) {
    await Drink
        .findById(request.params.drink_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({drinkNotFound: true});
            }
            else {
                if(results.state == "NOT_CONFIRMED") {
                    results.size = request.body.size;
                    results.price = request.body.price;
                    await results.save(function(errors) {
                        if(errors) {
                            return next(errors);
                        }
                        response.json({edited: true});
                    });
                }
                else {
                    response.json({drinkAlreadyConfirmed: true});
                }
            }
        });
}

exports.removeDrink = async function(request, response, next) {
    await Drink
        .findById(request.params.drink_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({drinkNotFound: true});
            }
            else {
                if(results.state == "NOT_CONFIRMED" || request.body.admin === 'admin') {
                    results.remove(function(errors) {
                        if(errors) {
                            return next(errors);
                        }
                        response.json({removed: true});
                    });
                }
                else {
                    response.json({drinkAlreadyConfirmed: true});
                }
            }
        });
}

exports.updateDrinkState = async function(request, response, next) {
    await Drink
        .findById(request.params.drink_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({drinkNotFound: true});
            }
            else {
                results.state = request.body.state;
                switch(request.body.state) {
                    case "CONFIRMED":
                        results.drink_log.push(Date.now() + " - Confermata");
                        break;
                    case "SENDED":
                        results.drink_log.push(Date.now() + " - Ordine inviato");
                        break;
                    case "SERVED":
                        results.drink_log.push(Date.now() + " - Servita");
                        break;
                    default:
                        results.drink_log.push(Date.now() + " - " + request.body.state + "");
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

exports.setDrinkPaid = async function(request, response, next) {
    await Drink
        .findById(request.params.drink_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({drinkNotFound: true});
            }
            else {
                results.paid = true;
                results.drink_log.push(Date.now() + " - Pagata");
                await results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({paid: true});
                });
            }
        });
}
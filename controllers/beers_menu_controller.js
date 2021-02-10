const Beers = require('../models/beers_menu');

exports.getAllBeers = async function(request, response, next) {
    await Beers
        .find({}, 'name producer grades type description size available itIsNew number_of_orders image_url')
        .sort(request.body.admin ? {} : {'available': -1, 'itIsNew': -1})
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

exports.getAllAvailableBeers = async function(request, response, next) {
    await Beers
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

exports.getAllNOTAvailableBeers = async function(request, response, next) {
    await Beers
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

exports.getBeersByType = async function(request, response, next) {
    await Beers
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

exports.getBeerInfo = async function(request, response, next) {
    await Beers
        .findById(request.params.beer_ID)
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({beerNotFound: true});
            }
            else {
                response.json(results);
            }
        });
}

exports.searchBeer = async function(request, response, next) {

}

exports.incrementOrdersNumber = async function(request, response, next) {
    await Beers
        .findById(request.body.beer_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({beerNotFound: true});
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

exports.addBeer = async function(request, response, next) {
    await Beers
        .findOne({ $and: [{'name': request.body.name}, {'size': request.body.size}]})
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                var newBeer = new Beers(
                    {
                        name: request.body.name,
                        producer: request.body.producer,
                        grades: request.body.grades,
                        type: request.body.type,
                        description: request.body.description,
                        size: request.body.size,
                        price: request.body.price,
                        available: request.body.available,
                        itIsNew: request.body.itIsNew,
                        number_of_orders: 0,
                        image_url: request.body.image_url
                    }
                );
                await newBeer.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({added: true});
                });
            }
            else {
                response.json({beerAlreadyExists: true});
            }
        });
}

exports.editBeer = async function(request, response, next) {
    await Beers
        .findById(request.params.beer_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({beerNotFound: true});
            }
            else {
                results.name = request.body.name;
                results.producer = request.body.producer;
                results.grades = request.body.grades;
                results.type = request.body.type;
                results.description = request.body.description;
                results.size = request.body.size;
                results.available = request.body.available;
                results.itIsNew = request.body.itIsNew;
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

exports.removeBeer = async function(request, response, next) {
    await Beers
        .findById(request.params.beer_ID)
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
                    response.json({deleted: true});
                });
            }
        });
}

exports.setAvailability = async function(request, response, next) {
    await Beers
        .findById(request.params.beer_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({beerNotFound: true});
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
    await Beers
        .findById(request.params.beer_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({beerNotFound: true});
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
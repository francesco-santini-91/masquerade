const Beer = require('../models/beer');

exports.getAllBeers = async function(request, response, next) {
    await Beer
        .find({}, 'applicant_ID name original size price state order paid beer_log image_url')
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

exports.getAllNOTConfirmedBeers = async function(request, response, next) {
    await Beer
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

exports.getAllConfirmedBeers = async function(request, response, next) {
    await Beer
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

exports.getAllServedBeers = async function(request, response, next) {
    await Beer
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

exports.getBeerInfo = async function(request, response, next) {
    await Beer
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

exports.addBeer = async function(request, response, next) {
    var newBeer = new Beer(
        {
            applicant_ID: request.body.applicant_ID,
            name: request.body.name,
            original: request.body.original,
            size: request.body.size,
            price: request.body.price,
            state: "NOT_CONFIRMED",
            order: request.body.order,
            paid: false,
            beer_log: [],
            image_url: request.body.image_url
        }
    );
    await newBeer.save(function(errors) {
        if(errors) {
            return next(errors);
        }
        response.json({beerCreated: true, beer_ID: newBeer._id});
    });
}

exports.editBeer = async function(request, response, next) {
    await Beer
        .findById(request.params.beer_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({beerNotFound: true});
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
                    response.json({beerAlreadyConfirmed: true});
                }
            }
        });
}

exports.removeBeer = async function(request, response, next) {
    await Beer
        .findById(request.params.beer_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({beerNotFound: true});
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
                    response.json({beerAlreadyConfirmed: true});
                }
            }
        });
}

exports.updateBeerState = async function(request, response, next) {
    await Beer
        .findById(request.params.beer_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({beerNotFound: true});
            }
            else {
                results.state = request.body.state;
                switch(request.body.state) {
                    case "CONFIRMED":
                        results.beer_log.push(Date.now() + " - Confermata");
                        break;
                    case "SENDED":
                        results.beer_log.push(Date.now() + " - Ordine inviato");
                        break;
                    case "SERVED":
                        results.beer_log.push(Date.now() + " - Servita");
                        break;
                    default:
                        results.beer_log.push(Date.now() + " - " + request.body.state + "");
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

exports.setBeerPaid = async function(request, response, next) {
    await Beer
        .findById(request.params.beer_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({beerNotFound: true});
            }
            else {
                results.paid = true;
                results.beer_log.push(Date.now() + " - Pagata");
                await results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({paid: true});
                });
            }
        });
}
const Ingredients = require('../models/ingredients');

exports.getAllIngredients = async function(request, response, next) {
    await Ingredients
        .find({}, 'name type available')
        .sort({'type': 1})
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

exports.getAllAvailableIngredients = async function(request, response, next) {
    await Ingredients
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

exports.getAllNOTAvailableIngredients = async function(request, response, next) {
    await Ingredients
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

exports.getIngredientsByType = async function(request, response, next) {
    await Ingredients
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
        })
}

exports.getIngredientInfo = async function(request, response, next) {
    await Ingredients
        .findById(request.params.ingredient_ID)
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({ingredientNotFound: true});
            }
            else {
                response.json(results);
            }
        });
}

exports.searchIngredient = async function(request, response, next) {
    
}

exports.addIngredient = async function(request, response, next) {
    await Ingredients
        .findOne({'name': request.body.name})
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                var newIngredient = new Ingredients (
                    {
                        name: request.body.name,
                        type: request.body.type,
                        available: true
                    }
                );
                await newIngredient.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({added: true});
                });
            }
            else {
                response.json({ingredientAlreadyExists: true});
            }
        });
}

exports.editIngredient = async function(request, response, next) {
    await Ingredients
        .findById(request.params.ingredient_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({ingredientNotFound: true});
            }
            else {
                results.name = request.body.name;
                results.type = request.body.type;
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

exports.removeIngredient = async function(request, response, next) {
    await Ingredients
        .findById(request.params.ingredient_ID)
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({ingredientNotFound});
            }
            else {
                results.remove(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({deleted: true});
                });
            }
        });
}

exports.setAvailability = async function(request, response, next) {
    await Ingredients
        .findById(request.params.ingredient_ID)
        .exec(function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({ingredientNotFound: true});
            }
            else {
                results.available = request.body.available;
                results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({edited: true});
                });
            }
        });
}

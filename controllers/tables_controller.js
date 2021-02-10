const Tables = require('../models/table');

exports.getAllTables = async function(request, response, next) {
    await Tables
        .find({}, 'name isActive active_order')
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

exports.getAllActiveTables = async function(request, response, next) {
    await Tables
        .find({'isActive': true})
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

exports.getAllAvailableTables = async function(request, response, next) {
    await Tables
        .find({'isActive': false})
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

exports.getTableInfo = async function(request, response, next) {
    await Tables
        .findById(request.params.table_ID)
        .exec(function(errors) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({tableNotFound: true});
            }
            else {
                response.json(results);
            }
        });
}

exports.newTable = async function(request, response, next) {
    await Tables
        .findOne({'name': request.body.name})
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                var newTable = new Tables(
                    {
                        name: request.body.name,
                        isActive: false,
                        active_order: null
                    }
                );
                await newTable.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({created: true});
                });
            }
        });
}

exports.editTable = async function(request, response, next) {
    await Tables
        .findById(request.params.table_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({tableNotFound: true});
            }
            else {
                results.name = request.body.name;
                await results.save(function(errors, results) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({edited: true});
                });
            }
        });
}

exports.deleteTable = async function(request, response, next) {
    await Tables
        .findById(request.params.table_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({noResults: true});
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

exports.assignOrderToTable = async function(request, response, next) {
    await Tables
        .findById(request.params.table_ID)
        .exec(async function(errors, results) {
            if(errors) {
                return next(errors);
            }
            if(results == null) {
                response.json({tableNotFound: true});
            }
            else {
                results.active_order = request.body.order;
                await results.save(function(errors) {
                    if(errors) {
                        return next(errors);
                    }
                    response.json({added: true});
                });
            }
        });
}
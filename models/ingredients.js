var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ingredientSchema = new Schema (
    {
        name: {
            type: String,
            required: true
        },
        type: {
            type: String
        },
        available: {
            type: Boolean
        }
    }
);

module.exports = mongoose.model('Ingredients', ingredientSchema);
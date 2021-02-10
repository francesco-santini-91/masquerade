var mongoose = require('mongoose');
var Ingredients = require('./ingredients');
var Schema = mongoose.Schema;

const dishSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        type: {
            type: String
        },
        ingredients: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Ingredients'
            }
        ],
        necessary_ingredients: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Ingredients'
            }
        ],
        price: {
            type: Number,
            required: true
        },
        available: {
            type: Boolean
        },
        number_of_orders: {
            type: Number
        },
        itIsNew: {
            type: Boolean
        },
        editable: {
            type: Boolean
        },
        divisible: {
            type: Boolean
        },
        image_url: {
            type: String
        }
    }
);

module.exports = mongoose.model('Dishes_menu', dishSchema);
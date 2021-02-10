var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const beerSchema = new Schema (
    {
        name: {
            type: String,
            required: true
        },
        producer: {
            type: String
        },
        grades: {
            type: Number
        },
        type: {
            type: String
        },
        description: {
            type: String
        },
        size: [
            {
                qty: {
                    type: String
                },
                price: {
                    type: Number
                }
            }
        ],
        available: {
            type: Boolean
        },
        itIsNew: {
            type: Boolean
        },
        number_of_orders: {
            type: Number
        },
        image_url: {
            type: String
        }
    }
);

module.exports = mongoose.model('Beers_menu', beerSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const drinkSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        producer: {
            type: String
        },
        type: {
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
        number_of_orders: {
            type: Number
        },
        image_url: {
            type: String
        }
    }
);

module.exports = mongoose.model('Drinks_menu', drinkSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const __drinkSchema = new Schema (
    {
        applicant_ID: {
            type: String
        },
        name: {
            type: String
        },
        original: {
            type: Schema.Types.ObjectId,
            ref: 'Drinks'
        },
        size: {
            type: String
        },
        price: {
            type: Number,
        },
        state: {
            type: String
        },
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        },
        paid: {
            type: Boolean
        },
        drink_log: [
            {
                type: String
            }
        ],
        image_url: {
            type: String
        }
    }
);

module.exports = mongoose.model('Drink', __drinkSchema);
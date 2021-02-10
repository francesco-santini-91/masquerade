var mongoose = require('mongoose');
var Ingredients = require('./ingredients');
var Schema = mongoose.Schema;

const __dishSchema = new Schema(
    {
        applicant_ID: {
            type: String
        },
        name: {
            type: String,
            required: true
        },
        original: {
            type: Schema.Types.ObjectId,
            ref: 'Dishes'
        },
        ingredients: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Ingredients'
            }
        ],
        price: {
            type: Number,
            required: true
        },
        modified: {
            type: Boolean
        },
        state: {
            type: String
        },
        toDivided: {
            type: Boolean
        },
        notes: {
            type: String
        },
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        },
        paid: {
            type: Boolean
        },
        dish_log: [
            {
                type: String
            }
        ],
        image_url: {
            type: String
        }
    }
);

module.exports = mongoose.model('Dish', __dishSchema);
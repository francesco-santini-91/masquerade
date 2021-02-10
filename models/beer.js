var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const __beerSchema = new Schema (
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
            ref: 'Beers'
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
        beer_log: [
            {
                type: String
            }
        ],
        image_url: {
            type: String
        }
    }
);

module.exports = mongoose.model('Beer', __beerSchema);
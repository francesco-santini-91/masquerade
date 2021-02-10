var mongoose = require('mongoose');
var Dishes = require('./dish');
var Drinks = require('./drink');
var Beers = require('./beer');
var Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        date: {
            type: Date
        },
        starting_time: {
            type: Date
        },
        table: {
            type: Schema.Types.ObjectId,
            ref: 'Table'
        },
        dishes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Dish'
            }
        ],
        drinks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Drink'
            }
        ],
        beers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Beer'
            }
        ],
        subtotal: {
            type: Number   
        },
        partial_paid: {
            type: Number
        },
        order_log: [
            {
                type: String
            }
        ],
        bill_requested: {
            type: Boolean
        },
        completed: {
            type: Boolean
        },
        paid: {
            type: Boolean
        }
    }
);

module.exports = mongoose.model('Orders', orderSchema);
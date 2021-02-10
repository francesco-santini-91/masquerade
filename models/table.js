var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const tableSchema = new Schema(
    {
        name: {
            type: String
        },
        isActive: {
            type: Boolean
        },
        active_order:
            {
                type: Schema.Types.ObjectId,
                ref: 'Orders'
            }
    }
);

module.exports = mongoose.model('Table', tableSchema);
var mongoose = require('mongoose');
var bcryptjs = require('bcryptjs');
var Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean
        },
        isLocked: {
            type: Boolean
        }
    }
);

userSchema.pre("save", async function(next) {
    try {
        const user = this;
        if(!this.isModified("password")) {
            next();
        }
        let password = await bcryptjs.hash(user.password, 10);
        user.password = password;

        next();
    } catch(errors) {
        return next(errors);
    }
});

module.exports = mongoose.model('Users', userSchema);
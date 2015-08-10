var mongoose = require('mongoose'),
    encryption = require('../../utilities/encryption');

module.exports.init = function() {
    var userSchema = mongoose.Schema({
        username: {
            type: String,
            require: '{PATH} is required',
            unique: true
        },
        salt: String,
        hashPass: String,
        sites: [{
            type: String,
            unique: true
        }]
    });

    userSchema.method({
        authenticate: function(password) {
            if (encryption.generateHashedPassword(this.salt, password) === this.hashPass) {
                return true;
            } else {
                return false;
            }
        }
    });

    var User = mongoose.model('User', userSchema);
};
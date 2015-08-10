var User = require('mongoose').model('User');

module.exports = {
    create: function(user, callback) {
        User.create(user, callback);
    },
    update: function(id, sites, callback) {
        User.update(id, {sites: sites}, callback);
    },
    findOne: function(username, callback) {
        User.findOne({
            username: username
        }, callback);
    }
};
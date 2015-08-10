var encryption = require('../utilities/encryption');
var users = require('../data/users');

var CONTROLLER_NAME = 'users';

function distinctSiteNames(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

module.exports = {
    getRegister: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/register');
    },
    postRegister: function(req, res, next) {
        var newUserData = req.body;

        if (newUserData.password != newUserData.confirmPassword) {
            req.session.error = 'Passwords do not match!';
            res.redirect('/register');
        } else {
            newUserData.salt = encryption.generateSalt();
            newUserData.hashPass = encryption.generateHashedPassword(newUserData.salt, newUserData.password);
            newUserData.points = 0;

            users.create(newUserData, function(err, user) {
                if (err) {
                    return next(err);
                }

                req.logIn(user, function(err) {
                    if (err) {
                        return next(err);
                    } else {
                        res.redirect('/');
                    }
                });
            });
        }
    },
    getLogin: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/login');
    },
    getProfile: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/profile', {
            currentUser: req.user
        });
    },
    updateProfile: function(req, res, next) {
        users.findOne(req.body.username, function(err, user) {
            var sites = distinctSiteNames(user.sites.concat(req.body.sites));

            if (err) {
                return next(err);
            }

            users.update({
                _id: user._id
            }, sites, function() {
                res.send('/');
            });
        });
    },
    getMySites: function(req, res, next) {
        var mySites = req.user.sites;

        res.render(CONTROLLER_NAME + '/mySitesForm', {
            sites: mySites
        });
    }
};
var auth = require('./auth'),
    controllers = require('../controllers');

module.exports = function(app) {
    app.get('/register', controllers.users.getRegister);
    app.post('/register', controllers.users.postRegister);

    app.get('/login', controllers.users.getLogin);
    app.post('/login', auth.login);
    app.get('/logout', auth.logout);

    app.get('/profile', auth.isAuthenticated, controllers.users.getProfile);
    app.put('/profile', auth.isAuthenticated, controllers.users.updateProfile);

    app.get('/page-speed', controllers.pageSpeed.getPageSpeedForm);
    app.post('/page-speed', controllers.pageSpeed.runPageSpeed);

    app.get('/page-speed/my-sites', controllers.users.getMySites);
    app.post('/page-speed/my-sites', controllers.pageSpeed.runPageSpeed);

    app.get('/benchmark-results', controllers.pageSpeed.getBenchmarkResults);

    app.get('/', function(req, res) {
        res.render('index', {
            currentUser: req.user
        });
    });

    app.all('*', function(req, res) {
        res.render('index', {
            currentUser: req.user
        });
    });

    app.use(function(err, req, res, next) {
        res.status(err.code || 500);
        res.render('error', {
            message: err.message,
            errCode: err.code || 500
        });
    });
};
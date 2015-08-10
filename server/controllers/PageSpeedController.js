var CONTROLLER_NAME = 'pageSpeed';
var pagespeedModel = require('../data/pagespeed'),
    google = require('googleapis'),
    pageSpeed = google.pagespeedonline('v2').pagespeedapi;

function filterForm(formData) {
    var result = {};

    for (var item in formData) {
        if (formData[item]) {
            result[item] = formData[item];
        }
    }

    return result;
}

function validateSite(site) {
    if (/^(http|https):\/\//.test(site)) {
        return site;
    }

    return 'http://' + site;
}

function distinctData(data) {
    var filteredData = {},
        year = '',
        month = '',
        date = '',
        dateTimeString = '';

    for (var site = 0, len = data.length; site < len; site++) {
        if (!data[site]['date']) {
            // console.log(data[site]);
            continue;
        }

        year = data[site]['date'].getFullYear(),
        month = data[site]['date'].getMonth(),
        date = data[site]['date'].getDate(),
        dateTimeString = date + '/' + month + '/' + year;

        filteredData[data[site]['siteUrl']] = filteredData[data[site]['siteUrl']] || {};
        filteredData[data[site]['siteUrl']][dateTimeString] = [data[site]['benchmarkData']['ruleGroups']['SPEED'], data[site]['_id']];
    }

    return filteredData;
}

module.exports = {
    getPageSpeedForm: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/pageSpeedForm');
    },
    runPageSpeed: function(req, res, next) {
        var formData = req.body,
            // username = req.user.username || 'annonymous',
            username = 'pesho',
            results = [],
            siteEntities = 0,
            currentSite = '';

        // Filter formData
        formData = filterForm(formData);
        siteEntities = Object.keys(formData).length * 2;

        for (var site in formData) {
            currentSite = validateSite(formData[site]);

            pageSpeed.runpagespeed({
                url: currentSite,
                strategy: 'desktop'
            }, function(err, data) {
                if (err) {
                    // res.status(400);
                    // return res.send({
                    //     reason: err.toString()
                    // });
                    return next(err);
                }

                results.push(data);

                pagespeedModel.addBenchmarkResult(username, data, new Date().toString(), false); // is mobile false

                if (results.length === siteEntities) {
                    res.render(CONTROLLER_NAME + '/pageSpeedResult', {
                        benchmarkData: results
                    });
                }
            });

            pageSpeed.runpagespeed({
                url: currentSite,
                strategy: 'mobile'
            }, function(err, data) {
                var currentDate = new Date();
                if (err) {
                    return next(err);
                }

                results.push(data);

                pagespeedModel.addBenchmarkResult(username, data, new Date().toString(), true); // is mobile true

                if (results.length === siteEntities) {
                    res.render(CONTROLLER_NAME + '/pageSpeedResult', {
                        benchmarkData: results
                    });
                }
            });
        }
    },
    getBenchmarkResults: function(req, res, next) {
        var queryParameters = req.query,
            // username = req.user.username || 'annonymous',
            username = 'pesho',
            siteUrls = ['Default'],
            templateDestination = CONTROLLER_NAME,
            siteStrategy,
            filteredData = {};

        if (!Object.keys(queryParameters).length) {
            templateDestination += '/pageSpeedBenchmarkResults';

            pagespeedModel.getAll(username, function(err, data) {
                if (err) {
                    return next(err);
                }

                for (var i = 0, len = data.length; i < len; i++) {
                    var currentTitle = data[i].siteUrl;
                    if (siteUrls.indexOf(currentTitle) === -1) {
                        siteUrls.push(currentTitle);
                    }
                }

                filteredData = distinctData(data);

                res.render(templateDestination, {
                    benchmarkData: data,
                    siteUrls: siteUrls,
                    filteredData: filteredData
                });
            });
        } else if (queryParameters.siteId) {
            pagespeedModel.getRawData(req.query.siteId, function(err, data) {
                if (err) {
                    return next(err);
                }

                res.json(JSON.stringify(data['benchmarkData'], null, 4));
            });
        } else {
            if (queryParameters.siteUrl === 'Default') {
                templateDestination += '/table';
            } else {
                templateDestination += '/historyTable';
            }

            if(queryParameters.siteStrategy === 'Desktop'){
                siteStrategy = false;
            } else if(queryParameters.siteStrategy === 'Mobile') {
                siteStrategy = true;
            }

            if(queryParameters)

            pagespeedModel.filterData(username, new Date(queryParameters.startDate).setHours(-1) || new Date().setHours(-1), new Date(queryParameters.endDate).setHours(24) || new Date().setHours(24), queryParameters.siteUrl, siteStrategy, function(err, data) {
                if (err) {
                    return next(err);
                }

                filteredData = distinctData(data);

                res.render(templateDestination, {
                    benchmarkData: data,
                    filteredData: filteredData
                });
            });
        }
    }
};
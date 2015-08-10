// var CronJob = require('cron').CronJob;
// var job = new CronJob({
//     cronTime: '00 19 12 * * 1-5',
//     onTick: function() {
//         console.log('job started');
//     },
//     onComplete: function() {
//         console.log('job stopped');
//     },
//     start: true,
//     timeZone: 'Europe/Sofia'
// });
// job.start();

var Pagespeed = require('mongoose').model('Pagespeed'),
    ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    getAll: function(username, callback) {
        Pagespeed
            .find({
                username: username,
            })
            .sort({
                date: 'desc'
            })
            .exec(callback);
    },
    filterData: function(username, startDate, endDate, siteUrl, siteStrategy, callback) {
        var requestObject = {};
        requestObject.username = username;
        requestObject.date = {
            $gte: startDate,
            $lte: endDate
        };

        if (siteUrl !== 'Default') {
            requestObject.siteUrl = siteUrl;
        }

        if (siteStrategy !== undefined) {
            requestObject.isMobile = {$in: [siteStrategy]};
        }

        Pagespeed.find(requestObject)
            .sort({
                date: 'desc'
            })
            .exec(callback);
    },
    getRawData: function(siteId, callback) {
        Pagespeed.findOne({
            _id: ObjectId(siteId)
        }, callback);
    },
    addBenchmarkResult: function(currentUser, benchmarkData, date, isMobile) {
        Pagespeed.create({
            siteUrl: benchmarkData.id,
            benchmarkData: benchmarkData,
            date: date,
            username: currentUser,
            isMobile: isMobile
        });
    }
};
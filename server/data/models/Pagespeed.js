var mongoose = require('mongoose');

module.exports.init = function() {
    var pagespeedSchema = mongoose.Schema({
        siteUrl: {
            type: String,
            required: true
        },
        benchmarkData: {
            type: Object,
            required: true
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        username: {
            type: String,
            required: true
        },
        isMobile: {
            type: Boolean
        }
    });

    var Pagespeed = mongoose.model('Pagespeed', pagespeedSchema);
};
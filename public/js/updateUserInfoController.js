(function() {
    'use strict';

    $('#profile-form').on('click', '#update-profile', function() {
        var hasInvalidSites = $('.has-error'),
            currentSiteName = '';

        if (hasInvalidSites.length) {
            $('#error-div').show(1500).delay(2000).hide(1500);
            return;
        }

        var userProfile = {},
            sites = [],
            siteNames = $('.site-name');

        for (var i = 0, len = siteNames.length; i < len; i++) {
            currentSiteName = siteNames[i].value;

            if (currentSiteName) {
                sites.push(currentSiteName);
            }
        }
        userProfile.username = $('#username').text();
        userProfile.sites = sites;

        httpRequester.sendRequest(window.location.href, 'PUT', JSON.stringify(userProfile)).then(function(result) {
            window.location = result;
        }, function(err) {
            console.log(err);
        });
    });
}());
'use strict';

var fs = require('fs');
var parse = require('csv-parse');
var google = require('googleapis');
var pageSpeed = google.pagespeedonline('v2').pagespeedapi;

fs.readFile('data.csv', 'utf8', function (err, data) {
    if (err) {
        console.log(err);
        return;
    }

    parseCSV(data);
});

function parseCSV(data) {
    var url = '';
    parse(data, {delimiter: ','}, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }

        for (var i = 0, len = data.length; i < len; i++) {
            url = data[i][0];
            runBenchmark(url);
        }
    });
}

function runBenchmark(url) {
    // Check if file exists
    try {
        checkIfFileExists('output.csv');
    } catch (e) {
        console.log(e);
        var columns = 'date,site,responseCode,speed,numberRequests\n'; // Put in different function which checks if file exists if not create file with this header
        fs.writeFile('output.csv', columns);
    }
    pageSpeed.runpagespeed({url: url}, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }

        // Fetch data
        var dataLine = parseJSON(data);
        fs.appendFile('output.csv', dataLine);
    });
}

function parseJSON(data) {
    var result = '';
    result = result + new Date().toDateString() + ',' + data.id + ',' + data.responseCode + ',' + data.ruleGroups.SPEED.score + ',' + data.pageStats.totalRequestBytes + '\n';

    return result;
}

function checkIfFileExists(filename) {
    fs.lstatSync(filename);
}
var googleCharts = (function() {
    'use strict';

    google.load("visualization", "1", {
        packages: ["corechart", "line"]
    });

    function drawPieChart(columnsData) {
        var data = google.visualization.arrayToDataTable(columnsData);

        var options = {
            title: 'PageSpeed'
        };

        var chart = new google.visualization.PieChart(document.getElementById('chart-wrapper'));

        chart.draw(data, options);
    }

    function drawLineChart(columnsData) {
        var data = google.visualization.arrayToDataTable(columnsData);

        var options = {
            title: 'Site Speed',
            // curveType: 'function',
            legend: {
                position: 'bottom'
            }
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart-wrapper'));

        chart.draw(data, options);
    }

    return {
        drawPieChart: drawPieChart,
        drawLineChart: drawLineChart
    };
}());
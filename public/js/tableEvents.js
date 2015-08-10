$(function() {
    var PIE_CHART_MAPPING = [
        'Request Bytes',
        'JavaScript Size',
        'CSS Size',
        'HTML Size',
        'Image Size'
    ];

    $("#start-date").datepicker();
    $("#end-date").datepicker();
    $('#table-wrapper').tooltip();

    function PieParseTable(columnsData) {
        var result = [];
        result.push(['Site', 'Site Chart']);

        for (var i = 0, len = columnsData.length; i < len; i++) {
            result.push([PIE_CHART_MAPPING[i], columnsData[i].innerHTML | 0]);
        }

        return result;
    }

    function LineParseTable(columnsData) {
        var result = [];

        result.push(['Year', 'Speed']);
        for (var len = columnsData.length - 1, i = len; i >= 0; i--) {
            result.push([columnsData[i].getAttribute('title'), columnsData[i].innerHTML | 0]);
        }

        return result;
    }

    $('#filter').on('click', function() {
        var data = {};

        data.startDate = $('#start-date').val();
        data.endDate = $('#end-date').val();
        data.siteStrategy = $('#site-strategy').val();
        data.siteUrl = $("#site-urls option:selected").text();

        httpRequester.sendRequest(window.location.href, 'GET', data).then(function(data) {
            $('#table-wrapper').html(data);
        }, function(err) {
            console.log(err);
        });
    });
    $('#table-wrapper').on('click', '.show-raw', function() {
        var siteId = $(this).siblings('.site-name').attr('id') || $(this).attr('id');
        httpRequester.sendRequest(window.location.href, 'GET', {
            siteId: siteId
        }).then(function(data) {
            $('#raw-data')
                .dialog({
                    width: 900,
                    height: 900,
                    modal: true
                })
                .html(data);
        }, function(err) {
            console.log(err);
        });
    });

    $('#table-wrapper').on('click', '.show-pie-chart', function() {
        var columnsData = $(this).siblings('.metrics'),
            data = PieParseTable(columnsData);

        $('#chart-wrapper').dialog({
            width: 900,
            height: 500,
            modal: true
        });

        google.setOnLoadCallback(googleCharts.drawPieChart(data));
    });

    $('#table-wrapper').on('click', '.show-line-chart', function() {
        var columnsData = $(this).siblings('.date'),
            data = LineParseTable(columnsData);

        $('#chart-wrapper').dialog({
            width: 900,
            height: 500,
            modal: true
        });

        google.setOnLoadCallback(googleCharts.drawLineChart(data));
    });
});
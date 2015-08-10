(function() {
    'use strict';

    var counter = 0;

    $('#add-site').on('click', function(e) {
        counter++;

        var label = $('<label>Site:</label>'),
            inputField = $('<input />').addClass('site-name form-control').attr('type', 'text').attr('name', 'site_' + counter).attr('required', 'required').attr('autocomplete', 'off'),
            formDiv = $('<div />').addClass('site form-group has-error').append(label).append(inputField);

        $(this).after(formDiv);
    });
}());
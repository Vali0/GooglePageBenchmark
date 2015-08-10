$('#sites-form').on('click', '#check-all', function() {
    var checkboxes = $('.check-box');

    for (var i = 0, len = checkboxes.length; i < len; i++) {
        $(checkboxes[i]).prop('checked', 'checked');
    }
});
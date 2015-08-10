(function() {
    'use strict';

    function validateSites() {
        var $this = $(this),
            isUrl = validator.isURL($this.val());

        if (!isUrl) {
            $this.addClass('has-error');
            $this.parent().removeClass('has-success').addClass('has-error');
        } else {
            $this.removeClass('has-error');
            $this.parent().removeClass('has-error').addClass('has-success');
        }
    }

    $('#sites-form').on('click', '#benchmark-sites', function(e) {
        var hasInvalidSites = $('.has-error');

        if (hasInvalidSites.length) {
            e.preventDefault();
            $('#error-div').show(1500).delay(2000).hide(1500);
        }
    });

    $('#sites-form').on('keyup', '.site-name', validateSites);
    $('#profile-form').on('keyup', '.site-name', validateSites);
}());
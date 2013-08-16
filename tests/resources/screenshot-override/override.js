(function ($) {

    $(document).ready(function () {
        var triggerAjax = function () {
            console.log("__AJAX_DONE__");
        };

        var triggerRenderIfNoAjax = function () {
            if (window.globalAjaxQueue.active === 0) {
                // make sure to wait for images that might be loading
                $('body').waitForImages(function () {
                    console.log("WIDTH: " + $('.piwik-graph').parent().css('width') + ' - ' + $('.piwik-graph').parent()[0].clientWidth);
                    // wait some more to make sure other javascript is executed & the last image is rendered
                    setTimeout(triggerAjax, 1000);
                });
            }
        };

        window.piwik = window.piwik || {};
        window.piwik.ajaxRequestFinished = triggerRenderIfNoAjax;

        // in case there are no ajax requests, try triggering immediately
        setTimeout(triggerRenderIfNoAjax, 1);

        // only allowed at most one minute to load
        setTimeout(triggerAjax, 1000 * 60);
    });

}(jQuery));
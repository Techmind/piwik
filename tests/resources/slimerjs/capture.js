var fs = require('fs');

var PageRenderer = function() {
    this.start = new Date();

    this.urlIndex = 0;
    this.urls = JSON.parse(fs.readFileSync('../../tmp/urls.txt'));
    this.webpage = require('webpage').create();

    this.outputPath = '';
    this.url = '';

    this._setupWebpageEvents();
    this._setScriptTimeout();
};

PageRenderer.prototype = {
    renderAll: function () {
        this._saveCurrentUrl();
    },

    _saveCurrentUrl: function() {
        if (this.urlIndex >= this.urls.length) {
            slimer.exit();
            return;
        }

        this.outputPath = this.urls[this.urlIndex][0];
        this.url = this.urls[this.urlIndex][1];

        console.log("SAVING " + this.url + " at " + this._getElapsedExecutionTime());

        this.webpage.open(this.url);
    },

    _setupWebpageEvents: function() {
        this.webpage.onError = function (message) {
            console.log("ERROR: " + message);
        };

        var self = this;
        this.webpage.onConsoleMessage = function (message) {
            if (message == "__AJAX_DONE__") {
                try {
                    self._setCorrectViewportSize();
                    self.webpage.render(self.outputPath);

                    self._renderNextUrl();
                } catch (e) {
                    console.log("ERROR: " + e.message);
                    slimer.exit(1);
                }
            } else {
                console.log("LOGGED: " + message);
            }
        };
    },

    _renderNextUrl: function () {
        ++this.urlIndex;
        this._saveCurrentUrl();
    },

    _setCorrectViewportSize: function() {
        this.webpage.viewportSize = {width:1350, height:768};
        var height = Math.max(768, this.webpage.evaluate(function() {
            return document.body.offsetHeight;
        }));
        this.webpage.viewportSize = {width:1350, height: height};
    },

    _getElapsedExecutionTime: function() {
        var now = new Date(),
            elapsed = now.getTime() - this.start.getTime();

        return (elapsed / 1000.0) + "s";
    },

    _setScriptTimeout: function () {
        setTimeout(function() {
            console.log("ERROR: Timed out!");
            slimer.exit(1);
        }, Math.max(1000 * 15 * this.urls.length, 1000 * 60));
    },
};

try {
    var renderer = new PageRenderer();
    renderer.renderAll();
} catch (e) {
    console.log("ERROR: " + e.message);
    slimer.exit(1);
}
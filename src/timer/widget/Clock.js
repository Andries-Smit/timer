define([
    "dojo/_base/declare",
    "timer/widget/Timer"
], function (declare, Timer) {
    "use strict";

    return declare("timer.widget.Clock", [ Timer ], {

        postMixInProperties: function () {
            this.type = "clock"
        }
    });
});

require(["timer/widget/Clock"]);

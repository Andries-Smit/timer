define([
    "dojo/_base/declare",
    "timer/widget/Timer"
], function (declare, Timer) {
    "use strict";

    return declare("timer.widget.Duration", [ Timer ], {

        postMixInProperties: function () {
            this.type = "duration"
        }
    });
});

require(["timer/widget/Duration"]);

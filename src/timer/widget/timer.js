define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/_base/lang"
], function (declare, _WidgetBase, dojoClass, dojoStyle, lang) {
    "use strict";

    return declare("timer.widget.Timer", [ _WidgetBase ], {

        // Modeler attribtues
        formatTime: "",
        type: "clock", // "clock" | "duration"
        refreshInterval: 1,
        startTimeAttribute: "",

        // Internal variables.
        _handles: null,
        _contextObj: null,
        _intervalHandle: null,
        _startTime: null,

        constructor: function () {
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            dojoClass.add(this.domNode, "widget-trimer-" + this.type);
            if (this.type === "clock") {
                this.startClock();
            }
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;

            this._updateRendering(callback);
        },

        updateClock: function() {
            var time;
            if(this.type === "clock") {
                time = new Date();
            } else {
                time = new Date() - this._startTime;
            }
            this.domNode.innerHTML = mx.parser.formatValue(time, "datetime", {
                datePattern: this.formatTime
            });
        },

        startClock: function() {
            dojoStyle.set(this.domNode, "display", "block");
            if (!this._intervalHandle) {
                this._intervalHandle = window.setInterval(lang.hitch(this, this.updateClock), this.refreshInterval);
            }
        },

        stopClock: function(){
            dojoStyle.set(this.domNode, "display", "none");
            if(this._intervalHandle) {
                window.clearInterval(this._intervalHandle);
                this._intervalHandle = null;
            }
        },

        resize: function (box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
            this.stopClock();
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");
            if(this.type === "duration") {
                if (this._contextObj !== null) {
                    if(this.startTimeAttribute && this.type === "duration") {
                        this._startTime = this._contextObj.get(this.startTimeAttribute);
                        if(this._startTime) {                        
                            this.startClock();
                        } else {
                            this.stopClock();
                        }
                    }
                } else {
                    this.stopClock();
                }
            }

            this._executeCallback(callback, "_updateRendering");
        },

        // Shorthand for running a microflow
        _execMf: function (mf, guid, cb) {
            logger.debug(this.id + "._execMf");
            if (mf && guid) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [guid]
                    },
                    callback: lang.hitch(this, function (objs) {
                        if (cb && typeof cb === "function") {
                            cb(objs);
                        }
                    }),
                    error: function (error) {
                        console.debug(error.description);
                    }
                }, this);
            }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

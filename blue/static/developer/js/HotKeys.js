var HotKeys = /** @class */ (function () {
    function HotKeys(debug) {
        if (debug === void 0) { debug = false; }
        this.debug = false;
        this.keys = [];
        this.debug = debug;
    }
    ;
    HotKeys.prototype.AddKey = function (callback, params, key, allowAlt, allowCtrl, allowShift) {
        if (allowAlt === void 0) { allowAlt = false; }
        if (allowCtrl === void 0) { allowCtrl = false; }
        if (allowShift === void 0) { allowShift = false; }
        this.keys.push({
            callback: callback,
            params: params,
            key: key,
            alt: allowAlt,
            ctrl: allowCtrl,
            shift: allowShift
        });
    };
    ;
    HotKeys.prototype.Run = function () {
        var that = this;
        document.addEventListener('keydown', function (event) {
            for (var key in that.keys) {
                if (event.key === that.keys[key]['key'] && event.altKey === that.keys[key]['alt'] && event.ctrlKey === that.keys[key]['ctrl'] && event.shiftKey === that.keys[key]['shift']) {
                    that.keys[key]['callback'](that.keys[key]['params']);
                }
            }
        });
    };
    ;
    return HotKeys;
}());

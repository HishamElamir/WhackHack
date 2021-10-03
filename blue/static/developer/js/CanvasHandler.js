var CanvasHandler = /** @class */ (function () {
    function CanvasHandler(canvas_id, height, width) {
        this.Properies = {};
        this.Canvas = document.createElement("canvas");
        this.Context = this.Canvas.getContext("2d");
        this.Generate = function (parent) {
            var canvas_parent = document.getElementById(parent);
            this.Canvas.setAttribute('id', this.Properies['canvas_id']);
            this.Canvas.setAttribute('height', this.Properies['canvas_height']);
            this.Canvas.setAttribute('width', this.Properies['canvas_width']);
            canvas_parent.appendChild(this.Canvas);
        };
        this.GetContext = function () {
            return this.Context;
        };
        this.OnMouseMove = function (callback_function) {
            var that = this;
            this.Canvas.addEventListener('mousemove', function (e) {
                var params = {
                    x: (e.clientX - that.Canvas.offsetLeft),
                    y: (e.clientY - that.Canvas.offsetTop),
                    e: e
                };
                callback_function(params);
            });
        };
        this.OnMouseDown = function (callback_function) {
            var that = this;
            this.Canvas.addEventListener('mousedown', function (e) {
                var params = {
                    x: (e.clientX - that.Canvas.offsetLeft),
                    y: (e.clientY - that.Canvas.offsetTop),
                    e: e
                };
                callback_function(params);
            }, { once: true });
        };
        this.OnMouseUp = function (callback_function) {
            var that = this;
            this.Canvas.addEventListener('mouseup', function (e) {
                var params = {
                    x: (e.clientX - that.Canvas.offsetLeft),
                    y: (e.clientY - that.Canvas.offsetTop),
                    e: e
                };
                callback_function(params);
            });
        };
        this.OnMouseOut = function (callback_function) {
            var that = this;
            this.Canvas.addEventListener('mouseout', function (e) {
                var params = {
                    x: (e.clientX - that.Canvas.offsetLeft),
                    y: (e.clientY - that.Canvas.offsetTop),
                    e: e
                };
                callback_function(params);
            });
        };
        this.Properies['canvas_id'] = canvas_id;
        this.Properies['canvas_height'] = height;
        this.Properies['canvas_width'] = width;
    }
    ;
    return CanvasHandler;
}());

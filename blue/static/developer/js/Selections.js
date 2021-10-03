var Selections = /** @class */ (function () {
    function Selections(ElementName) {
        this.ElementName = null;
        this.CallBackFunction = null;
        this.OnTextSelect = function (CallBackFunction) {
            this.CallBackFunction = CallBackFunction;
        };
        this.Run = function () {
            var e = document.getElementById(this.ElementName);
            e.addEventListener('select', function () {
                this.CallBackFunction([e.value, e.selectionStart, e.selectionEnd]);
            }.bind(this));
        };
        this.ElementName = ElementName;
    }
    ;
    return Selections;
}());

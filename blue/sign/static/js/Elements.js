var Elements = /** @class */ (function () {
    function Elements() {
        this.AddElement = function () { };
        this.AddInput = function (key, eclass, type, required, placeholder, options) {
            var input = null;
            if (type === 'select') {
                var inner_options = options['inner_options'];
                input = document.createElement("select");
                input.setAttributeNode(document.createAttribute('multiple'));
                /**
                 * VALIDATE
                 *
                 * iterate over option to create option element and add it to select
                 * options = ['male', 'female']
                 */
                for (var _i = 0, inner_options_1 = inner_options; _i < inner_options_1.length; _i++) {
                    var opt = inner_options_1[_i];
                    var o = document.createElement('option');
                    o.innerHTML = opt;
                    input.appendChild(o);
                }
            }
            else {
                input = document.createElement("input");
                input.setAttribute('type', type);
                input.setAttribute('class', eclass);
                if (required)
                    input.setAttributeNode(document.createAttribute('required'));
                input.setAttribute('placeholder', placeholder);
            }
            input.setAttribute('id', 'input:' + key);
            input.setAttribute('class', 'form-control');
            return input;
        };
        this.AddButton = function (key, value) {
            var button = document.createElement('input');
            button.setAttribute('id', key + ':button');
            button.setAttribute('class', 'btn btn-primary');
            button.setAttribute('type', 'button');
            button.setAttribute('name', 'submit');
            button.setAttribute('value', value);
            return button;
        };
        this.AddDiv = function () { };
    }
    ;
    return Elements;
}());
;

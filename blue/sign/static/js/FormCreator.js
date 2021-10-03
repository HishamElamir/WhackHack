var FormCreator = /** @class */ (function () {
    function FormCreator(parent_id, key, meta) {
        this.FormElement = document.createElement('form');
        this.ParentId = null;
        this.AddInput = function (key, type, required, placeholder, labelString, smallString, options) {
            // DIV THAT CONTAIN ONE INPUT AND IT'S LABEL AND SMALL
            var div = document.createElement("div");
            div.setAttribute('class', 'form-group');
            div.setAttribute('id', 'InputGroupDiv:' + key);
            // LABEL CREATION AND PROPERTIES
            var label = document.createElement("label");
            label.innerText = labelString;
            // SMALL CREATION AND PROPERTIES
            var small = document.createElement("small");
            small.setAttribute('id', 'small:' + key);
            small.setAttribute('class', 'form-text text-muted');
            small.innerText = smallString;
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
                if (options['value']) {
                    input.setAttribute('value', options['value']);
                }
                input.setAttributeNode(document.createAttribute('required'));
                input.setAttribute('placeholder', placeholder);
            }
            input.setAttribute('id', 'input:' + key);
            input.setAttribute('class', 'form-control');
            div.appendChild(label);
            div.appendChild(input);
            div.appendChild(small);
            this.FormElement.appendChild(div);
        };
        this.AddButton = function (key, value) {
            var button = document.createElement('input');
            button.setAttribute('id', key + ':button');
            button.setAttribute('class', 'btn btn-primary');
            button.setAttribute('type', 'button');
            button.setAttribute('name', 'submit');
            button.setAttribute('value', value);
            this.FormElement.appendChild(button);
        };
        this.Pause = function (state) {
            var elements = this.FormElement.elements;
            for (var i = 0, len = elements.length; i < len; ++i) {
                elements[i].readOnly = state;
            }
        };
        this.Update = function (key, value) {
            document.getElementById(key).innerText = value;
        };
        this.Run = function () {
            var parent = document.getElementById(this.ParentId);
            parent.appendChild(this.FormElement);
        };
        this.ParentId = parent_id;
        this.FormElement.setAttribute('id', 'Form:' + key);
        // this.FormElement.setAttribute('class', 'form-inline');
    }
    ;
    return FormCreator;
}());

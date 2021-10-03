var Forms = /** @class */ (function () {
    function Forms(metadata, scheme) {
        this.Scheme = {};
        this.MetaData = {};
        this.Data = [];
        this.Length = 0;
        this.Properties = {
            Debug: false
        };
        this.Generate = function (option) {
            this.Properties['Debug'] = option['Debug'];
            for (var key in this.MetaData) {
                if (this.MetaData[key][0] === true && key === 'makeForm')
                    this.GenerateForms(this.MetaData[key][1]);
                if (this.MetaData[key][0] === true && key === 'makeTable')
                    this.GenerateTable(this.MetaData[key][1]);
            }
        };
        this.Insert = function (values) {
            //  Validation
            var row = {};
            var errors = [];
            for (var key in this.Scheme) {
                if (this.Scheme[key]['attr'] === 'auto-increment') {
                    row[key] = this.MetaData['autoIncrement'][key];
                    this.MetaData['autoIncrement'][key]++;
                }
                else if (values.hasOwnProperty(key)) {
                    if (this.CheckValueType(values[key], this.Scheme[key]['type'])) {
                        console.log(values[key] + " Success ");
                        row[key] = values[key];
                    }
                    else {
                        console.log(values[key] + " FailOne ");
                        errors.push('Error: ' + values[key] + ' in ' + key + ' is not of type ' + this.Scheme[key]['type']);
                    }
                }
                else if (this.Scheme[key]['default']) {
                    if (this.CheckValueType(this.Scheme[key]['default'], this.Scheme[key]['type'])) {
                        row[key] = this.Scheme[key]['default'];
                    }
                    else {
                        console.log(values[key] + " FailTwo ");
                        errors.push('Error: ' + this.Scheme[key]['default'] + ' in ' + key + ' is not of type ' + this.Scheme[key]['type']);
                    }
                }
                else if (this.Scheme[key]['Null'] === false) {
                    errors.push('Error: Missing ' + key + ' of insertion.');
                }
                else if (this.Scheme[key]['Null'] === true) {
                    row[key] = NaN;
                }
                else {
                    console.log(values[key] + "Big Fail");
                }
            }
            //  Insertion
            if (errors.length < 1) {
                if (this.Properties['Debug'] === true)
                    console.log(row);
                this.Data.push(row);
                this.Length++;
                return true;
            }
            else {
                console.log(errors);
                return errors;
            }
        };
        this.InsertIntoTable = function (data) {
            var table = document.getElementById("tableUpdateContentArea");
            while (table.firstChild) {
                table.removeChild(table.firstChild);
            }
            for (var i = 0; i < data.length; i++) {
                var ith = document.createElement('tr');
                for (var j in this.Scheme) {
                    var th = document.createElement('th');
                    th.innerHTML = String(data[i][j]).toString();
                    ith.appendChild(th);
                }
                table.appendChild(ith);
            }
        };
        this.SetKeys = function (option) {
            var _loop_1 = function (key) {
                that = this_1;
                document.addEventListener('keydown', function (event) {
                    if (event.key === option[key]['key'] && event.altKey === option[key]['allowAlt']) {
                        option[key]['do'](key, that);
                    }
                });
            };
            var this_1 = this, that;
            for (var key in option) {
                _loop_1(key);
            }
        };
        this.Submit = function (key, that) {
            var data = that.GetValues();
            that.InsertIntoTable(data);
        };
        this.MakeRequest = function () {
            var form = document.createElement("form");
            form.setAttribute("method", this.MetaData['makeForm'][3]);
            form.setAttribute("action", this.MetaData['makeForm'][2]);
            for (var i = 0; i < this.Data.length; i++) {
                for (var key in this.Data[i]) {
                    var input = this.CreateInputWithValue(this.Data[i][key], 'hidden', key);
                    form.appendChild(input);
                }
            }
            console.log(form);
            // document.body.appendChild(form);
            form.submit();
        };
        this.HoverInput = function (id, that) {
            var input = document.getElementById('input:' + id);
            input.focus();
        };
        this.GetValues = function () {
            var row = {};
            for (var key in this.Scheme) {
                if (this.Scheme[key]['allowInput'] && this.Scheme[key]['allowInput'] === true) {
                    if (this.Scheme[key]['inputType'] === 'checkbox' && this.Scheme[key]['type'] === 'boolean')
                        row[key] = document.getElementById('input:' + key).checked;
                    else
                        row[key] = document.getElementById('input:' + key).value;
                }
            }
            if (this.Properties['Debug'] === true)
                console.log(row);
            this.Insert(row);
            return this.Data;
        };
        this.RunFlow = function () {
            var button = document.getElementById(this.MetaData['makeForm'][1] + ':button');
            var that = this;
            button.onclick = function () {
                var data = that.GetValues();
                that.InsertIntoTable(data);
            };
        };
        this.CheckValueType = function (value, type) {
            if (type === 'string') {
                if (typeof value === 'string')
                    return true;
                else
                    return false;
            }
            else if (type === 'text') {
                if (typeof value === 'string')
                    return true;
                else
                    return false;
            }
            else if (type === 'number') {
                if (isFinite(value) === true)
                    return true;
                else
                    return false;
            }
            else if (type === 'boolean') {
                if (typeof Boolean(value) === 'boolean')
                    return true;
                else
                    return false;
            }
            else if (type === 'email') {
                if (typeof value === 'string')
                    return true;
                else
                    return false;
            }
            else {
                return false;
            }
        };
        this.GenerateForms = function (element) {
            var elem = document.getElementById(element);
            var form = document.createElement("form");
            var button = this.CreateButtonInput();
            form.setAttribute('action', this.MetaData['makeForm'][2]);
            form.setAttribute('method', this.MetaData['makeForm'][3]);
            for (var key in this.Scheme) {
                if (this.Scheme[key]['allowInput'] && this.Scheme[key]['allowInput'] === true) {
                    if (this.Scheme[key]['inputType']) {
                        if (this.Properties['Debug'])
                            console.log("Input Created: key: " + key + " InputType: " + this.Scheme[key]['inputType']);
                        var p = this.CreateInputWithProp(key, this.Scheme[key]['inputType'], this.Scheme[key]['allowNulls'], this.Scheme[key]['placeholder'], this.Scheme[key]['label'], this.Scheme[key]['small']);
                    }
                    else {
                        if (this.Properties['Debug'])
                            console.log("Input Created: key: " + key + " InputType: " + this.Scheme[key]['type']);
                        var p = this.CreateInputWithProp(key, this.Scheme[key]['type'], this.Scheme[key]['allowNulls'], this.Scheme[key]['placeholder'], this.Scheme[key]['label'], this.Scheme[key]['small']);
                    }
                    form.appendChild(p);
                }
            }
            form.appendChild(button);
            elem.appendChild(form);
        };
        this.GenerateTable = function (element) {
            var div = document.getElementById(element);
            var table = document.createElement("table");
            var thead = document.createElement("thead");
            var tbody = document.createElement("tbody");
            var trhead = document.createElement('tr');
            table.setAttribute('class', 'table');
            tbody.setAttribute('id', 'tableUpdateContentArea');
            for (var key in this.Scheme) {
                var th = document.createElement('th');
                th.setAttribute('scope', 'col');
                th.innerText = key;
                trhead.appendChild(th);
            }
            thead.appendChild(trhead);
            table.appendChild(thead);
            table.appendChild(tbody);
            div.appendChild(table);
        };
        this.CreateInputWithProp = function (key, type, required, placeholder, labelString, smallString) {
            var div = document.createElement("div");
            var label = document.createElement("label");
            var input = document.createElement("input");
            var small = document.createElement("small");
            label.innerText = labelString;
            small.innerText = smallString;
            div.setAttribute('class', 'form-group');
            input.setAttribute('id', 'input:' + key);
            input.setAttribute('type', type);
            input.setAttributeNode(document.createAttribute('required'));
            input.setAttribute('placeholder', placeholder);
            input.setAttribute('class', 'form-control');
            small.setAttribute('id', 'small:' + key);
            small.setAttribute('class', 'form-text text-muted');
            div.appendChild(label);
            div.appendChild(input);
            div.appendChild(small);
            return div;
        };
        this.CreateInputWithValue = function (value, type, name, element) {
            if (element === void 0) { element = 'input'; }
            var input = document.createElement(element);
            input.setAttribute("name", name);
            input.setAttribute("type", type);
            input.setAttribute("value", value);
            return input;
        };
        this.CreateButtonInput = function () {
            var button = document.createElement('input');
            button.setAttribute('id', this.MetaData['makeForm'][1] + ':button');
            button.setAttribute('class', 'btn btn-primary');
            button.setAttribute('type', 'button');
            button.setAttribute('name', 'submit');
            button.setAttribute('onclick', this.MetaData['dataStructure']);
            button.setAttribute('value', 'Add');
            return button;
        };
        this.MetaData = metadata;
        this.Scheme = scheme;
        this.MetaData['autoIncrement'] = {};
        for (var key in this.Scheme) {
            if (this.Scheme[key]['attr'] === 'auto-increment') {
                this.MetaData['autoIncrement'][key] = 0;
            }
        }
    }
    ;
    return Forms;
}());
;

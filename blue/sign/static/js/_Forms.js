// TODO: DOCUMENTING
// TODO: VALIDATE SENDING
// TODO: MAKE GETTING FROM SERVER TO TABLE
// TODO: CONNECT TO SERVER ON INITIATION AND TAKE SOME INFORMATIONS
// TODO: FIX ID ISSUE OR MAKE AN ADVANCED INTIATION TO TAKE DYNAMIC INFO
/**
 * Forms
 *
 * this class main reponsibilty is to make forms/tables creation easier for developer
 * using just and only javscript, also make it easy to validate and send data to servers
 */
var Forms = /** @class */ (function () {
    function Forms(metadata, scheme) {
        this.Scheme = {};
        this.MetaData = {};
        this.Data = [];
        this.Length = 0;
        this.Properties = {
            Debug: false
        };
        /**
         * Generate both of form and table
         */
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
                if (this.Scheme[key]['attr'] === 'auto-increment') { //  check if id
                    row[key] = this.MetaData['autoIncrement'][key];
                    this.MetaData['autoIncrement'][key]++;
                }
                else if (values.hasOwnProperty(key)) {
                    if (this.CheckValueType(values[key], this.Scheme[key]['type'])) { //  check type
                        console.log(values[key] + " Success ");
                        row[key] = values[key];
                    }
                    else {
                        console.log(values[key] + " FailOne ");
                        errors.push('Error: ' + values[key] + ' in ' + key + ' is not of type ' + this.Scheme[key]['type']);
                    }
                }
                else if (this.Scheme[key]['default']) { //  check if no value then default
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
            var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
            xmlhttp.open(this.MetaData['makeForm'][3], this.MetaData['makeForm'][2]);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    var return_data = xmlhttp.responseText;
                    alert(return_data);
                }
            };
            xmlhttp.send(JSON.stringify(this.Data));
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
                        if (this.Scheme[key]['inputType'] === 'select') {
                            var p = this.CreateInputWithProp(key, this.Scheme[key]['inputType'], this.Scheme[key]['allowNulls'], this.Scheme[key]['placeholder'], this.Scheme[key]['label'], this.Scheme[key]['small'], { inner_options: this.Scheme[key]['options'] });
                        }
                        else if (this.Scheme[key]['inputType'] === 'checkbox') {
                            var p = this.CreateInputWithProp(key, this.Scheme[key]['inputType'], this.Scheme[key]['allowNulls'], this.Scheme[key]['placeholder'], this.Scheme[key]['label'], this.Scheme[key]['small'], {});
                        }
                    }
                    else {
                        if (this.Properties['Debug'])
                            console.log("Input Created: key: " + key + " InputType: " + this.Scheme[key]['type']);
                        var p = this.CreateInputWithProp(key, this.Scheme[key]['type'], this.Scheme[key]['allowNulls'], this.Scheme[key]['placeholder'], this.Scheme[key]['label'], this.Scheme[key]['small'], {});
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
        this.CreateInputWithProp = function (key, type, required, placeholder, labelString, smallString, options) {
            // DIV THAT CONTAIN ONE INPUT AND IT'S LABEL AND SMALL
            var div = document.createElement("div");
            div.setAttribute('class', 'form-group');
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
                input.setAttributeNode(document.createAttribute('required'));
                input.setAttribute('placeholder', placeholder);
            }
            input.setAttribute('id', 'input:' + key);
            input.setAttribute('class', 'form-control');
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
        // ON START IT TAKES THE LATEST ID TO START FROM
        /** STOPPED FOR FIXING
        if (this.MetaData['connectOnStart']) {
            var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
            xmlhttp.open(this.MetaData['connectOnStart'][1], this.MetaData['connectOnStart'][0]);
            xmlhttp.responseType = this.MetaData['connectOnStart'][2];
            xmlhttp.onload = function () {
                if(xmlhttp.status === 200) {
                    
                }
            }
            xmlhttp.send();
        }
         */
    }
    ;
    return Forms;
}());
;

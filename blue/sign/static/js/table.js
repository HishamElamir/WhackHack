var Table = /** @class */ (function () {
    function Table(parent_id) {
        this.Header = [];
        this.Rows = [];
        this.Elements = [];
        this.RowsLength = 0;
        this.UpdateCallBackFunction = null;
        this.DeleteCallBackFunction = null;
        this.Parent = null;
        this.TableElement = document.createElement('table');
        this.HeaderElement = document.createElement('thead');
        this.BodyElement = document.createElement('tbody');
        this.AddHeader = function (header) {
            this.Header = header;
            var TrElement = document.createElement('tr');
            // adding Index
            var ThElement = document.createElement('th');
            ThElement.setAttribute('scope', 'col');
            ThElement.innerText = '#';
            TrElement.appendChild(ThElement);
            for (var i = 0; i < this.Header.length; i++) {
                var ThElement = document.createElement('th');
                ThElement.setAttribute('scope', 'col');
                ThElement.innerText = this.Header[i];
                TrElement.appendChild(ThElement);
            }
            // adding Options
            var ThElement = document.createElement('th');
            ThElement.setAttribute('scope', 'col');
            ThElement.innerText = 'Options';
            TrElement.appendChild(ThElement);
            this.HeaderElement.appendChild(TrElement);
        };
        this.GetRowsNumber = function () {
            return this.RowsLength;
        };
        this.GetRows = function () {
            return this.Rows;
        };
        this.AddRow = function (row, index) {
            this.Rows.splice(index, 0, row);
        };
        this.PushRow = function (row) {
            this.Rows.push(row);
            this.RowsLength++;
        };
        this.AddElements = function (elements) {
            this.Elements.push(elements);
        };
        this.Update = function () {
            while (this.BodyElement.firstChild) {
                this.BodyElement.removeChild(this.BodyElement.firstChild);
            }
            this.Run();
        };
        this.SetUpdateRow = function (CallBackFunction) {
            this.UpdateCallBackFunction = CallBackFunction;
        };
        this.SetDeleteRow = function (CallBackFunction) {
            this.DeleteCallBackFunction = CallBackFunction;
        };
        this.Run = function () {
            // adding rows
            if (this.Rows.length) {
                var _loop_1 = function (row) {
                    TrElement = document.createElement('tr');
                    ThElement = document.createElement('th');
                    ThElement.setAttribute('scope', 'row');
                    ThElement.innerText = row.toString();
                    TrElement.appendChild(ThElement);
                    for (var i = 0; i < this_1.Rows[row].length; i++) {
                        TdElement = document.createElement('td');
                        TdElement.innerText = this_1.Rows[row][i].toString();
                        TrElement.appendChild(TdElement);
                    }
                    // adding options
                    TdElement = document.createElement('td');
                    // Update
                    UpdateButtonElement = document.createElement('button');
                    UpdateButtonElement.setAttribute('class', 'btn btn-primary');
                    UpdateButtonElement.setAttribute('id', 'UpdateRow:' + row);
                    UpdateButtonElement.innerText = 'Update';
                    UpdateButtonElement.onclick = function () {
                        this.UpdateCallBackFunction(row, this.Rows);
                    }.bind(this_1);
                    // Delete
                    DeleteButtonElement = document.createElement('button');
                    DeleteButtonElement.setAttribute('class', 'btn btn-primary');
                    DeleteButtonElement.setAttribute('id', 'DeleteRow:' + row);
                    DeleteButtonElement.innerText = 'Delete';
                    DeleteButtonElement.onclick = function () {
                        this.DeleteCallBackFunction(row, this.Rows);
                    }.bind(this_1);
                    TrElement.appendChild(UpdateButtonElement);
                    TrElement.appendChild(DeleteButtonElement);
                    this_1.BodyElement.appendChild(TrElement);
                };
                var this_1 = this, TrElement, ThElement, TdElement, TdElement, UpdateButtonElement, DeleteButtonElement;
                for (var row = 0; row < this.Rows.length; row++) {
                    _loop_1(row);
                }
            }
            // adding elements
            if (this.Elements.length) {
                for (var row = 0; row < this.Elements.length; row++) {
                    var TrElement = document.createElement('tr');
                    var ThElement = document.createElement('th');
                    ThElement.setAttribute('scope', 'row');
                    ThElement.innerText = 'E#';
                    TrElement.appendChild(ThElement);
                    for (var i = 0; i < this.Elements[row].length; i++) {
                        var TdElement = document.createElement('td');
                        TdElement.appendChild(this.Elements[row][i]);
                        TrElement.appendChild(TdElement);
                    }
                    this.BodyElement.appendChild(TrElement);
                }
            }
        };
        this.Parent = document.getElementById(parent_id);
        this.TableElement.setAttribute('class', 'table');
        this.TableElement.appendChild(this.HeaderElement);
        this.TableElement.appendChild(this.BodyElement);
        this.Parent.appendChild(this.TableElement);
    }
    ;
    return Table;
}());
;

// TODO: TRANSFORM TO TYPESCRIPT
// TODO: ADD DOCUMENTATION
// TODO: HANDSHAKE WITH EVENT MANAGER: DONE BUT NEED TESTING

function Trees (context) {
    this.mContext = context;
    this.mLeaves = [];
    this.mConnections = [];
};

Trees.prototype.Draw = function () {
    // clear the canvas (for animation)
    this.mContext.clearRect(0, 0, this.mContext.canvas.width, this.mContext.canvas.height);
    
    // Drawing Leaves
    for(var leaf in this.mLeaves){
        this.mContext.save();
        this.mContext.beginPath();
        var l = this.mLeaves[leaf]; // LEAF
        var leafId = l['id'];
        var leafPosition = l['position'];
        var leafSize = l['size'];
        var leafTitle = l['title'];
        this.mContext.strokeStyle = l['color'];
        this.mContext.rect(leafPosition[0], leafPosition[1], leafSize[0], leafSize[1]);
        
        if (leafTitle) {
            var textPosition = this._calculateTextPosition(l, leafTitle[1]);
            this.mContext.fillText(leafTitle[0], textPosition[0], textPosition[1]);
        }
        
        this.mContext.stroke();
        this.mContext.closePath();
        this.mContext.restore();
    }
    
    //  CALCULATING THE CONNECTIONS
    for(var conn in this.mConnections){
        this.mContext.save();
        this.mContext.beginPath();
        var c = this.mConnections[conn]; // LEAF
        
        var connectionId = c['id'];
        var fromConnection = c['from'];
        var toConnection = c['to'];
        var connectionType = c['type'];
        var marked = c['markConnection'] | false;
        var fromLeaf = this.mLeaves[fromConnection[0]];
        var toLeaf = this.mLeaves[toConnection[0]];
        
        //  CALCULATE INTERSECTION POINTS
        var fromConnectionPosition = this._calculateLeafConnectionPosition(fromLeaf, fromConnection[1]);
        var toConnectionPosition = this._calculateLeafConnectionPosition(toLeaf, toConnection[1]);
        if (marked) {
            this.mContext.fillRect(fromConnectionPosition[0], fromConnectionPosition[1] - 2.5, 5,5);
            this.mContext.fillRect(toConnectionPosition[0] - 2.5, toConnectionPosition[1] - 2.5, 5,5);
        }
        
        this.mContext.strokeStyle = c['color'];
        // TODO: NEED TO CONSIDER CONNECTION POSITION
        this._connectIntersectionPoints(fromConnectionPosition, toConnectionPosition, connectionType, [fromConnection[1], toConnection[1]], this.mContext);
        this.mContext.stroke();
        this.mContext.closePath();
        this.mContext.restore();
    }
};

Trees.prototype.AddConnection = function (conn) {
    var id = conn['id'];
    this.mConnections[id] = conn;
    return this;
};

Trees.prototype.AddLeaf = function (leaf) {
    var id = leaf['id'];
    this.mLeaves[id] = leaf;
    return this;
};

//  UTIL FUNCTIONS
Trees.prototype.Printer = function () {
    
};

Trees.prototype.IsLeaf = function (x, y) {
    for(var leaf in this.mLeaves){
        var l = this.mLeaves[leaf]; // LEAF
        var leafPosition = l['position'];
        var leafSize = l['size'];
        if (x >= leafPosition[0] && x <= leafPosition[0] + leafSize[0] && y >= leafPosition[1] && y <= leafPosition[1] + leafSize[1]) {
            return true;
        }
    }
    return false;
};

Trees.prototype.GetLeafInPosition = function (x, y) {
    // Drawing Leaves
    for(var leaf in this.mLeaves){
        var l = this.mLeaves[leaf]; // LEAF
        var leafId = l['id'];
        var leafPosition = l['position'];
        var leafSize = l['size'];
        if (x >= leafPosition[0] && x <= leafPosition[0] + leafSize[0] && y >= leafPosition[1] && y <= leafPosition[1] + leafSize[1]) {
            return leafId;
        }
    }
};

Trees.prototype.Remove = function (leafId, flag = false) {
    var l = this.mLeaves[leafId];
    delete this.mLeaves[leafId];
    var connectionArray = this._findLeavesConnections(leafId);
    this._deleteAllConnectionInArray(connectionArray);
    this.Draw();
    if(flag) console.log('=== leaf removed ===' + '\n' + 'leaf id: ' + l['id']);
    return this;
};

Trees.prototype.RemoveAll = function (flag = false) {
    // for(leafId in this.mLeaves) {
    //     var l = this.mLeaves[leafId];
    //     delete this.mLeaves[leafId];
    //     var connectionArray = this._findLeavesConnections(leafId);
    //     this._deleteAllConnectionInArray(connectionArray);
    //     this.Draw();
    //     if(flag) console.log('=== leaf removed ===' + '\n' + 'leaf id: ' + l['id']);
    // }

    this.mLeaves = [];
    this.mConnections = [];
    this.Draw();
    if(flag) console.log('=== all leaves are removed ===');
    return this;
};

Trees.prototype.Move = function (leafId, pos, flag = false) {
    var l = this.mLeaves[leafId];
    var oldPosition = l['position'];
    this.mLeaves[leafId]['position'] = pos;
    this.Draw();
    if(flag) console.log('=== leaf moved ===' + '\n' + 'leaf id: ' + l['id'] + '\n' + 'old position: ' + oldPosition + '\n' + 'new position: ' + pos);
    return this;
};

Trees.prototype.Resize = function (leafId, size, flag = false) {
    var l = this.mLeaves[leafId];
    var oldSize = l['size'];
    this.mLeaves[leafId]['size'] = size;
    this.Draw();
    if(flag) console.log('=== leaf resized ===' + '\n' + 'leaf id: ' + l['id'] + '\n' + 'old size: ' + oldSize + '\n' + 'new size: ' + size);
    return this;
};

Trees.prototype.Recolor = function (leafId, color, flag = false) {
    var l = this.mLeaves[leafId];
    var oldColor = l['color'];
    this.mLeaves[leafId]['color'] = color;
    this.Draw();
    if(flag) console.log('=== leaf recolored ===' + '\n' + 'leaf id: ' + l['id'] + '\n' + 'old color: ' + oldColor + '\n' + 'new color: ' + color);
    return this;
};

//  PRIVATE UTIL FUNCTIONS


Trees.prototype._calculateTextPosition = function (leaf, positionType) {
    var paddingRight = 10; // MODIFY
    var paddingLeft = 30; // MODIFY
    if (positionType === "POSITION.RIGHT") {
        return [leaf['position'][0] + leaf['size'][0] + paddingRight, leaf['position'][1] + (leaf['size'][1])];
    } else if (positionType === "POSITION.LEFT") {
        return [leaf['position'][0] - paddingLeft, leaf['position'][1] + (leaf['size'][1] / 2)];
    } else if (positionType === "POSITION.TOP") {
        return [leaf['position'][0] + (leaf['size'][0] / 2 - paddingRight), leaf['position'][1]];
    } else if (positionType === "POSITION.BOTTOM") {
        return [leaf['position'][0] + (leaf['size'][0] / 2 - paddingRight), leaf['position'][1] + leaf['size'][1] + paddingRight];
    } else if (positionType === "POSITION.CENTER") {
        return [leaf['position'][0] + leaf['size'][0] / 2 - paddingRight, leaf['position'][1] + leaf['size'][1]/2 + paddingLeft/2 - paddingRight];
    }
};

Trees.prototype._calculateLeafConnectionPosition = function (leaf, positionType) {
    if (positionType === "POSITION.RIGHT") {
        return [leaf['position'][0] + leaf['size'][0], leaf['position'][1] + (leaf['size'][1] / 2)];
    } else if (positionType === "POSITION.LEFT") {
        return [leaf['position'][0], leaf['position'][1] + (leaf['size'][1] / 2)];
    } else if (positionType === "POSITION.TOP") {
        return [leaf['position'][0] + (leaf['size'][0] / 2), leaf['position'][1]];
    } else if (positionType === "POSITION.BOTTOM") {
        return [leaf['position'][0] + (leaf['size'][0] / 2), leaf['position'][1] + leaf['size'][1]];
    }
};

Trees.prototype._connectIntersectionPoints = function (point1, point2, connectionType, positionTypes, ctx) {
    if (connectionType === "CONNECTIONTYPE.LINEAR") {
        ctx.moveTo(point1[0], point1[1]);
        ctx.lineTo(point2[0], point2[1]);
    } else if (connectionType === "CONNECTIONTYPE.STEP") {
        if (positionTypes[0] === "POSITION.TOP" && positionTypes[1] === "POSITION.BOTTOM") {
            // TODO: ADD THE ABILITY TO MAKE LEAF GO ABOVE ANOTHER AND THE CONNECTION STILL FLIXABLE AND DO NOT OVERLAB THE LEAF
            ctx.moveTo(point1[0], point1[1]);
            ctx.lineTo(point1[0], point1[1] - Math.abs(point1[1] - point2[1]) / 2);
            ctx.lineTo(point2[0], point1[1] - ((Math.abs(point2[1] - point1[1])) / 2));
            ctx.lineTo(point2[0], point2[1]);
        } else if (positionTypes[0] === "POSITION.BOTTOM" && positionTypes[1] === "POSITION.TOP") {
            // TODO: IMPLEMENT
        } else if (positionTypes[0] === "POSITION.LEFT" && positionTypes[1] === "POSITION.RIGHT") {
            // TODO: IMPLEMENT
        } else if (positionTypes[0] === "POSITION.RIGHT" && positionTypes[1] === "POSITION.LEFT") {
            // TODO: IMPLEMENT
        }
    } else if (connectionType === "CONNECTIONTYPE.CURVE") {
        ctx.moveTo(point1[0], point1[1]);
        ctx.bezierCurveTo(point1[0] + ((Math.abs(point2[0] - point1[0])) / 2), point1[1], point1[0] + ((Math.abs(point2[0] - point1[0])) / 2), point2[1], point2[0], point2[1]);
    }
};

Trees.prototype._findLeavesConnections = function (leafId) {
    var detectedConnections = Array();
    for(var conn in this.mConnections){
        var c = this.mConnections[conn]; // LEAF
        if (c['from'][0] === leafId || c['to'][0] === leafId) {
            detectedConnections.push(c['id']);
        }
    }
    return detectedConnections;
};

Trees.prototype._deleteAllConnectionInArray = function (connectionArray) {
    for (var i = 0; i < connectionArray.length; i++) {
        delete this.mConnections[connectionArray[i]];
    }
};
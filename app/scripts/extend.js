Array.prototype.for2 = function (callBack) {
    var arr = this.valueOf();
    if (arr && arr.length > 0) {
        arr.some(function (value, index) {
            var result = false;
            var thisResult = callBack(value, index);
            if (thisResult != undefined && thisResult != null && thisResult == false) {
                result = true;
            }
            return result;
        })
    }
}
"use strict";

module.exports =

(function() {
    
    function ArrayUtility () {
        this.euclideanDistance = function(arr, other) {
            if(arr.constructor !== Array) {
                throw new TypeError("arr is not an array");
            }
            if(other.constructor !== Array) {
                throw new TypeError("other is not an array");
            }
            if(arr.length != other.length) {
                throw new Error("arr.length != other.length");
            }
            for(let i = 0; i < arr.length; i++) {
                if(isNaN(arr[i])) {
                    throw new Error(`arr[${i}] is NaN`);
                }
            }
            for(let i = 0; i < other.length; i++) {
                if(isNaN(other[i])) {
                    throw new Error(`other[${i}] is NaN`);
                }
            }

            var l = arr.length;

            var sq_arr = [];
            for(let i = 0; i < l; i++) {
                sq_arr[i] = arr[i] - other[i];
            }

            var sum = 0;
            // square each item and add it to sum
            for(let i = 0; i < l; i++) {
                sum += Math.pow(sq_arr[i], 2);
            }

            return Math.sqrt(sum);
        }

        this.chooseFirstN = function(arr, n) {
            if(arr.constructor !== Array) {
                throw new TypeError("arr is not an array");
            }
            if(arr.length < n) {
                throw new Error("k cannot be larger than arr.length");
            }

            return arr.slice(0, n);
        }

        this.chooseEveryLengthDividedByN = function(arr, n) {
            if(arr.constructor !== Array) {
                throw new TypeError("arr is not an array");
            }
            if(isNaN(n)) {
                throw new TypeError("n isNaN");
            }
            if(arr.length < n) {
                throw new Error("k cannot be larger than arr.length");
            }
            var res = [];
            var numToAdd = Math.floor(arr.length / n);
            for(let i = 0; i < n; i++) {
                res[i] = arr[i * numToAdd];
            }
            return res;
        }

        this.chooseRandomN = function(arr, n) {
            if(arr.constructor !== Array) {
                throw new TypeError("arr is not an array");
            }
            if(isNaN(n)) {
                throw new TypeError("n isNaN");
            }
            if(arr.length < n) {
                throw new Error("k cannot be larger than arr.length");
            }

            var tmpIndexes = [];
            var last = arr.length;
            for(let i = 0; i < arr.length; i++) {
                tmpIndexes[i] = i;
            }
            for(let i = 0; i < n; i++) {
                var index = Math.floor(Math.random() * last--);
                
                // swap
                var tmp = tmpIndexes[last];
                tmpIndexes[last] = tmpIndexes[index];
                tmpIndexes[index] = tmp;
            }

            var chosenIndexs = tmpIndexes.slice(last, last + n);
            var result = [];
            for(let i = 0; i < n; i++) {
                result[i] = arr[chosenIndexs[i]];
            }

            return result;
        }
    }

    return ArrayUtility;

})();
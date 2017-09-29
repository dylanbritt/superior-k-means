"use strict";

module.exports =

(function() {

    function MultiDimensionalVectorUtility () {
        var self = this;
    
        this.isMultiDimensionalVector = function(multiDimensionalVector) {
            if(!multiDimensionalVector) {
                return false;
            }
            if(multiDimensionalVector.constructor !== Array) {
                return false;
            }
            if(!multiDimensionalVector[0] || multiDimensionalVector[0].constructor !== Array) {
                return false;
            }
            return true;
        }
    
        this.isEachVectorSameLength = function(multiDimensionalVector) {
            if(!self.isMultiDimensionalVector(multiDimensionalVector)) {
                return false;
            }
            if(multiDimensionalVector.length > 0) {
                var attributeLength = multiDimensionalVector[0].length;
                for(let i = 0; i < multiDimensionalVector.length; i++) {
                    if(multiDimensionalVector[i].length != attributeLength) {
                        return false;
                    }
                }
            }
            return true;
        }
    }

    return MultiDimensionalVectorUtility;
    
})();
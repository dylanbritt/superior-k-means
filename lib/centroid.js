"use strict";

const MultiDimensionalVectorUtility = require('./multi-dimensional-vector-utility');

module.exports = 

(function() {

    function Centroid() {        
        var _centerValues = [];
        var _previousCenterValues = -1;
        var _multiDimensionalVector = [[]];

        var _isMultiDimensionalVectorSet = false;
        var _multiDimensionalVectorLength = 0;
        var _attributeLength = 0;

        this.initCenterValues = function(centerValues) {
            if(!centerValues || centerValues.constructor !== Array) {
                throw new TypeError("invalid centerValues");
            }
            for(let i = 0; i < centerValues.length; i++) {
                if(isNaN(centerValues[i])) {
                    throw new TypeError("invalid centerValues");
                }
            }
            _centerValues = centerValues;
        }

        this.getCenterValues = function() {
            return _centerValues;
        }

        this.setMultiDimensionalVector = function(multiDimensionalVector) {
            var multiDimensionalVectorUtility = new MultiDimensionalVectorUtility();

            if(
                multiDimensionalVectorUtility.isEachVectorSameLength(multiDimensionalVector)
            ) {
                _multiDimensionalVector = multiDimensionalVector;
                _multiDimensionalVectorLength = _multiDimensionalVector.length;
                _attributeLength = 0;
                if(_multiDimensionalVectorLength > 0) {
                    _attributeLength = _multiDimensionalVector[0].length;
                }
                _isMultiDimensionalVectorSet = true;
            } else {
                _multiDimensionalVector = [[]];
                _isMultiDimensionalVectorSet = false;
                _multiDimensionalVectorLength = 0;
                _attributeLength = 0;
            }

            return {
                isMultiDimensionalVectorSet: _isMultiDimensionalVectorSet,
                multiDimensionalVectorLength: _multiDimensionalVectorLength,
                attributeLength: _attributeLength
            };
        }

        this.getMultiDimensionalVector = function() {
            return _multiDimensionalVector;
        }
        
        this.addVectorToMultiDimensionalVector = function(vector) {
            if(_multiDimensionalVectorLength == 0) {
                _isMultiDimensionalVectorSet = true;
                _attributeLength = vector.length;
            } else if(vector.length != _attributeLength) {
                throw new Error("vector does not match _attribute length");
            }
            _multiDimensionalVector[_multiDimensionalVectorLength++] = vector;

            return {
                isMultiDimensionalVectorSet: _isMultiDimensionalVectorSet,
                multiDimensionalVectorLength: _multiDimensionalVectorLength,
                attributeLength: _attributeLength
            };
        }

        this.clearMultiDimensionalVector = function() {
            _multiDimensionalVector = [[]];
            _isMultiDimensionalVectorSet = false;
            _multiDimensionalVectorLength = 0;
            _attributeLength = 0;

            return {
                isMultiDimensionalVectorSet: _isMultiDimensionalVectorSet,
                multiDimensionalVectorLength: _multiDimensionalVectorLength,
                attributeLength: _attributeLength
            };
        }
        
        this.calculateCenterValues = function(isFirstAttributeUniqueIdentifier) {
            if(!_isMultiDimensionalVectorSet) {
                return _centerValues;
            }
            var offset = 0;
            if (isFirstAttributeUniqueIdentifier === true) {
                offset = 1;
                if(_attributeLength < 2) {
                    throw new Error("_attributeLength must be greater than 1 when isFirstAttributeUniqueIdentifier is set to true");
                }
            }

            var multiDimensionalVectorUtility = new MultiDimensionalVectorUtility();

            if(multiDimensionalVectorUtility.isEachVectorSameLength(_multiDimensionalVector)) {
                if(_previousCenterValues == -1) {
                    _previousCenterValues = [];
                    for(let i = 0 + offset; i < _attributeLength; i++) {
                        _previousCenterValues[i - offset] = Number.MIN_SAFE_INTEGER;
                    }
                } else {
                    _previousCenterValues = _centerValues;
                }
                _centerValues = [];
                var sums = [];
                for(let i = 0 + offset; i < _attributeLength; i++) {
                    sums[i - offset] = 0;
                }
                for(let i = 0; i < _multiDimensionalVectorLength; i++) {
                    for(let j = 0 + offset; j < _attributeLength; j++) {
                        sums[j - offset] += _multiDimensionalVector[i][j];
                    }
                }
                for(let i = 0 + offset; i < _attributeLength; i++) {
                    _centerValues[i - offset] = sums[i - offset] / (_multiDimensionalVectorLength);
                }
            } else {
                throw new Error("_multiDimensionalVector is in invalid");
            }

            return _centerValues;
        }

        this.areCurrentCenterValuesEqualToPrevious = function() {
            if(_previousCenterValues == -1) {
                return false;
            }
            for(let i = 0; i < _centerValues.length; i++) {
                if(Math.floor(_centerValues[i]) != Math.floor(_previousCenterValues[i])) {
                    return false;
                }
            }
            return true;
        }
    }

    return Centroid;

})();
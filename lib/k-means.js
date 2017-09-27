"use strict";

module.exports.Superior_K_Means =

(function() {

    function ArrayUtility () {
        this.euclideanDistance = function(arr, other) {
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
    }

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

    function Centroid() {        
        var _centerValues = [];
        var _previousCenterValues = -1;
        var _multiDimensionalVector = [[]];

        var _isMultiDimensionalVectorSet = false;
        var _multiDimensionalVectorLength = 0;
        var _attributeLength = 0;

        this.initCenterValues = function(centerValues) {
            if(!centerValues || centerValues.constructor !== Array) {
                throw "invalid centerValues"
            }
            for(let i = 0; i < centerValues.length; i++) {
                if(isNaN(centerValues[i])) {
                    throw "invalid centerValues";
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
            }
        }

        this.getMultiDimensionalVector = function() {
            return _multiDimensionalVector;
        }
        
        this.addVectorToMultiDimensionalVector = function(vector) {
            if(_multiDimensionalVectorLength == 0) {
                _isMultiDimensionalVectorSet = true;
                _attributeLength = vector.length;
            } else if(vector.length != _attributeLength) {
                throw "vector does not match _attribute length";
            }
            _multiDimensionalVector[_multiDimensionalVectorLength++] = vector;

            return {
                isMultiDimensionalVectorSet: _isMultiDimensionalVectorSet,
                multiDimensionalVectorLength: _multiDimensionalVectorLength,
                attributeLength: _attributeLength
            }
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
            }
        }
        
        this.calculateCenterValues = function() {
            if(!_isMultiDimensionalVectorSet) {
                throw "_isMultiDimensionalVectorSet is false";
            }

            var multiDimensionalVectorUtility = new MultiDimensionalVectorUtility();

            if(multiDimensionalVectorUtility.isEachVectorSameLength(_multiDimensionalVector)) {
                if(_previousCenterValues == -1) {
                    _previousCenterValues = [];
                    for(let i = 0; i < _attributeLength; i++) {
                        _previousCenterValues[i] = Number.MIN_SAFE_INTEGER;
                    }
                } else {
                    _previousCenterValues = _centerValues;
                }
                _centerValues = [];
                var sums = [];
                for(let i = 0; i < _attributeLength; i++) {
                    sums[i] = 0;
                }
                for(let i = 0; i < _multiDimensionalVectorLength; i++) {
                    for(let j = 0; j < _attributeLength; j++) {
                        sums[j] += _multiDimensionalVector[i][j];
                    }
                }
                for(let i = 0; i < _attributeLength; i++) {
                    _centerValues[i] = sums[i] / _multiDimensionalVectorLength;
                }
            } else {
                throw "_multiDimensionalVector is in invalid"
            }

            return _centerValues;
        }

        this.areCurrentCenterValuesEqualToPrevious = function() {
            if(_previousCenterValues == -1) {
                return false;
            }
            for(let i = 0; i < _attributeLength; i++) {
                if(Math.floor(_centerValues[i]) != Math.floor(_previousCenterValues[i])) {
                    return false;
                }
            }
            return true;
        }
    }

    function Superior_K_Means() {
        var _areOptionsSet = false;

        var _options;
        var _centroidInitType;
        var _isCentroidInitTypeEqualToSet = false;
        var _areInitialCentroidsSet = false;
        var _initialCentroids = [];
        var _numberOfCentroids        
        var _initialCentroidsAttributeLength = 0;
        var _maxIterations;

        var _multiDimensionalVector = [[]];
        var _isMultiDimensionalVectorSet = false;
        var _multiDimensionalVectorLength = 0;
        var _multiDimensionalVectorAttributeLength = 0;

        var _centroids = [];

        this.setOptions = function(options) {
            if(!options) {
                throw "options must be defined";
            }
            if(
                (!options.centroidInitType) || 
                !(
                    options.centroidInitType != "random" && 
                    options.centroidInitType != "set" &&
                    options.centroidInitType != "grabFirstK" &&
                    options.centroidInitType != "grabEvery_Floor_NLengthDividedByK"
                )
            ) {
                options.initType = "random";
            }
            if(!options.numberOfCentroids || !isNaN(options.numberOfCentroids) || options.numberOfCentroids <= 0) {
                options.numberOfCentroids = 0;
            }
            if(!options.maxIterations || !isNaN(options.maxIterations) || options.maxIterations <= 0) {
                options.maxIterations = 0;
            }

            _centroidInitType = options.centroidInitType;
            _numberOfCentroids = options.numberOfCentroids;
            _maxIterations = options.maxIterations;

            _areOptionsSet = true;

            return _options;
        }

        this.setMultiDimensionalVector = function(multiDimensionalVector) {
            var multiDimensionalVectorUtility = new MultiDimensionalVectorUtility();

            if(multiDimensionalVectorUtility.isEachVectorSameLength(multiDimensionalVector)) {
                _multiDimensionalVector = multiDimensionalVector;
                _isMultiDimensionalVectorSet = true;
                _multiDimensionalVectorLength = multiDimensionalVector.length;
            } else {
                _multiDimensionalVector = [[]];
                _isMultiDimensionalVectorSet = false;
                _multiDimensionalVectorLength = 0;
            }
            return {
                isMultiDimensionalVectorSet: _isMultiDimensionalVectorSet,
                multiDimensionalVectorLength: _multiDimensionalVectorLength
            };
        }

        this.compute = function() {
            if(!_areOptionsSet) {
                throw "_options must be set";
            }
            if(!_isMultiDimensionalVectorSet) {
                throw "_multiDimensionalVector must be set";
            }
            if(_isCentroidInitTypeEqualToSet && !_areInitialCentroidsSet) {
                throw `_initialCentroids must be set when _centroidInitType is equal to "set"`;
            }

            // set number of centroids if not set
            if(_numberOfCentroids == 0) {
                _numberOfCentroids = Math.ceil(Math.sqrt(_multiDimensionalVectorLength));
                if(_numberOfCentroids == 0) {
                    throw "unable to set _numberOfCentroids, _numberOfCentroids cannot be 0";
                }
            }

            // set max number of interation if not set
            if(_maxIterations == 0) {
                _maxIterations = _multiDimensionalVectorLength * _numberOfCentroids;
                if(_maxIterations == 0) {
                    throw "unable to set _maxIterations, _maxIterations cannot be 0";
                }
            }

            // verify centroid count is valid
            if(_numberOfCentroids > _multiDimensionalVectorLength) {
                throw "_numberOfCentroids cannot be greater than _multiDimensionalVectorLength";
            }

            // initialize centroids
            for(let i = 0; i < _numberOfCentroids; i++) {
                _centroids[i] = new Centroid();
                _centroids[i].initCenterValues(_multiDimensionalVector[i]);
            }
            
            var arrayUtility = new ArrayUtility();
            // converge
            var iteration = 0;
            while(iteration++ < _maxIterations) {
                // clear centroid vector
                for(let i = 0; i < _numberOfCentroids; i++) {
                    _centroids[i].clearMultiDimensionalVector();
                }
                // for every datum, add to nearest centroid
                for(let d_i = 0; d_i < _multiDimensionalVectorLength; d_i++) {
                    var min = Number.MAX_SAFE_INTEGER;
                    var closestCentroid = -1;
                    for(let c_i = 0; c_i < _numberOfCentroids; c_i++) {
                        var euclideanDistanceResult = Number.MAX_SAFE_INTEGER;
                        if((euclideanDistanceResult = arrayUtility.euclideanDistance(_multiDimensionalVector[d_i], _centroids[c_i].getCenterValues())) < min) {
                            min = euclideanDistanceResult;
                            closestCentroid = c_i;
                        }
                    }
                    _centroids[closestCentroid].addVectorToMultiDimensionalVector(_multiDimensionalVector[d_i]);
                }
                for(let i = 0; i < _numberOfCentroids; i++) {
                    _centroids[i].calculateCenterValues();
                }
                var anyCentroidChanges = false;
                for(let i = 0; i < _numberOfCentroids; i++) {
                    if(!_centroids[i].areCurrentCenterValuesEqualToPrevious()) {
                        anyCentroidChanges = true;
                        break;
                    }
                }
                if(!anyCentroidChanges) {
                    break;
                }
            }
            return _centroids;
        }
    }

    exports.ArrayUtility = ArrayUtility;
    exports.MultiDimensionalVectorUtility = MultiDimensionalVectorUtility;
    exports.Centroid = Centroid;

    return Superior_K_Means;
})();
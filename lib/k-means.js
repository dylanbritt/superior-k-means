"use strict";

module.exports.SuperiorKMeans =

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

    function Centroid() {        
        var _centerValues = [];
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
    }

    function SuperiorKMeans() {
        var _wereOptionsSet = false;
        var _isInitTypeSpecifiedSet = false;

        var _options;
        var _initType;
        var _numberOfCentroids
        var _maxIterations;

        var _multiDimensionalVector = [[]];
        var _isMultiDimensionalVectorSet = false;
        var _multiDimensionalVectorLength = 0;

        var _centroids = [];
        var _previousCentroids = [];

        this.setOptions = function(options) {
            if(!options) {
                throw "options must be defined";
            }
            if(
                (!options.initType) || 
                !(options.initType != "random" && options.initType != "standardizedSort" && options.initType != "specified")
            ) {
                options.initType = "random";
            }
            if(!options.numberOfCentroids || !isNaN(options.numberOfCentroids) || options.numberOfCentroids <= 0) {
                options.numberOfCentroids = 0;
            }
            if(!options.maxIterations || !isNaN(options.maxIterations) || options.maxIterations <= 0) {
                options.maxIterations = -1;
            }

            _initType = options.initType;
            _numberOfCentroids = options.numberOfCentroids;
            _maxIterations = options.maxIterations;

            return _options;
        }

        this.setMultiDimensionalVector = function(multiDimensionalVector) {
            var multiDimensionalVectorUtility = new MultiDimensionalVectorUtility();

            if(multiDimensionalVectorUtility.isEachVectorSameLength(multiDimensionalVector)) {
                _multiDimensionalVector = multiDimensionalVector;
                _isMultiDimensionalVectorSet = true;
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
            if(!_wereOptionsSet) {
                throw "options must be set";
            }
            if(!_isMultiDimensionalVectorSet) {
                throw "vector must be set";
            }

            // set number of centroids if not set
            if(_numberOfCentroids == 0) {
                _numberOfCentroids = Math.ceil(Math.sqrt(_multiDimensionalVectorLength));
            }

            // initialize centroids
            for(let i = 0; i < _numberOfCentroids; i++) {
                _centroids[i] = new Centroid();
                _centroids[i]._centerValues()
            }
            
            // calculate new centroids

        }
    }

    exports.MultiDimensionalVectorUtility = MultiDimensionalVectorUtility;
    exports.Centroid = Centroid;

    return new SuperiorKMeans();
})();
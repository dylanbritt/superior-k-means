"use strict";

var ArrayUtility = require('./array-utility');
var MultiDimensionalVectorUtility = require('./multi-dimensional-vector-utility');
var Centroid = require('./centroid');

module.exports =

(function() {

    function Superior_K_Means() {
        var _areOptionsSet = false;

        var _options;
        var _centroidInitType;
        var _numberOfCentroids        
        var _maxIterations;
        var _isFirstAttributeUniqueIdentifier = false;
        var _offset = 0;
        
        var _isCentroidInitTypeEqualToSet = false;
        var _areInitialCentroidsSet = false;
        var _initialCentroidsAttributeLength = 0;
        var _initialCentroids = [];

        var _multiDimensionalVector = [[]];
        var _isMultiDimensionalVectorSet = false;
        var _multiDimensionalVectorLength = 0;
        var _multiDimensionalVectorAttributeLength = 0;

        var _centroids = [];

        this.setOptions = function(options) {
            if(!options) {
                throw new Error("options must be defined");
            }
            if(
                (!options.centroidInitType) || 
                !(
                    options.centroidInitType == "grabFirstK" ||
                    options.centroidInitType == "grabEveryNDividedByK" ||
                    options.centroidInitType == "random" ||
                    options.centroidInitType == "set"
                )
            ) {
                options.centroidInitType = "grabFirstK";
            }
            if(!options.numberOfCentroids || isNaN(options.numberOfCentroids) || options.numberOfCentroids <= 0) {
                options.numberOfCentroids = 0;
            }
            if(!options.maxIterations || isNaN(options.maxIterations) || options.maxIterations <= 0) {
                options.maxIterations = 0;
            }
            if(!options.isFirstAttributeUniqueIdentifier || options.isFirstAttributeUniqueIdentifier !== true) {
                options.isFirstAttributeUniqueIdentifier = false;
            }

            _centroidInitType = options.centroidInitType;
            _numberOfCentroids = options.numberOfCentroids;
            _maxIterations = options.maxIterations;
            _isFirstAttributeUniqueIdentifier = options.isFirstAttributeUniqueIdentifier;
            
            if(_centroidInitType == "set") {
                var multiDimensionalVectorUtility = new MultiDimensionalVectorUtility();
                if(multiDimensionalVectorUtility.isMultiDimensionalVector(options.initialCentroids)) {
                    _isCentroidInitTypeEqualToSet = true;
                    _initialCentroids = options.initialCentroids;
                    _numberOfCentroids = _initialCentroids.length;
                    _initialCentroidsAttributeLength = _initialCentroids[0].length;
                    _areInitialCentroidsSet = true;
                } else {
                    throw new TypeError("options.initialCentroids is not a multi-dimensional vector of degree 2");
                }
            }

            if(_isFirstAttributeUniqueIdentifier) {
                _offset = 1;
            }

            _areOptionsSet = true;

            return _options;
        }

        this.setMultiDimensionalVector = function(multiDimensionalVector) {
            var multiDimensionalVectorUtility = new MultiDimensionalVectorUtility();

            if(multiDimensionalVectorUtility.isEachVectorSameLength(multiDimensionalVector)) {
                _multiDimensionalVector = multiDimensionalVector;
                _isMultiDimensionalVectorSet = true;
                _multiDimensionalVectorLength = multiDimensionalVector.length;
                _multiDimensionalVectorAttributeLength = _multiDimensionalVector[0].length;
            } else {
                _multiDimensionalVector = [[]];
                _isMultiDimensionalVectorSet = false;
                _multiDimensionalVectorLength = 0;
                _multiDimensionalVectorAttributeLength = 0;
            }
            return {
                isMultiDimensionalVectorSet: _isMultiDimensionalVectorSet,
                multiDimensionalVectorLength: _multiDimensionalVectorLength
            };
        }

        this.compute = function() {
            if(!_areOptionsSet) {
                throw new Error("_options must be set");
            }
            if(!_isMultiDimensionalVectorSet) {
                throw new Error("_multiDimensionalVector must be set");
            }
            if(_isCentroidInitTypeEqualToSet) {
                if(!_areInitialCentroidsSet) {
                    throw new Error(`_initialCentroids must be set when _centroidInitType is equal to "set"`);
                }
                if(_initialCentroidsAttributeLength != _multiDimensionalVectorAttributeLength - _offset) {
                    throw new Error("_initialCentroidsAttributeLength != _multiDimensionalVectorAttributeLength");
                }
            }

            // set number of centroids if not set
            if(_numberOfCentroids == 0) {
                _numberOfCentroids = Math.ceil(Math.sqrt(_multiDimensionalVectorLength));
                if(_numberOfCentroids == 0) {
                    throw new Error("unable to set _numberOfCentroids, _numberOfCentroids cannot be 0");
                }
            }

            // verify centroid count is valid
            if(_numberOfCentroids > _multiDimensionalVectorLength) {
                throw new Error("_numberOfCentroids cannot be greater than _multiDimensionalVectorLength");
            }

            // set max number of interations if not set
            if(_maxIterations == 0) {
                _maxIterations = _multiDimensionalVectorLength * _numberOfCentroids;
                if(_maxIterations == 0) {
                    throw new Error("unable to set _maxIterations, _maxIterations cannot be 0");
                }
            }

            var arrayUtility = new ArrayUtility();

            // initialize centroids
            switch(_centroidInitType) {
            case "grabFirstK":
                _initialCentroids = arrayUtility.chooseFirstN(_multiDimensionalVector, _numberOfCentroids);
                break;
            case "grabEveryNDividedByK":
                _initialCentroids = arrayUtility.chooseEveryLengthDividedByN(_multiDimensionalVector, _numberOfCentroids);
                break;
            case "random": 
                _initialCentroids = arrayUtility.chooseRandomN(_multiDimensionalVector, _numberOfCentroids);
                break;
            case "set":
                // _initalCentroids already set
                break;
            default:
                throw new Error(`_centroidInitType: ${_centroidInitType} not implemented`);
            }

            var ic = _initialCentroids.slice(0);
            
            for(let i = 0; i < _numberOfCentroids; i++) {
                _centroids[i] = new Centroid();
                if(_isCentroidInitTypeEqualToSet) {
                    _centroids[i].initCenterValues(ic[i].slice(0));
                } else {
                    _centroids[i].initCenterValues(ic[i].slice(_offset));
                }
            }
            
            // converge
            var iterations = 0;
            while(iterations++ < _maxIterations) {
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
                        if((euclideanDistanceResult = arrayUtility.euclideanDistance(_multiDimensionalVector[d_i].slice(_offset), _centroids[c_i].getCenterValues())) < min) {
                            min = euclideanDistanceResult;
                            closestCentroid = c_i;
                        }
                    }
                    _centroids[closestCentroid].addVectorToMultiDimensionalVector(_multiDimensionalVector[d_i]);
                }
                for(let i = 0; i < _numberOfCentroids; i++) {
                    _centroids[i].calculateCenterValues(_isFirstAttributeUniqueIdentifier);
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
            return { 
                iteration: iterations, 
                centroids: _centroids
            };
        }
    }

    return Superior_K_Means;

})();
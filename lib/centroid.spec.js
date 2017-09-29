const assert = require('assert');
const Centroid = require('./centroid');

// var centroid = new Centroid();
// centroid.initCenterValues(centerValues);
// centroid.getCenterValues();
// centroid.setMultiDimensionalVector(multiDimensionalVector);
// centroid.addVectorToMultiDimensionalVector(vector);
// centroid.clearMultiDimensionalVector();
// centroid.calculateCenterValues();
// centroid.areCurrentCenterValuesEqualToPrevious();

describe('initCenterValues', function() {
    it('should set private _centerValues to input', function() {
        var centroid = new Centroid();
        centroid.initCenterValues([2, 3, 4]);
        var cv = centroid.getCenterValues();
        assert.equal(cv[0], 2);
        assert.equal(cv[1], 3);
        assert.equal(cv[2], 4);
    });
});

describe('getCenterValues', function() {
    it('should return private _centerValues', function() {
        var centroid = new Centroid();
        var res = centroid.setMultiDimensionalVector([[1, 2, 3], [2, 3, 4], [3, 4, 5]]);
        centroid.calculateCenterValues();
        var cv = centroid.getCenterValues();
        assert.equal(cv[0], 2);
        assert.equal(cv[1], 3);
        assert.equal(cv[2], 4);
    });
});

describe('setMultiDimensionalVector', function() {
    it('should return successful metadata result', function() {
        var centroid = new Centroid();
        var res = centroid.setMultiDimensionalVector([[1, 2, 3], [1, 2, 3]]);
        assert.equal(res.isMultiDimensionalVectorSet, true);
        assert.equal(res.multiDimensionalVectorLength, 2);
        assert.equal(res.attributeLength, 3);
    });
});

describe('addVectorToMultiDimensionalVector', function() {
    it('should return successful metadata result', function() {
        var centroid = new Centroid();
        var res = centroid.addVectorToMultiDimensionalVector([1, 2, 3]);
        assert.equal(res.isMultiDimensionalVectorSet, true);
        assert.equal(res.multiDimensionalVectorLength, 1);
        assert.equal(res.attributeLength, 3);
        res = centroid.addVectorToMultiDimensionalVector([2, 3, 4]);
        assert.equal(res.isMultiDimensionalVectorSet, true);
        assert.equal(res.multiDimensionalVectorLength, 2);
        assert.equal(res.attributeLength, 3);
    });
});

describe('clearMultiDimensionalVector', function() {
    it('should return successful metadata result and preserve _centerValues', function() {
        var centroid = new Centroid();
        centroid.addVectorToMultiDimensionalVector([1, 2, 3]);
        centroid.addVectorToMultiDimensionalVector([2, 3, 4]);
        var res = centroid.addVectorToMultiDimensionalVector([3, 4, 5]);
        assert.equal(res.isMultiDimensionalVectorSet, true);
        assert.equal(res.multiDimensionalVectorLength, 3);
        assert.equal(res.attributeLength, 3);
        var cv = centroid.calculateCenterValues();
        res = centroid.clearMultiDimensionalVector();
        assert.equal(res.isMultiDimensionalVectorSet, false);
        assert.equal(res.multiDimensionalVectorLength, 0);
        assert.equal(res.attributeLength, 0);
        assert.equal(cv[0], 2);
        assert.equal(cv[1], 3);
        assert.equal(cv[2], 4);
    });
});

describe('calculateCenterValues', function() {
    it('should return average of private multiDimensionalVector values', function() {
        var centroid = new Centroid();
        var res = centroid.setMultiDimensionalVector([[1, 2, 3], [2, 3, 4], [3, 4, 5]]);
        var cv = centroid.calculateCenterValues();
        assert.equal(cv[0], 2);
        assert.equal(cv[1], 3);
        assert.equal(cv[2], 4);
    });
});

describe('areCurrentCenterValuesEqualToPrevious', function() {
    it('should return true then false', function() {
        var centroid = new Centroid();
        centroid.setMultiDimensionalVector([[1, 2, 3], [2, 3, 4], [3, 4, 5]]);
        centroid.calculateCenterValues();
        var res = centroid.areCurrentCenterValuesEqualToPrevious();
        assert.equal(res, false);
        centroid.calculateCenterValues();
        res = centroid.areCurrentCenterValuesEqualToPrevious();
        assert.equal(res, true);
    });
});
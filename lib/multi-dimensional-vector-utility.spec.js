const assert = require('assert');
const MultiDimensionalVectorUtility = require('./multi-dimensional-vector-utility');

describe('isMultiDimensionalVector', function() {
    it('should return false with number input', function() {
        var multiDimensionalVectorUtility = new MultiDimensionalVectorUtility();
        var res = multiDimensionalVectorUtility.isMultiDimensionalVector(0);
        assert.equal(res, false);
    });

    it('should return false with string input', function() {
        var multiDimensionalVectorUtility = new MultiDimensionalVectorUtility();
        var res = multiDimensionalVectorUtility.isMultiDimensionalVector('');
        assert.equal(res, false);
    });

    it('should return false with no input', function() {
        var multiDimensionalVectorUtility = new MultiDimensionalVectorUtility();
        var res = multiDimensionalVectorUtility.isMultiDimensionalVector();
        assert.equal(res, false);
    });

    it('should return true with [] input', function() {
        var multiDimensionalVectorUtility = new MultiDimensionalVectorUtility();
        var res = multiDimensionalVectorUtility.isMultiDimensionalVector([]);
        assert.equal(res, false);
    });

    it('should return true with [[]] input', function() {
        var multiDimensionalVectorUtility = new MultiDimensionalVectorUtility();
        var res = multiDimensionalVectorUtility.isMultiDimensionalVector([[]]);
        assert.equal(res, true);
    });
});

describe('isEachVectorSameLength', function() {
    it('should return false with input [[1, 2, 3], [1]]', function() {
        var multiDimensionalVectorUtility = new MultiDimensionalVectorUtility();
        var res = multiDimensionalVectorUtility.isEachVectorSameLength([[1, 2, 3], [1]]);
        assert.equal(res, false);
    });
    
    it('should return true with input [[1, 2, 3], [1, 2, 3]]', function() {
        var multiDimensionalVectorUtility = new MultiDimensionalVectorUtility();
        var res = multiDimensionalVectorUtility.isEachVectorSameLength([[1, 2, 3], [1, 2, 3]]);
        assert.equal(res, true);
    });

    it('should return true with [[]] input', function() {
        var multiDimensionalVectorUtility = new MultiDimensionalVectorUtility();
        var res = multiDimensionalVectorUtility.isEachVectorSameLength([[]]);
        assert.equal(res, true);
    });
});
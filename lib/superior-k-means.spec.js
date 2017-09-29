const assert = require('assert');
const Superior_K_Means = require('./superior-k-means');

describe('compute', function() {
    it('should calculate correctly', function() {
        var skm = new Superior_K_Means();
        var options = { isFirstAttributeUniqueIdentifier: true };
        skm.setOptions(options);
        var data = [
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 1],
            [6, 2],
            [7, 3],
            [8, 4]
        ];
        skm.setMultiDimensionalVector(data);
        var resObj = skm.compute();
        var res = resObj.centroids;
        var centroid1 = res[0].getCenterValues();
        var centroid2 = res[1].getCenterValues();
        var centroid3 = res[2].getCenterValues();
        var vector1 = res[0].getMultiDimensionalVector();
        var vector2 = res[1].getMultiDimensionalVector();
        var vector3 = res[2].getMultiDimensionalVector();
        assert.equal(centroid1[0], 1);
        assert.equal(centroid1.length, 1);
        assert.equal(centroid2[0], 2);
        assert.equal(centroid2.length, 1);
        assert.equal(centroid3[0], 3.5);
        assert.equal(centroid3.length, 1);
    });
    
    it('should calculate correctly with centroidInitType: grabFirstK', function() {
        var skm = new Superior_K_Means();
        var options = { 
            centroidInitType: "grabFirstK",
            numberOfCentroids: 2,
            isFirstAttributeUniqueIdentifier: true
        };
        skm.setOptions(options);
        var data = [
            [1, 15],
            [2, 22], // swap to fail
            [3, 20], // swap to fail
            [4, 18] 
        ];
        skm.setMultiDimensionalVector(data);
        var resObj = skm.compute();
        var res = resObj.centroids;
        var centroid1 = res[0].getCenterValues();
        var centroid2 = res[1].getCenterValues();
        assert.equal(centroid1[0], 16.5);
        assert.equal(centroid2[0], 21);
    });
    
    it('should calculate correctly with centroidInitType: grabEveryNDividedByK', function() {
        var skm = new Superior_K_Means();
        var options = { 
            centroidInitType: "grabEveryNDividedByK",
            numberOfCentroids: 2,
            isFirstAttributeUniqueIdentifier: true
        };
        skm.setOptions(options);
        var data = [
            [1, 15],
            [3, 20], // swap to fail
            [2, 22], // swap to fail
            [4, 18] 
        ];
        skm.setMultiDimensionalVector(data);
        var resObj = skm.compute();
        var res = resObj.centroids;
        var centroid1 = res[0].getCenterValues();
        var centroid2 = res[1].getCenterValues();
        assert.equal(centroid1[0], 16.5);
        assert.equal(centroid2[0], 21);
    });

    it('should calculate correctly with centroidInitType: set', function() {
        var skm = new Superior_K_Means();
        var options = { 
            centroidInitType: "set",
            numberOfCentroids: 2,
            isFirstAttributeUniqueIdentifier: true,
            initialCentroids: [[15], [22]]
        };
        skm.setOptions(options);
        var data = [
            [1, 15],
            [2, 22], // swap to fail
            [3, 20], // swap to fail
            [4, 18] 
        ];
        skm.setMultiDimensionalVector(data);
        var resObj = skm.compute();
        var res = resObj.centroids;
        var centroid1 = res[0].getCenterValues();
        var centroid2 = res[1].getCenterValues();
        assert.equal(centroid1[0], 16.5);
        assert.equal(centroid2[0], 21);
    });
    
    it('debug test', function() {
        // var skm = new Superior_K_Means();
        // var options = { isFirstAttributeUniqueIdentifier: true };
        // skm.setOptions(options);
        // var data = [[]];
        // skm.setMultiDimensionalVector(data);
        // var resObj = skm.compute();
    });
});
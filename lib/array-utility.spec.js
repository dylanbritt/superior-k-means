const assert = require('assert');
const ArrayUtility = require('./array-utility');

// var arrayUtility = new ArrayUtility();
// arrayUtility.euclideanDistance(arr, other);
// arrayUtility.chooseFirstN(arr, n);
// arrayUtility.chooseRandomN(arr, n);

describe('euclideanDistance', function() {
    it('should calculate euclidean distance', function() {
        var arrayUtility = new ArrayUtility();
        var res = arrayUtility.euclideanDistance([1, 1], [2, 2]);
        assert.equal(res.toFixed(8), 1.4142135623730951.toFixed(8));
    });
});

describe('chooseFirstN', function() {
    it('should choose first N items', function() {
        var arrayUtility = new ArrayUtility();
        var input = [10, 20, 30, 40, 50];
        var res = arrayUtility.chooseFirstN(input, 3);
        var expected = true
        for(let i = 0; i < res.length; i++) {
            if(input[i] != res[i]) {
                expected = false;
                break;
            }
        }
        assert.equal(expected, true);
    });
});

describe('chooseEveryLengthDividedByN', function() {
    it('should choose every (length/n)th item', function() {
        var arrayUtility = new ArrayUtility();
        var input = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110];
        var res = arrayUtility.chooseEveryLengthDividedByN(input, 3);
        var expectedResult = [10, 40, 70, 100];
        var expected = true
        for(let i = 0; i < res.length; i++) {
            if(expectedResult[i] != res[i]) {
                expected = false;
                break;
            }
        }
        assert.equal(expected, true);
    });
});

describe('chooseRandomN', function() {
    it('should choose N random items', function() {
        var arrayUtility = new ArrayUtility();
        var input = [];
        for(let i = 0; i < 100; i++) {
            input[i] = 10 * i;
        }
        var res1 = arrayUtility.chooseRandomN(input, 50);
        var res2 = arrayUtility.chooseRandomN(input, 50);
        var unique = false
        for(let i = 0; i < res1.length; i++) {
            if(res1[0] != res2[1]) {
                unique = true;
                break;
            }
        }
        assert.equal(unique, true);
    });
});
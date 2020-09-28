import { Router } from "express";
var router = Router();
var request_sync = require('sync-request');

function doBreak(text) {
    // Array of pairs (int shift, float entropy), sorted in ascending order of entropy
    let entropies = getAllEntropies(text);
	entropies.sort(function(x, y) {
		// Compare by lowest entropy, break ties by lowest shift
		if (x[1] != y[1])
			return x[1] - y[1];
		else
			return x[0] - y[0];
	});
	
	// Decrypt using lowest entropy shift
	var bestShift = entropies[0][0];
	const originalText = decrypt(text, bestShift);
    const shift = bestShift.toString();
    return [originalText, shift];
}

// Returns the entropies when the given string is decrypted with all 26 possible shifts,
// where the result is an array of pairs (int shift, float enptroy) - e.g. [[0, 2.01], [1, 4.95], ..., [25, 3.73]].
function getAllEntropies(str) {
	var result = [];
	for (var i = 0; i < 26; i++)
		result.push([i, getEntropy(decrypt(str, i))]);
	return result;
}

// Unigram model frequencies for letters A, B, ..., Z
var ENGLISH_FREQS = [
	0.08167, 0.01492, 0.02782, 0.04253, 0.12702, 0.02228, 0.02015, 0.06094, 0.06966, 0.00153, 0.00772, 0.04025, 0.02406,
	0.06749, 0.07507, 0.01929, 0.00095, 0.05987, 0.06327, 0.09056, 0.02758, 0.00978, 0.02360, 0.00150, 0.01974, 0.00074,
];

// Returns the cross-entropy of the given string with respect to the English unigram frequencies, which is a positive floating-point number.
function getEntropy(str) {
	var sum = 0;
	var ignored = 0;
	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		if      (65 <= c && c <=  90) sum += Math.log(ENGLISH_FREQS[c - 65]);  // Uppercase
		else if (97 <= c && c <= 122) sum += Math.log(ENGLISH_FREQS[c - 97]);  // Lowercase
		else ignored++;
	}
	return -sum / Math.log(2) / (str.length - ignored);
}

// Decrypts the given string with the given key using the Caesar shift cipher.
// The key is an integer representing the number of letters to step back by - e.g. decrypt("EB", 2) = "CZ".
function decrypt(str, key) {
	var result = "";
	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		if      (65 <= c && c <=  90) result += String.fromCharCode(mod(c - 65 - key, 26) + 65);  // Uppercase
		else if (97 <= c && c <= 122) result += String.fromCharCode(mod(c - 97 - key, 26) + 97);  // Lowercase
		else result += str.charAt(i);  // Copy
	}
	return result;
}

function encrypt(str, key) {
	var result = "";
	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		if      (65 <= c && c <=  90) result += String.fromCharCode(mod(c - 65 + key, 26) + 65);  // Uppercase
		else if (97 <= c && c <= 122) result += String.fromCharCode(mod(c - 97 + key, 26) + 97);  // Lowercase
		else result += str.charAt(i);  // Copy
	}
	return result;
}

function mod(x, y) {
	return (x % y + y) % y;
}

function reverse(s) {
    var o = [];
    for (var i = 0, len = s.length; i <= len; i++)
     o.push(s.charAt(len - i));
     return o.join('');
  }
  
  function isPalindrome(word, words) {
    return word === reverse(word) && !words.includes(word) && word.length > 1
  }
  
  function countPalindromesInString(s) {
      let subStrings = [];
      for (let i = 0; i < s.length; i++) {
        for(let j = 0; j < s.length - i; j++) {
          let subString = s.substring(j, j + i + 1);
          if(isPalindrome(subString, subStrings)) {
            subStrings.push(subString);
          }
      }
    }
    // console.log('sub palindromes:', subStrings)
    return subStrings.length;
  }

  var longestPalindrome = function(string) {

    var length = string.length;
    var result = "";
  
    var centeredPalindrome = function(left, right) {
      while (left >= 0 && right < length && string[left] === string[right]) {
        //expand in each direction.
        left--;
        right++;
      }
      const proposedResult = string.slice(left + 1, right)
      if (proposedResult.length < 2) {
          return string.slice(0,1);
      }
      return proposedResult;
    };
  
    for (var i = 0; i < length - 1; i++) {
      var oddPal = centeredPalindrome(i, i + 1);
      var evenPal = centeredPalindrome(i, i);
      if (oddPal.length > result.length)
        result = oddPal;
      if (evenPal.length > result.length)
        result = evenPal;
    }
    return result;
  };

function asciiSum(s) {
    let sum = 0
    s = s.split('')
    for (let i = 0; i < s.length; i ++) {
        sum += s[i].charCodeAt(0);
    }
    return sum
}

router.post('/', function (req, res) {
    // console.log("body: ",req.body)
    let result = []
    for (let i = 0; i < req.body.length; i ++){
        let id = req.body[i]['id'];
        console.log("progress:", id, " / ", req.body.length)
        let encryptedText = req.body[i]['encryptedText'];
        let [originalText, _] = doBreak(encryptedText);
        const originalTextGuard = originalText
        // console.log('inputText:', encryptedText)
        // console.log('decryptedText:', originalText)
        // console.log()
        let encryptionCount = 0;
        while (originalText != encryptedText) {
            // console.log('reconstructing...')
            let palindromeCount = countPalindromesInString(originalText);
            let longestPalindromeSubStr = longestPalindrome(originalText);
            // console.log('longestPalindromeSubStr:', longestPalindromeSubStr)
            let shift = asciiSum(longestPalindromeSubStr) + palindromeCount
            // console.log('asciiSum:', asciiSum(longestPalindromeSubStr))
            // console.log('palindromeCount:', palindromeCount)
            // console.log('shift:', shift)
            originalText = encrypt(originalText, shift)
            // console.log('originalText:', originalText)
            // console.log()
            encryptionCount += 1
            if (encryptionCount > 30){
                console.log()
                console.log('early stopped');
                console.log('originalText:', encryptedText)
                console.log('decryptedText:', originalTextGuard)
                console.log('longestPalindromeSubStr:', longestPalindromeSubStr)
                console.log('asciiSum:', asciiSum(longestPalindromeSubStr))
                console.log('palindromeCount:', palindromeCount)
                console.log('shift:', shift)
                console.log()
                encryptionCount = 3
                break;
            }
        }

        // console.log()
        var respython = request_sync('POST', 'http://127.0.0.1:8080/word_segmentation', {
            json: {s: originalTextGuard},
        });
        var fullText = JSON.parse(respython.getBody('utf8'));
        
        result.push({
            id,
            encryptionCount,
            originalText:  fullText
        })
    }
    console.log('res:', JSON.stringify(result))
    res.send(result);
});

export default router;

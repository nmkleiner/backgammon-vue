'use strict'

export default {
    getRandomInt,
    makeId,
    makeLorem,
    getCurrency
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function makeId(length=3) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

function getCurrency(currencyCode) {
    switch(currencyCode){
        case 'ILS' : 
            return '₪';
        case 'EUR' : 
            return '€';
        case 'USD' :
            return '$';
        default:
            return '';
    }
}

function makeLorem(length) {

    let randStr = '';
    while (randStr.length < length) {
        const wordLength = getRandomInt(3, 6);
        let word = _createWord(wordLength);

        if (Math.random() > 0.9) word += ',';

        randStr += word + ' ';
    }
    randStr = randStr.substring(0, length);
    randStr = randStr[0].toUpperCase() + randStr.substr(1)

    return randStr;
}

function _createWord(length) {
    let word = '';
    while (word.length < length) {
        let randChar = _getRandChar();
        word += randChar;
    }

    return word;
}

function _getRandChar() {
    const LETTERS = 'abcdefghijklmnopqrstuvwxyz';
    const randIndex = parseInt(Math.random() * LETTERS.length)
    return LETTERS.charAt(randIndex);
}
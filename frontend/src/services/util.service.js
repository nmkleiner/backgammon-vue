'use strict'

export default {
    getRandomInt,
    getUniqueId,
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getUniqueId() {
    return getRandomInt(0,999999999)
}
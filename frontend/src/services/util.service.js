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
    return makeid(20)
}


function makeid(length) {
    let id = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return id;
}
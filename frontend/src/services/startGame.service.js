'use strict'
import utilService from './util.service.js'
export default {
    throwStartDice,
}

function throwStartDice(dice) {
    dice = utilService.getRandomInt(1,7)
    // dice = 4
    return dice
}
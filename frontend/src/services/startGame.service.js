'use strict'
import utilService from './util.service.js'
export default {
    setStartDice,
}


function setStartDice(dice) {
    dice = utilService.getRandomInt(1,7)
    return dice
}
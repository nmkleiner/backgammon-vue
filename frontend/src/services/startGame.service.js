'use strict'
import utilService from './util.service.js'
export default {
    throwStartDice,
    init
}
var cubeSound


function throwStartDice(dice) {
    cubeSound.play()
    dice = utilService.getRandomInt(1,7)
    // dice = 4
    return dice
}
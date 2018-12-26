'use strict'
import utilService from './util.service.js'
export default {
    createSoldiers,
    getAllSoldiers,
    getSoldierById,
    getCellBySoldierId,
    updateCells,
    updateCell,
    isPossibleMove,
    passTurn,
    checkIsEating,
    hasEatenSoldiers,
    isMiddleCell,
    calcPossibleMoves,
    throwDices,
    updateDices,
    getMiddleCell,
    isEndGame,
    isMars,
    isTurkishMars,
    nullDices,
    clearCells,
}
const whiteOutCellId = 0
const blackOutCellId = 25
const whiteEatenCellId = 26
const blackEatenCellId = 27



function createSoldiers(amount,color) {
    var res = []
    for (var i = 0; i < amount; i++) {
        res.push(createSoldier(color))
    }   
    return res
}
    
var soldierId = 0
function createSoldier(color) {
    var soldier = {
        color: color,
        id: soldierId++,
        possibleMoves: [],
        isEaten: false,
        isOut: false,
        selected: false,
        isLastInCell: false,
        hasMoved: false,
        isMoving: false
    }

    return soldier;
}

function getAllSoldiers(cells) {
    var res = []
    cells
    .map(cell => cell.soldiers)
    .forEach(soldiers => {
        soldiers.forEach(soldier => {
            res.push(soldier)
        })
    })
    return res
}

function getSoldierById(cells,soldierId) {
    var reqSoldier
    cells.find(cell => {
        reqSoldier = cell.soldiers.find((soldier) => soldier.id === soldierId)
        if (reqSoldier) return reqSoldier
    })
    return reqSoldier
}

function getCellById(cells,cellId) {
    return cells.find(cell => cell.id === cellId)
}
function getCellBySoldierId(cells,soldierId) {
    return cells.find(cell => {
        return cell.soldiers.find((soldier) => {
            return soldier.id === soldierId
        })
    })
}

function getMiddleCell(soldierColor,cells) {
    const middleCellId = (soldierColor === 'white')? whiteEatenCellId : blackEatenCellId
    return getCellById(cells,middleCellId)
}

function updateCells(cells) {
    cells.forEach(cell => {
        updateCell(cell)
    })
}

function updateCell(cell) {
    var whiteCount = 0
    var blackCount = 0
    cell.soldiers.forEach((soldier,idx) => {
        soldier.possibleMoves = []
        soldier.isLastInCell = (idx === cell.soldiers.length - 1)
        soldier.selected = false
        if (soldier.color === 'white') whiteCount++
        else if (soldier.color === 'black') blackCount++
    })
    if (whiteCount > 1) cell.isHouseOf = 'white'
    else if (blackCount > 1) cell.isHouseOf = 'black'
    else cell.isHouseOf = false

    if (cell.id === blackOutCellId || cell.id === whiteOutCellId) {
        cell.soldiers.forEach(soldier => {
            soldier.isOut = true
        })
    }
}

function isPossibleMove(targetCellId,selectedSoldier) {
    return (selectedSoldier.possibleMoves.find(move => move === targetCellId) !== undefined)? true : false
}

function passTurn(currTurn) {
    return (currTurn === 'white')? 'black' : 'white'
}

function checkIsEating(targetCell,currTurn) {
    return (targetCell.soldiers.length && targetCell.soldiers[0].color !== currTurn)? true : false
}

function hasEatenSoldiers(currTurn,soldiers) {
    soldiers = soldiers.filter(soldier => soldier.color === currTurn)
    return !!soldiers.find(soldier => soldier.isEaten)
}

function isMiddleCell(srcCell) {
    return (srcCell.id === whiteEatenCellId || srcCell.id === blackEatenCellId)? true : false
}

function throwDices(dices) {
    dices.num1 = utilService.getRandomInt(1,7)
    dices.num2 = utilService.getRandomInt(1,7)
    // dices.num1 = 1
    // dices.num2 = 5
    // doubles!!!
    // dices.num2 = dices.num1
    if (dices.num1 > dices.num2) {
        const swapper = dices.num1
        dices.num1 = dices.num2
        dices.num2 = swapper
    }
    dices.num1ToShow = dices.num1
    dices.num2ToShow = dices.num2

    if (dices.num1 === dices.num2) {
        dices.doubleCount = 4
        dices.num2 = null
    } else {
        dices.doubleCount = 0
    }
    return dices
}

function updateDices(dices,srcCell,targetCell) {
    var srcCellId = srcCell.id
    if (srcCellId === whiteEatenCellId) srcCellId = whiteOutCellId
    else if (srcCellId === blackEatenCellId) srcCellId = blackOutCellId
    const dist = Math.abs(srcCellId - targetCell.id)
    
    if (!dices.doubleCount) {
        if (dist <= dices.num1) dices.num1 = null
        else if (dist <= dices.num2) dices.num2 = null
        else {
            dices.num1 = null 
            dices.num2 = null 
        }
    } else {
        var stepCount = Math.floor(dist/dices.num1)
        if (dist % dices.num1 !== 0) stepCount++
        dices.doubleCount -= stepCount
        if (!dices.doubleCount) dices.num1 = null
    }
    return dices
}

function nullDices(dices) {
    dices.num1 = null
    dices.num2 = null
    dices.doubleCount = null
    return dices
}

function calcPossibleMoves(dices,currTurn,cells,soldiers) {
    soldiers = getPossibleSoldiers(cells,soldiers,currTurn)    
    // console.log('soldiers',soldiers)
    var direction = (currTurn === 'white')? 1 : -1

    var possibleMoves = []
    soldiers.forEach(soldier => {
        const srcCell = getCellBySoldierId(cells,soldier.id)
        var moves = calcSoldierMoves(dices,srcCell,direction)
        // console.log(1,moves)
        moves = removeSrcCellMoves(srcCell,moves)
        // console.log(2,moves)
        moves = removeHousesMoves(cells,moves,currTurn)
        // console.log(3,moves)
        moves = removeBasedOnHousesMoves(dices,moves)
        // console.log(4,moves)
        moves = removeBasedOnOutsideMoves(moves)
        // console.log(5,moves)
        if (!canExit(cells,currTurn)) {
            moves = removeExitMoves(moves,currTurn)
            // console.log(6,moves)
        }
        soldier.possibleMoves = moves
        possibleMoves.push({soldierId: soldier.id, moves})
    })
    if (!hasPossibleMoves(possibleMoves)) {
        possibleMoves = []
    }
    return possibleMoves
}


function getPossibleSoldiers(cells,soldiers,currTurn) {
    if (!hasEatenSoldiers(currTurn,soldiers)) {
        return soldiers.filter(soldier => soldier.color === currTurn && soldier.isLastInCell)
    } else {
        return (currTurn === 'white')? 
        [getCellById(cells,26).soldiers[getCellById(cells,whiteEatenCellId).soldiers.length -1]] :
        [getCellById(cells,blackEatenCellId).soldiers[getCellById(cells,blackEatenCellId).soldiers.length -1]]
    }
}

function calcSoldierMoves(dices,srcCell,direction) {
    var moves = []
    var srcCellId = srcCell.id
    var isGettingOut = true
    if (srcCellId === whiteEatenCellId) srcCellId = whiteOutCellId
    else if (srcCellId === blackEatenCellId) srcCellId = blackOutCellId
    else isGettingOut = false
    if (!dices.doubleCount) {
        if (!dices.num1 && !dices.num2) {
            moves = []
        }else if (!isGettingOut) {
            moves = [
                srcCellId + direction*dices.num1,
                srcCellId + direction*dices.num2,
                srcCellId + direction*(dices.num1 + dices.num2)
            ]
        } else {
            moves = [
                srcCellId + direction*dices.num1,
                srcCellId + direction*dices.num2,
                null
            ]
        }
    } else {
        for (var i = 1; i <= dices.doubleCount; i++) {
            moves.push(srcCellId + direction*dices.num1 * i)
        }
    }
    return moves
}
// when dice is null soldiers get their srcCell as possibleMove
function removeSrcCellMoves(srcCell,moves) {
    var srcCellId = srcCell.id
    if (srcCell.id === blackEatenCellId) srcCellId = blackOutCellId
    else if (srcCell.id === whiteEatenCellId) srcCellId = whiteOutCellId
    return moves.map(move => (move === srcCellId)? null : move)
}
// remove moves that step on enemy's houses
function removeHousesMoves(cells,moves,currTurn) {
    cells = moves.map(move => getCellById(cells,move))
    cells.forEach((cell,idx) => {
        if (cell && currTurn === 'white' && cell.isHouseOf === 'black' ||
            cell && currTurn === 'black' && cell.isHouseOf === 'white') {
                moves[idx] = null
        }
    })
    return moves
}
// remove steps that are based on sum of both dices, when both moves are
// stepping on enemy's houses 
function removeBasedOnHousesMoves(dices,moves){
    if (!dices.doubleCount) {
        if (moves[0] === null && moves[1] === null) moves[2] = null
        return moves
    } else {
        const idx = moves.findIndex(move => move === null)
        if (idx !== -1) {
            moves = moves.map((move,i) => (i > idx)? null : move)
        }
        return moves
    }
}
// remove unneeded moves outside of board
function removeBasedOnOutsideMoves(moves) {
    moves = moves.map(move => {
        if (move > blackOutCellId) return blackOutCellId
        if (move < whiteOutCellId) return whiteOutCellId
        return move
    })
    const idx = moves.findIndex(move => move === blackOutCellId || move === whiteOutCellId)
    
    if (idx !== -1) {
        moves = moves.map((move,i) => (i > idx)? null : move)
    }
    return moves
}
// remove all moves outside of board when exiting is not allowed
function removeExitMoves(moves,currTurn) {
    if (currTurn === 'white') {
        return moves.map(move => (move >= blackOutCellId || move === whiteOutCellId)? null : move)
    } else {
        return moves.map(move => (move === whiteOutCellId || move >= blackOutCellId)? null : move)
    }
}

function hasPossibleMoves(possibleMoves) {
    return possibleMoves.find(soldier => {
        if (soldier.moves.length) {
            return (soldier.moves.find(move => move !== null) !== undefined)? true : false
        } 
        return false
    })
}

function canExit(cells,currTurn){
    cells = (currTurn === 'white')? cells.slice(19,26) : cells.slice(0,7)
    var count = 0
    cells.forEach(cell => {
        cell.soldiers.forEach(soldier => {
            if (soldier.color === currTurn) count++
        })
    })
    return (count === 15)? true : false
}

function isEndGame(cells,currTurn) {
    var count = (currTurn === 'white')? cells[blackOutCellId].soldiers.length : cells[whiteOutCellId].soldiers.length
    return (count === 15)? true : false
}

function isMars(cells,currTurn) {
    return (currTurn === 'white')? 
    (!cells[whiteOutCellId].soldiers.length) :
    (!cells[blackOutCellId].soldiers.length)  
}

function isTurkishMars(cells,currTurn) {
    let count = 0
    cells = (currTurn === 'white')? cells.slice(0,7): cells.slice(19,26)
    cells.forEach(cell => count += cell.soldiers.length) 
    return count < 15
}

function clearCells(cells) {
    cells.forEach(cell => {
        cell.soldiers = []
    })
    return cells
}
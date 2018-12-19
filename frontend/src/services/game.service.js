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
    toggleTurn,
    checkIsEating,
    hasEatenSoldiers,
    isMiddleCell,
    calcPossibleMoves,
    throwDices,
    updateDices,
    getMiddleCell,
    isEndGame,
    nullDices
}

function createSoldiers(amount,color) {
    var res = []
    for (var i = 0; i < amount; i++) {
        res.push(createSoldier(color))
    }   
    return res
}

function createSoldier(color) {
    var soldier = {
        color: color,
        id: utilService.makeId(),
        possibleMoves: [],
        isEaten: false,
        isOut: false,
        selected: false,
        isLastInCell: false
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
        return cell.soldiers.find((soldier) => soldier.id === soldierId)
    })
}

function getMiddleCell(soldierColor,cells) {
    const middleCellId = (soldierColor === 'white')? 26 : 27
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

        if (soldier.color === 'white') whiteCount++
        else if (soldier.color === 'black') blackCount++
    })
    if (whiteCount > 1) cell.isHouseOf = 'white'
    else if (blackCount > 1) cell.isHouseOf = 'black'
    else cell.isHouseOf = false

    // remove after qa of eating soldiers
    if (cell.id === 26 || cell.id === 27) {
        cell.soldiers.forEach(soldier => {
            soldier.isEaten = true
        })
    }
}

function isPossibleMove(targetCellId,selectedSoldier) {
    return (selectedSoldier.possibleMoves.find(move => move === targetCellId) !== undefined)? true : false
}

function toggleTurn(currTurn) {
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
    return (srcCell.id === 26 || srcCell.id === 27)? true : false
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
}


function updateDices(dices,srcCell,targetCell) {
    var srcCellId = srcCell.id
    if (srcCellId === 26) srcCellId = 0
    else if (srcCellId === 27) srcCellId = 25
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
    var direction = (currTurn === 'white')? 1 : -1

    var possibleMoves = []
    soldiers.forEach(soldier => {
        const srcCell = getCellBySoldierId(cells,soldier.id)
        var moves = calcSoldierMoves(dices,srcCell,direction)
        console.log('moves1',moves)
        moves = removeSrcCellMoves(srcCell,moves)
        console.log('moves2',moves)
        moves = removeHousesMoves(cells,moves,currTurn)
        console.log('moves3',moves)
        moves = removeBasedOnHousesMoves(dices,moves)
        console.log('moves4',moves)
        moves = removeBasedOnOutsideMoves(moves)
        console.log('moves5',moves)
        if (!canExit(cells,currTurn)) {
            moves = removeExitMoves(moves,currTurn)
            console.log('moves6',moves)
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
        [getCellById(cells,26).soldiers[getCellById(cells,26).soldiers.length -1]] :
        [getCellById(cells,27).soldiers[getCellById(cells,27).soldiers.length -1]]
    }
}
function calcSoldierMoves(dices,srcCell,direction) {
    var moves = []
    var srcCellId = srcCell.id
    var isGettingOut = true
    if (srcCellId === 26) srcCellId = 0
    else if (srcCellId === 27) srcCellId = 25
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
function removeSrcCellMoves(srcCell,moves) {
    var srcCellId = srcCell.id
    if (srcCell.id === 27) srcCellId = 25
    else if (srcCell.id === 26) srcCellId = 0
    return moves.map(move => (move === srcCellId)? null : move)
}
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
function removeBasedOnOutsideMoves(moves) {
    moves = moves.map(move => {
        if (move > 25) return 25 
        if (move < 0) return 0
        return move
    })
    const idx = moves.findIndex(move => move === 25 || move === 0)
    
    if (idx !== -1) {
        moves = moves.map((move,i) => (i > idx)? null : move)
    }
    return moves
}
function removeExitMoves(moves,currTurn) {
    if (currTurn === 'white') {
        return moves.map(move => (move >= 25 || move === 0)? null : move)
    } else {
        return moves.map(move => (move === 0 || move >= 25)? null : move)
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
    var count = (currTurn === 'white')? cells[25].soldiers.length : cells[0].soldiers.length
    return (count === 15)? true : false
}
import gameService from '@/services/game.service.js'
import utilService from '@/services/util.service.js'

export default ({
    state: {
        cells: [],
        soldiers: [],
        selectedSoldier: null,
        currTurn: 'white',
        dices: {num1: 6, num2: 6, num1ToShow: 6, num2ToShow: 6, doubleCount: 0},
        possibleMoves: [],
        winner: false,
        duringTurn: false
    },
    mutations: {
        throwDices(state) {
            state.duringTurn = true
            gameService.throwDices(state.dices)
            state.possibleMoves = gameService.calcPossibleMoves(state.dices,state.currTurn,state.cells,state.soldiers)
            if (!state.possibleMoves.length) {
                setTimeout(() => {
                    state.duringTurn = false
                    state.dices = gameService.nullDices(state.dices)
                    state.currTurn = gameService.toggleTurn(state.currTurn)
                },2000)
            }
        },
        unselectSoldiers(state){
            state.soldiers.forEach(soldier => soldier.selected = false)
            state.selectedSoldier = null
        },
        selectSoldier(state,{soldierId}){
            const soldier = gameService.getSoldierById(state.cells,soldierId)
            if (soldier.color !== state.currTurn ||
                 !soldier.isLastInCell ||
                 gameService.hasEatenSoldiers(state.currTurn,state.soldiers) && !soldier.isEaten) return;

            soldier.selected = true
            state.selectedSoldier = soldier
        },
        moveSoldier(state, {targetCell}){
            const isPossibleMove = gameService.isPossibleMove(targetCell.id,state.selectedSoldier) 
            if (!isPossibleMove) return
            const srcCell = gameService.getCellBySoldierId(state.cells,state.selectedSoldier.id)

            const isMiddleCell = gameService.isMiddleCell(srcCell)
            if (isMiddleCell) {
                state.selectedSoldier.isEaten = false
            }

            const IsEating = gameService.checkIsEating(targetCell,state.currTurn) 
            if (IsEating) {
                const eatenSoldier = targetCell.soldiers.pop()
                eatenSoldier.isEaten = true
                const middleCell = gameService.getMiddleCell(eatenSoldier.color,state.cells)
                middleCell.soldiers.push(eatenSoldier)
                gameService.updateCell(middleCell)
            }
            
            srcCell.soldiers.pop()
            targetCell.soldiers.push(state.selectedSoldier) 
            gameService.updateCells([srcCell,targetCell])

            state.dices = gameService.updateDices(state.dices,srcCell,targetCell)
            state.possibleMoves = gameService.calcPossibleMoves(state.dices,state.currTurn,state.cells,state.soldiers)
            // end game
            state.winner = (gameService.isEndGame(state.cells,state.currTurn))? state.currTurn : false
            if (state.winner) return
            // end turn
            if (!state.possibleMoves.length) {
                state.duringTurn = false
                state.dices = gameService.nullDices(state.dices)
                state.currTurn = gameService.toggleTurn(state.currTurn)
            }
            
        },
        setCells(state){
            for (var i = 0; i <= 27; i++){
                state.cells.push({id: i, soldiers: [], isHouseOf: false, isPossibleMove: false}) 
            }
        },
        setSoldiers(state) {
            // regular
            var boardMap = {
                '1': {amount: 2, color: 'white'},
                '6': {amount: 5, color: 'black'},
                '8': {amount: 3, color: 'black'},
                '12': {amount: 5, color: 'white'},
                '13': {amount: 5, color: 'black'},
                '17': {amount: 3, color: 'white'},
                '19': {amount: 5, color: 'white'},
                '24': {amount: 2, color: 'black'}
            }
            // exiting
            // var boardMap = {
            //     '22': {amount: 3, color: 'white'},
            //     '24': {amount: 2, color: 'white'},
            //     '23': {amount: 1, color: 'white'},
            //     '20': {amount: 1, color: 'white'},
            //     '19': {amount: 1, color: 'white'},
            //     '4': {amount: 5, color: 'black'},
            //     '2': {amount: 3, color: 'black'},
            //     '3': {amount: 5, color: 'black'},
            //     '1': {amount: 2, color: 'black'}
            // }
            // endgame
            // var boardMap = {
            //     '24': {amount: 1, color: 'white'},
            //     '4': {amount: 5, color: 'black'},
            //     '2': {amount: 3, color: 'black'},
            //     '25': {amount: 14, color: 'white'},
            //     '3': {amount: 5, color: 'black'},
            //     '1': {amount: 2, color: 'black'}
            // }
            for (var cell in boardMap){
                state.cells[cell].soldiers.push(...gameService.createSoldiers(boardMap[cell].amount,boardMap[cell].color))
            }
            state.soldiers = gameService.getAllSoldiers(state.cells)
            gameService.updateCells(state.cells)
        },
        showPossibleMoves(state,{possibleMoves}) {
            if (!state.selectedSoldier) {
                state.cells.filter(cell => possibleMoves.includes(cell.id))
                .forEach(cell => cell.isPossibleMove = true);
            }
          },
          showNoPossibleMoves(state) {
            state.cells.forEach(cell => cell.isPossibleMove = false);
          }
          
    },
    getters: {
        cells: state => state.cells,
        selectedSoldier: state => state.selectedSoldier,
        soldiers: state => state.soldiers,
        whiteSoldiers: state => state.soldiers.filter(soldier => soldier.color === 'white'),
        blackSoldiers: state => state.soldiers.filter(soldier => soldier.color === 'black'),
        dices: state => state.dices,
        winner: state => state.winner,
        currTurn: state => state.currTurn,
        duringTurn: state => state.duringTurn,

    }
  })
  


import gameService from '@/services/game.service.js'
import userService from '@/services/user.service.js'

export default ({
    state: {
        cells: [],
        soldiers: [],
        selectedSoldier: null,
        currTurn: 'white',
        dices: {num1: 6, num2: 6, num1ToShow: 6, num2ToShow: 6, doubleCount: 0},
        possibleMoves: [],
        winner: false,
        duringTurn: false,
        loggedInUser: {},

    },
    mutations: {
        setLoggedInUser(state, { user }) {
            state.loggedInUser = user;
        },
        throwDices(state) {
            state.duringTurn = true
            gameService.throwDices(state.dices)
            const soldiers = gameService.getAllSoldiers(state.cells)
            state.possibleMoves = gameService.calcPossibleMoves(state.dices,state.currTurn,state.cells,soldiers)

            if (!state.possibleMoves.length) {
                setTimeout(() => {
                    state.duringTurn = false
                    state.dices = gameService.nullDices(state.dices)
                    state.currTurn = gameService.toggleTurn(state.currTurn)
                },2000)
            }
        },
        unselectSoldiers(state){
            const soldiers = gameService.getAllSoldiers(state.cells)
            soldiers.forEach(soldier => soldier.selected = false)
            state.selectedSoldier = null
        },
        selectSoldier(state,{soldierId}){
            const soldier = gameService.getSoldierById(state.cells,soldierId)
            const soldiers = gameService.getAllSoldiers(state.cells)
            if (soldier.color !== state.currTurn ||
                 !soldier.isLastInCell ||
                 gameService.hasEatenSoldiers(state.currTurn,soldiers) && !soldier.isEaten) return;

            soldier.selected = true
            state.selectedSoldier = soldier
        },
        setCells(state){
            for (var i = 0; i <= 27; i++){
                state.cells.push({id: i, soldiers: [], isHouseOf: false, isPossibleMove: false}) 
            }
        },
        setSoldiers(state) {
            // regular board
            const boardMap = {
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
            // var boardMap = {'22': {amount: 3, color: 'white'},'24': {amount: 2, color: 'white'},'23': {amount: 1, color: 'white'},'20': {amount: 1, color: 'white'},'19': {amount: 1, color: 'white'},'4': {amount: 5, color: 'black'},'2': {amount: 3, color: 'black'},'3': {amount: 5, color: 'black'},'1': {amount: 2, color: 'black'}}
            // endgame
            // var boardMap = {'24': {amount: 1, color: 'white'},'4': {amount: 5, color: 'black'},'2': {amount: 3, color: 'black'},'25': {amount: 14, color: 'white'},'3': {amount: 5, color: 'black'},'1': {amount: 2, color: 'black'}}
            // eaten soldiers
            // var boardMap = {'26': {amount: 2, color: 'white'},'4': {amount: 5, color: 'black'},'2': {amount: 3, color: 'black'},'25': {amount: 14, color: 'white'},'3': {amount: 5, color: 'black'},'1': {amount: 2, color: 'black'}}
            
            for (var cell in boardMap){
                state.cells[cell].soldiers.push(...gameService.createSoldiers(boardMap[cell].amount,boardMap[cell].color))
            }
            gameService.updateCells(state.cells)
        },
        showPossibleMoves(state,{possibleMoves, soldier}) {
            if (!state.selectedSoldier && soldier.color === state.currTurn) {
                state.cells.filter(cell => possibleMoves.includes(cell.id))
                .forEach(cell => cell.isPossibleMove = true);
            }
          },
          showNoPossibleMoves(state) {
            state.cells.forEach(cell => cell.isPossibleMove = false);
          },
          selectedSoldierNotEaten(state) {
            state.selectedSoldier.isEaten = false
          },
          updateDices(state,{srcCell,targetCell}) {
            state.dices = gameService.updateDices(state.dices,srcCell,targetCell)
          },
          calcPossibleMoves(state) {
            const soldiers = gameService.getAllSoldiers(state.cells)
            state.possibleMoves = gameService.calcPossibleMoves(state.dices,state.currTurn,state.cells,soldiers)
          },
          checkWinner(state) {
            state.winner = (gameService.isEndGame(state.cells,state.currTurn))? state.currTurn : false
          },
          endTurn(state) {
            state.duringTurn = false
            state.dices = gameService.nullDices(state.dices)
            state.currTurn = gameService.passTurn(state.currTurn)
          },
          clearBoard(state) {
              state.cells = gameService.clearCells(state.cells)
            },
          setNewSoldiers(state,{cells}) {
                state.cells = cells
          },
          updateCells(state) {
            gameService.updateCells(state.cells)
          }
          
    },
    actions: {
        getLoggedInUser({ commit }) {
            userService.getLoggedInUser().then(loggedInUser => {
            commit({ type: 'setLoggedInUser', user: loggedInUser })
        })
        },
        login({ commit }, { loginData }) {
            return userService.login(loginData).then(user => {
            if (user) {
                commit({ type: 'setLoggedInUser', user })
            }
            return user
        })
        },
        setBoard({commit},{cells}) {
            if (!cells) {
                commit('setCells')
                commit({type: 'setSoldiers'})
            }
            else {
                commit('clearBoard')
                commit({type: 'setNewSoldiers', cells})
                commit('updateCells')
                commit('calcPossibleMoves')
            }
        },
        moveSoldier({state,commit}, {targetCell}){
            const isPossibleMove = gameService.isPossibleMove(targetCell.id,state.selectedSoldier) 
            if (!isPossibleMove) return
            const srcCell = gameService.getCellBySoldierId(state.cells,state.selectedSoldier.id)

            const isMiddleCell = gameService.isMiddleCell(srcCell)
            if (isMiddleCell) {
                commit('selectedSoldierNotEaten')
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
            
            commit({type: 'updateDices', srcCell, targetCell})            
            commit('calcPossibleMoves')

            commit('checkWinner')
            if (state.winner) return

            if (!state.possibleMoves.length) {
                commit('endTurn')
            }
            
        },
    },
    getters: {
        cells: state => state.cells,
        dices: state => state.dices,
        winner: state => state.winner,
        currTurn: state => state.currTurn,
        duringTurn: state => state.duringTurn,
        loggedInUser: state => state.loggedInUser,
        isLoggedInUser: state => !!state.loggedInUser,
        selectedSoldier: state => state.selectedSoldier,
    }
  })
  


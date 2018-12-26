import gameService from '@/services/game.service.js'
import userService from '@/services/user.service.js'

export default ({
    state: {
        cells: [],
        soldiers: [],
        selectedSoldier: null,
        currTurn: null,
        dices: { num1: 6, num2: 6, num1ToShow: 6, num2ToShow: 6, doubleCount: 0, rolling: false },
        possibleMoves: [],
        winner: false,
        duringTurn: false,
        loggedInUser: {},
        isMars: false,
        isTurkishMars: false
    },
    mutations: {
        setLoggedInUser(state, { user }) {
            state.loggedInUser = {
                name: user.name,
                _id: user._id,
                pic: user.pic,
                color: 'white'
            }
        },
        logOutUser(state) {
            state.loggedInUser = '';
        },
        changeMyColor(state) {
            state.loggedInUser.color = 'black'
        },
        unselectSoldiers(state) {
            const soldiers = gameService.getAllSoldiers(state.cells)
            soldiers.forEach(soldier => soldier.selected = false)
            state.selectedSoldier = null
        },
        selectSoldier(state, { soldierId }) {
            const soldier = gameService.getSoldierById(state.cells, soldierId)
            const soldiers = gameService.getAllSoldiers(state.cells)
            if (soldier.color !== state.currTurn ||
                !soldier.isLastInCell ||
                gameService.hasEatenSoldiers(state.currTurn, soldiers) && !soldier.isEaten) return;

            soldier.selected = true
            state.selectedSoldier = soldier
        },
        setCells(state) {
            for (var i = 0; i <= 27; i++) {
                state.cells.push({ id: i, soldiers: [], isHouseOf: false, isPossibleMove: false })
            }
        },
        setSoldiers(state) {
            // regular board
            const boardMap = {
                '1': { amount: 2, color: 'white' },
                '6': { amount: 5, color: 'black' },
                '8': { amount: 3, color: 'black' },
                '12': { amount: 5, color: 'white' },
                '13': { amount: 5, color: 'black' },
                '17': { amount: 3, color: 'white' },
                '19': { amount: 5, color: 'white' },
                '24': { amount: 2, color: 'black' }
            }
            // exiting
            // var boardMap = {'22': {amount: 3, color: 'white'},'24': {amount: 2, color: 'white'},'23': {amount: 1, color: 'white'},'20': {amount: 1, color: 'white'},'19': {amount: 1, color: 'white'},'4': {amount: 5, color: 'black'},'2': {amount: 3, color: 'black'},'3': {amount: 5, color: 'black'},'1': {amount: 2, color: 'black'}}
            // endgame 
            // var boardMap = {'24': {amount: 1, color: 'white'},'4': {amount: 5, color: 'black'},'2': {amount: 3, color: 'black'},'25': {amount: 14, color: 'white'},'3': {amount: 5, color: 'black'},'1': {amount: 2, color: 'black'}}
            // endgame with mars
            // var boardMap = {'24': {amount: 1, color: 'white'},'6': {amount: 5, color: 'black'},'2': {amount: 3, color: 'black'},'25': {amount: 14, color: 'white'},'3': {amount: 5, color: 'black'},'1': {amount: 2, color: 'black'}}
            // eaten soldiers
            // var boardMap = {'26': {amount: 2, color: 'white'},'4': {amount: 5, color: 'black'},'2': {amount: 3, color: 'black'},'25': {amount: 14, color: 'white'},'3': {amount: 5, color: 'black'},'1': {amount: 2, color: 'black'}}

            for (var cell in boardMap) {
                state.cells[cell].soldiers.push(...gameService.createSoldiers(boardMap[cell].amount, boardMap[cell].color))
            }
            gameService.updateCells(state.cells)
        },
        showPossibleMoves(state, { possibleMoves, soldier }) {
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
        updateDices(state, { srcCell, targetCell }) {
            state.dices = gameService.updateDices(state.dices, srcCell, targetCell)
        },
        calcPossibleMoves(state) {
            const soldiers = gameService.getAllSoldiers(state.cells)
            state.possibleMoves = gameService.calcPossibleMoves(state.dices, state.currTurn, state.cells, soldiers)
        },
        checkWinner(state) {
            state.winner = (gameService.isEndGame(state.cells, state.currTurn)) ? state.currTurn : false
        },
        checkMars(state) {
            state.isMars = gameService.isMars(state.cells, state.currTurn)
        },
        setMars(state) {
            state.isMars = true
        },
        checkTurkishMars(state) {
            state.isTurkishMars = gameService.isTurkishMars(state.cells, state.currTurn)
        },
        setTurkishMars(state) {
            state.isTurkishMars = true
        },
        startTurn(state) {
            state.duringTurn = true
        },
        endTurn(state) {
            state.duringTurn = false
            state.dices = gameService.nullDices(state.dices)
            state.currTurn = gameService.passTurn(state.currTurn)
        },
        endGame(state, { winner }) {
            state.winner = winner
        },
        clearBoard(state) {
            state.cells = gameService.clearCells(state.cells)
        },
        setNewSoldiers(state, { cells }) {
            state.cells = cells
        },
        updateCells(state) {
            gameService.updateCells(state.cells)
        },
        rollDices(state) {
            state.dices.rolling = true
        },
        unrollDices(state) {
            state.dices.rolling = false
        },
        throwDices(state) {
            state.dices = gameService.throwDices(state.dices)
        },
        dicesRes(state, { dices }) {
            state.dices.num1ToShow = dices.num1ToShow
            state.dices.num2ToShow = dices.num2ToShow
        },
        setCurrTurn(state, {startingColor}) {
            state.currTurn = startingColor
        }
    },
    actions: {
        async throwDices({ commit, state }) {
            commit('startTurn')
            commit('throwDices')
            commit('calcPossibleMoves')

            await setTimeout(() => {
                commit('unrollDices')
            }, 1000)

            if (!state.possibleMoves.length) {
                await setTimeout(() => {
                    commit('endTurn')
                }, 2000)
            }
            return state.dices
        },
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
        logout({ commit }) {
            userService.logout();
            commit('logOutUser');
            return Promise.resolve();
        },
        setBoard({ commit }, { cells }) {
            if (!cells) {
                commit('setCells')
                commit({ type: 'setSoldiers' })
            }
            else {
                commit('clearBoard')
                commit({ type: 'setNewSoldiers', cells })
                commit('updateCells')
                commit('calcPossibleMoves')
            }
        },
        async moveSoldier({ state, commit }, { targetCell }) {
            const isPossibleMove = gameService.isPossibleMove(targetCell.id, state.selectedSoldier)
            if (!isPossibleMove) return false
            const srcCell = gameService.getCellBySoldierId(state.cells, state.selectedSoldier.id)

            const isMiddleCell = gameService.isMiddleCell(srcCell)
            if (isMiddleCell) {
                commit('selectedSoldierNotEaten')
            }

            const IsEating = gameService.checkIsEating(targetCell, state.currTurn)
            if (IsEating) {
                const eatenSoldier = targetCell.soldiers.pop()
                eatenSoldier.isEaten = true
                const middleCell = gameService.getMiddleCell(eatenSoldier.color, state.cells)
                middleCell.soldiers.push(eatenSoldier)
                gameService.updateCell(middleCell)
            }
            state.selectedSoldier.isMoving = true

            let promise = new Promise(res => {
             setTimeout(() => {
                srcCell.soldiers.pop()
                state.selectedSoldier.isMoving = false
                targetCell.soldiers.push(state.selectedSoldier)
                state.selectedSoldier.hasMoved = true
                
                commit({ type: 'updateDices', srcCell, targetCell })
                commit('calcPossibleMoves')
                
                commit('checkWinner')
                if (state.winner) {
                    commit('checkMars')
                    if (state.isMars) {
                        commit('checkTurkishMars')
                    }
                    return Promise.resolve(true)
                }

                if (!state.possibleMoves.length) {
                    commit('endTurn')
                }
                res(true)
            },300)
        })
        await promise
        return Promise.resolve(promise)
        },
    },
    getters: {
        cells: state => state.cells,
        dices: state => state.dices,
        isMars: state => state.isMars,
        winner: state => state.winner,
        currTurn: state => state.currTurn,
        duringTurn: state => state.duringTurn,
        loggedInUser: state => state.loggedInUser,
        dicesRolling: state => state.dices.rolling,
        isTurkishMars: state => state.isTurkishMars,
        isLoggedInUser: state => !!state.loggedInUser,
        selectedSoldier: state => state.selectedSoldier,
        loggedInUserColor: state => state.loggedInUser.color,
    }
})



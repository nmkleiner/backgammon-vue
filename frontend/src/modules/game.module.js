import gameService from '@/services/game.service.js'
import userService from '@/services/user.service.js'
import soundService from '@/services/sound.service.js'

export default ({
    state: {
        cells: [],
        selectedSoldier: null,
        currTurn: null,
        dices: { num1: 6, num2: 6, num1ToShow: 6, num2ToShow: 6, doubleCount: 0, rolling: false },
        possibleMoves: [],
        winner: false,//true/false
        duringTurn: false,
        loggedInUser: { userName: '', _id: '', pic: '', color: 'white' },
        isMars: false,
        isTurkishMars: false,
        score: { white: 0, black: 0 },
        noPossibleMoves: false
    },
    mutations: {
        setLoggedInUser(state, { user }) {
            state.loggedInUser.userName = user.userName
            state.loggedInUser._id = user._id
            state.loggedInUser.pic = user.pic
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
            let boardMap = {
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
            // boardMap = {'22': {amount: 7, color: 'white'},'24': {amount: 5, color: 'white'},'23': {amount: 1, color: 'white'},'20': {amount: 1, color: 'white'},'19': {amount: 1, color: 'white'},'4': {amount: 5, color: 'black'},'2': {amount: 3, color: 'black'},'3': {amount: 5, color: 'black'},'1': {amount: 2, color: 'black'}}
            // endgame 
            // boardMap = {'24': {amount: 1, color: 'white'},'4': {amount: 5, color: 'black'},'2': {amount: 3, color: 'black'},'25': {amount: 14, color: 'white'},'3': {amount: 5, color: 'black'},'1': {amount: 2, color: 'black'}}
            // endgame with mars
            // boardMap = {'24': {amount: 1, color: 'white'},'6': {amount: 5, color: 'black'},'2': {amount: 3, color: 'black'},'25': {amount: 14, color: 'white'},'3': {amount: 5, color: 'black'},'1': {amount: 2, color: 'black'}}
            // eaten soldiers
            // var boardMap = {'26': {amount: 2, color: 'white'},'27': {amount: 2, color: 'black'},'2': {amount: 3, color: 'black'},'25': {amount: 14, color: 'white'},'3': {amount: 5, color: 'black'},'1': {amount: 2, color: 'black'}}
            // no possible moves
            // var boardMap = {'26': {amount: 2, color: 'white'},'4': {amount: 2, color: 'black'},'2': {amount: 3, color: 'black'},'25': {amount: 14, color: 'white'},'3': {amount: 2, color: 'black'},'5': {amount: 2, color: 'black'},'6': {amount: 2, color: 'black'},'15': {amount: 2, color: 'black'},'1': {amount: 2, color: 'black'}}
            // no possible moves & exiting, bug from hell!!!
            // boardMap = {'24': { amount: 1, color: 'white' },'2': { amount: 4, color: 'white' },'0': { amount: 8, color: 'black' },'25': { amount: 10, color: 'white' },'3': { amount: 5, color: 'black' },'1': { amount: 2, color: 'black' }}

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
            state.winner = gameService.isEndGame(state.cells, state.currTurn)? state.currTurn : false
        },
        checkMars(state) {
            state.isMars = gameService.isMars(state.cells, state.currTurn)
        },
        setMars(state, { isMars }) {
            state.isMars = isMars
        },
        checkTurkishMars(state) {
            state.isTurkishMars = gameService.isTurkishMars(state.cells, state.currTurn)
        },
        setTurkishMars(state, { isTurkishMars }) {
            state.isTurkishMars = isTurkishMars
        },
        startTurn(state) {
            state.duringTurn = true
        },
        endTurn(state) {
            state.duringTurn = false
            state.dices = gameService.nullDices(state.dices)
            state.currTurn = gameService.passTurn(state.currTurn)
        },
        setDuringTurn(state) {
            state.duringTurn = false
        },
        nullDices(state) {
            state.dices = gameService.nullDices(state.dices)
        },
        endGame(state, { winner }) {
            if (!state.winner) state.winner = winner
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
            soundService.play('dice')
            state.dices.rolling = true
        },
        unrollDices(state) {
            state.dices.rolling = false
        },
        setDicesNums(state) {
            state.dices = gameService.setDicesNums(state.dices)
        },
        dicesRes(state, { dices }) {
            state.dices.num1ToShow = dices.num1ToShow
            state.dices.num2ToShow = dices.num2ToShow
        },
        setCurrTurn(state, { startingColor }) {
            state.currTurn = startingColor
        },
        updateScore(state) {
            state.score[state.currTurn]++
        },
        setNoPossibleMoves(state, payload) {
            state.noPossibleMoves = payload
        },
    },
    actions: {
        async throwDices({ commit, state }) {
            commit("rollDices")
            commit('startTurn')
            commit('setDicesNums')
            commit('calcPossibleMoves')

            await setTimeout(() => {
                commit('unrollDices')
            }, 1000)

            if (!state.possibleMoves.length) {
                await setTimeout(() => {
                    commit('endTurn')
                    commit('setNoPossibleMoves', true)
                    setTimeout(() => commit('setNoPossibleMoves', false), 1800)
                }, 1500)
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
        googleLogin({ commit }, { loginData }) {
            commit({ type: 'setLoggedInUser', user: { userName: loginData.userName } })
        },
        logout({ commit }) {
            userService.logout();
            commit('logOutUser');
            return Promise.resolve();
        },
        setBoard({ state, commit }, { soldierId, cells, isEating }) {
            if (!cells) {
                commit('setCells')
                commit('setSoldiers')
                commit('setChoosingColors')
            }
            else {
                let movedSoldier = gameService.getSoldierById(state.cells, soldierId)
                movedSoldier.isMoving = true
                commit('clearBoard')
                commit({ type: 'setNewSoldiers', cells })
                movedSoldier = gameService.getSoldierById(state.cells, soldierId)
                movedSoldier.hasMoved = true
                let sound = !isEating ? 'move' : 'eat'
                soundService.play(sound)
                commit('updateCells')
                commit('calcPossibleMoves')
            }
        },
        selectSoldier({ commit }, { soldier }) {

            commit("unselectSoldiers");
            commit("showNoPossibleMoves");
            commit({
                type: "showPossibleMoves",
                possibleMoves: soldier.possibleMoves,
                soldier
            });
            commit({ type: "selectSoldier", soldierId: soldier.id });
        },
        async moveSoldier({ state, commit }, { targetCell }) {
            const isPossibleMove = gameService.isPossibleMove(targetCell.id, state.selectedSoldier)
            if (!isPossibleMove) return false
            const srcCell = gameService.getCellBySoldierId(state.cells, state.selectedSoldier.id)

            const isMiddleCell = gameService.isMiddleCell(srcCell)
            if (isMiddleCell) {
                commit('selectedSoldierNotEaten')
            }

            const isEating = gameService.checkIsEating(targetCell, state.currTurn)
            if (isEating) {
                const eatenSoldier = targetCell.soldiers.pop()
                eatenSoldier.isEaten = true
                const middleCell = gameService.getMiddleCell(eatenSoldier.color, state.cells)
                middleCell.soldiers.push(eatenSoldier)
                gameService.updateCell(middleCell)
            }

            let promise = new Promise(res => {
                setTimeout(() => {
                    srcCell.soldiers.pop()
                    targetCell.soldiers.push(state.selectedSoldier)
                    commit({ type: 'updateDices', srcCell, targetCell })
                    commit('updateCells')
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
                    res({ soldierDidMove: true, isEating })
                }, 100)
            })
            await promise
            return Promise.resolve(promise)
        },
        win({ state }) {
            if (state.currTurn === state.loggedInUser.color) soundService.play("win");
        },
        endGame({ commit }, { winner }) {
            commit({ type: 'endGame', winner });
        },
        setMars({ commit }, { isMars }) {
            commit({ type: "setMars", isMars });
        },
        setTurkishMars({ commit }, { isTurkishMars }) {
            commit({ type: "setTurkishMars", isTurkishMars });
        },
        restartGame({ commit }) {
            commit({ type: 'setMars', isMars: false })
            commit({ type: 'setTurkishMars', isTurkishMars: false })
            commit({ type: 'clearBoard' })
            commit({ type: 'setSoldiers' })
            commit({ type: 'nullDices' })
            commit({ type: 'calcPossibleMoves' })
            commit({ type: 'checkWinner' })
            commit({ type: 'setDuringTurn' })
            commit({ type: 'updateScore' })
        },
        setLoggedInUser({ commit }, { user }) {
            commit({ type: 'setLoggedInUser', user })
        }
    },
    getters: {
        cells: state => state.cells,
        score: state => state.score,
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
        noPossibleMoves: state => state.noPossibleMoves,
        loggedInUserColor: state => state.loggedInUser.color,
    }
})



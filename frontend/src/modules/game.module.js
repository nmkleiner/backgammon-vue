import gameService from '../services/game.service.js';
import userService from '../services/user.service.js';
import soundService from '../services/sound.service.js';

const second = 1000;
export default ({
    state: {
        cells: [],
        selectedSoldier: null,
        currentTurn: null,
        dices: { num1: 6, num2: 6, num1ToShow: 6, num2ToShow: 6, doubleCount: 0, rolling: false, shaking: false },
        possibleMoves: [],
        winner: false,//true/false
        duringTurn: false,
        loggedInUser: { userName: '', _id: '', pic: '', color: 'white' },
        isMars: false,
        isTurkishMars: false,
        score: { white: 0, black: 0 },
        noPossibleMoves: false,
        lastMovesIds: [],
        sendMoveDtoInterval: null
    },
    getters: {
        cells: state => state.cells,
        score: state => state.score,
        dices: state => state.dices,
        isMars: state => state.isMars,
        winner: state => state.winner,
        currentTurn: state => state.currentTurn,
        duringTurn: state => state.duringTurn,
        isRolling: state => state.dices.rolling,
        isShaking: state => state.dices.shaking,
        lastMovesIds: state => state.lastMovesIds,
        loggedInUser: state => state.loggedInUser,
        isTurkishMars: state => state.isTurkishMars,
        isLoggedInUser: state => !!state.loggedInUser,
        selectedSoldier: state => state.selectedSoldier,
        noPossibleMoves: state => state.noPossibleMoves,
        loggedInUserColor: state => state.loggedInUser.color,
    },
    mutations: {
        setSendMoveDtoInterval(state, { socket, moveDto }) {
            moveDto.cells = state.cells
            state.sendMoveDtoInterval = setInterval(() => {
                socket.emit("clientSoldierMoved", moveDto)
            }, 200);
        },
        clearSendMoveDtoInterval(state) {
            clearInterval(state.sendMoveDtoInterval);
        },
        pushLastMoveToLastMovesIds(state, { moveId }) {
            state.lastMovesIds.push(moveId)
        },
        emptyLastMovesIds(state) {
            state.lastMovesIds.length = 0;
        },
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
            if (soldier.color !== state.currentTurn ||
                !soldier.isLastInCell ||
                gameService.hasEatenSoldiers(state.currentTurn, soldiers) && !soldier.isEaten) return;

            soldier.selected = true
            state.selectedSoldier = soldier
        },
        setCells(state) {
            for (let i = 0; i <= 27; i++) {
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
            // boardMap = { '22': { amount: 7, color: 'white' }, '24': { amount: 6, color: 'white' }, '23': { amount: 0, color: 'white' }, '20': { amount: 1, color: 'white' }, '19': { amount: 1, color: 'white' }, '4': { amount: 5, color: 'black' }, '2': { amount: 3, color: 'black' }, '3': { amount: 5, color: 'black' }, '1': { amount: 2, color: 'black' } }
            // crowded mode
            // boardMap = { '22': { amount: 7, color: 'white' }, '24': { amount: 5, color: 'white' }, '23': { amount: 6, color: 'white' }, '21': { amount: 8, color: 'white' }, '20': { amount: 11, color: 'white' }, '4': { amount: 5, color: 'black' }, '2': { amount: 3, color: 'black' }, '3': { amount: 5, color: 'black' }, '1': { amount: 2, color: 'black' } }
            // many in one cell
            // boardMap = { '22': { amount: 15, color: 'white' }, '4': { amount: 5, color: 'black' }, '2': { amount: 3, color: 'black' }, '3': { amount: 5, color: 'black' }, '1': { amount: 2, color: 'black' } }
            // endgame 
            // boardMap = {'24': {amount: 1, color: 'white'},'4': {amount: 5, color: 'black'},'2': {amount: 3, color: 'black'},'25': {amount: 14, color: 'white'},'3': {amount: 5, color: 'black'},'1': {amount: 2, color: 'black'}}
            // endgame with mars
            // boardMap = {'24': {amount: 1, color: 'white'},'6': {amount: 5, color: 'black'},'2': {amount: 3, color: 'black'},'25': {amount: 14, color: 'white'},'3': {amount: 5, color: 'black'},'1': {amount: 2, color: 'black'}}
            // eaten soldiers
            // boardMap = {'26': {amount: 2, color: 'white'},'27': {amount: 2, color: 'black'},'2': {amount: 3, color: 'black'},'25': {amount: 14, color: 'white'},'3': {amount: 5, color: 'black'},'1': {amount: 2, color: 'black'}}
            // no possible moves
            // boardMap = {'26': {amount: 2, color: 'white'},'4': {amount: 2, color: 'black'},'2': {amount: 3, color: 'black'},'25': {amount: 14, color: 'white'},'3': {amount: 2, color: 'black'},'5': {amount: 2, color: 'black'},'6': {amount: 2, color: 'black'},'15': {amount: 2, color: 'black'},'1': {amount: 2, color: 'black'}}
            // no possible moves & exiting, bug from hell!!!
            // boardMap = {'24': { amount: 1, color: 'white' },'2': { amount: 4, color: 'white' },'0': { amount: 8, color: 'black' },'25': { amount: 10, color: 'white' },'3': { amount: 5, color: 'black' },'1': { amount: 2, color: 'black' }}

            for (let cell in boardMap) {
                state.cells[cell].soldiers.push(...gameService.createSoldiers(boardMap[cell].amount, boardMap[cell].color))
            }
            gameService.updateCells(state.cells)
        },
        showPossibleMoves(state, { possibleMoves, soldier }) {
            if (!state.selectedSoldier && soldier.color === state.currentTurn) {
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
            state.possibleMoves = gameService.calcPossibleMoves(state.dices, state.currentTurn, state.cells, soldiers)
        },
        checkWinner(state) {
            state.winner = gameService.isEndGame(state.cells, state.currentTurn) ? state.currentTurn : false
        },
        checkMars(state) {
            state.isMars = gameService.isMars(state.cells, state.currentTurn)
        },
        setMars(state, { isMars }) {
            state.isMars = isMars
        },
        checkTurkishMars(state) {
            state.isTurkishMars = gameService.isTurkishMars(state.cells, state.currentTurn)
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
            state.currentTurn = gameService.passTurn(state.currentTurn)
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
        shakeDices(state) {
            state.dices.shaking = true
        },
        unshakeDices(state) {
            state.dices.shaking = false
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
        setcurrentTurn(state, { startingColor }) {
            state.currentTurn = startingColor
        },
        updateScore(state) {
            if (!!state.winner) {
                state.score[state.currentTurn]++
            }
        },
        setNoPossibleMoves(state, payload) {
            state.noPossibleMoves = payload
        },
        pushSoldier(state, { soldier, cell }) {
            cell.soldiers.push(soldier)
        },
    },
    actions: {
        async rollDices({ state, commit }) {
            commit('shakeDices')
            const interval = setInterval(() => {
                commit('setDicesNums')
            }, 100)
            setTimeout(() => {
                commit('unshakeDices')
                commit('rollDices')
                clearInterval(interval)
                setTimeout(() => {
                    commit('unrollDices')
                }, second)
            }, second)
        },
        async throwDices({ commit, state, dispatch }) {
            dispatch("rollDices")
            await setTimeout(() => {
                commit('startTurn')
                commit('setDicesNums')
                commit('calcPossibleMoves')
                if (!state.possibleMoves.length) {
                    setTimeout(() => {
                        commit('endTurn')
                        commit('setNoPossibleMoves', true)
                        setTimeout(() => commit('setNoPossibleMoves', false), 1800)
                    }, 1500)
                }
                return state.dices
            }, 2 * second)
        },
        setBoard({ state, commit }, { moveDto }) {
            if (moveDto && moveDto.moveId) {
                // if move already executed don't execute again
                if (state.lastMovesIds.includes(moveDto.moveId)) {
                    return;
                } else {
                    commit({ type: 'pushLastMoveToLastMovesIds', moveId: moveDto.moveId })
                }
            }
            if (!moveDto) {
                commit('setCells')
                commit('setSoldiers')
                commit('setChoosingColors')
            } else {
                let movedSoldier = gameService.getSoldierById(state.cells, moveDto.soldierId)
                if (!movedSoldier) { return; }
                movedSoldier.isMoving = true
                commit('clearBoard')
                commit({ type: 'setNewSoldiers', cells: moveDto.cells })
                movedSoldier = gameService.getSoldierById(state.cells, moveDto.soldierId)
                if (!movedSoldier) { return; }
                movedSoldier.hasMoved = true
                let sound = !moveDto.isEating ? 'move' : 'eat'
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

            const isEating = gameService.checkIsEating(targetCell, state.currentTurn)
            if (isEating) {
                const eatenSoldier = targetCell.soldiers.pop()
                eatenSoldier.isEaten = true
                const middleCell = gameService.getMiddleCell(eatenSoldier.color, state.cells)
                commit({ type: 'pushSoldier', cell: middleCell, soldier: eatenSoldier })
                commit('updateCells')
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
                        return Promise.resolve({ soldierDidMove: true, isEating })
                    }
                    if (!state.possibleMoves.length) {
                        commit('endTurn')
                    }
                    res({ soldierDidMove: true, isEating })
                }, 0)
            })
            await promise
            return Promise.resolve(promise)
        },
        win({ state }) {
            if (state.currentTurn === state.loggedInUser.color) soundService.play("win");
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
        restartGame({ commit, dispatch }) {
            dispatch({ type: 'setMars', isMars: false })
            dispatch({ type: 'setTurkishMars', isTurkishMars: false })
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
            console.log('baba')
            commit('logOutUser');
            return Promise.resolve();
        },
    }
})



<template>
    <section class="app-board">
        <div class="flex">
            <div class="rotate-screen animated swing">
                <img src="../../public/img/rotate.png">
            </div>
            <msg-cmp v-if="showMsg" :msg="msg"></msg-cmp>
            <game-board v-if="cells" :cells="cells"></game-board>
            <info-section></info-section>
        </div>
    </section>
</template>
<script>
    import gameBoard from "./game-board";
    import {mapGetters} from "vuex";

    const infoSection = () => import("./info-section");
    const soldier = () => import("./soldier");
    const msgCmp = () => import("./msg-cmp");

    export default {
        name: "appBoard",
        components: {
            gameBoard,
            soldier,
            infoSection,
            msgCmp
        },
        methods: {
            setGameWinner(endGameDto) {
                this.$store.dispatch({type: "endGame", winner: endGameDto.winner});
                if (endGameDto.isMars) {
                    this.$store.dispatch({type: "setMars", isMars: true});
                    if (endGameDto.isTurkishMars) {
                        this.$store.dispatch({type: "setTurkishMars", isTurkishMars: true});
                    }
                }
            }
        },
        computed: {
            ...mapGetters([
                "room",
                "cells",
                "winner",
                "isMars",
                "currentTurn",
                "lastMovesIds",
                "isTurkisMars",
                "endGameDtoIds",
                "noPossibleMoves",
                "throwDicesDtoIds",
                "loggedInUserColor"
            ]),
            isWinner() {
                return this.winner === this.loggedInUserColor;
            },
            showMsg() {
                return this.winner || this.noPossibleMoves;
                // return true
            },
            msg() {
                if (!this.showMsg) return;
                if (this.noPossibleMoves) return "No Possible Moves";
                if (this.winner && this.isTurkishMars)
                    return this.isWinner
                        ? "you won! turkish mars!"
                        : "you lost! turkish mars!";
                if (this.winner && this.isMars)
                    return this.isWinner ? "you won! mars!" : "you lost! mars!";
                if (this.winner) return this.isWinner ? "you won!" : "you lost!";
            }
        },
        created() {
            this.$store.dispatch({type: "setBoard"});

            this.$socket.emit("clientGameJoined", this.room);
        },
        sockets: {
            serverUserJoined() {

                this.$socket.emit("clientAlreadyHere", this.room);
                this.$store.dispatch("setTwoPlayersConnected");
            },
            serverSomeoneAlreadyHere() {
                this.$store.dispatch("changeMyColor");
                this.$store.dispatch("setTwoPlayersConnected");
            },
            serverSoldierMoved(moveDto) {
                const moveRecievedDto = moveDto;
                this.$socket.emit("clientSoldierMoveReceived", moveRecievedDto);
                this.$store.dispatch({
                    type: "setBoard",
                    moveDto
                });
            },
            serverSoldierMoveReceived(moveReceivedDto) {
                this.$store.commit("clearSendMoveDtoInterval");
            },
            serverEndGame(endGameDto) {
                const endGameReceivedDto = endGameDto;
                this.$socket.emit("clientEndGameDtoReceived", endGameReceivedDto);
                if (this.endGameDtoIds.includes(endGameDto.id)) {
                    return;
                }
                this.$store.commit({
                    type: "pushEndGameDtoIdToEndGameDtoIds",
                    endGameDtoId: endGameDto.id
                });
                this.setGameWinner(endGameDto);
            },
            serverEndGameDtoReceived(endGameReceivedDto) {
                this.$store.commit("clearEndGameDtoInterval");
            },
            serverEndTurn() {
                setTimeout(() => {
                    this.$store.commit("endTurn");
                }, 1500);
            },
            serverRestartGame() {
                this.$store.dispatch({type: "restartGame"});
            },
            serverThrowDices(throwDicesDto) {
                if (this.loggedInUserColor === throwDicesDto.from) {
                    return;
                }
                const throwDicesReceivedDto = throwDicesDto;
                this.$socket.emit("clientThrowDicesReceived", throwDicesReceivedDto);

                if (this.throwDicesDtoIds.includes(throwDicesDto.id)) {
                    return;
                }
                this.$store.commit({
                    type: "pushThrowDicesToThrowDicesIds",
                    id: throwDicesDto.id
                });
                this.$store.dispatch("rollDices");
                setTimeout(async () => {
                    this.$store.commit("unrollDices");
                    if (throwDicesDto.dice) {
                        const {loggedInUserColor} = this;
                        await this.$store.dispatch({
                            type: "diceRes",
                            dice: throwDicesDto.dice,
                            loggedInUserColor
                        });
                    } else {
                        this.$store.commit({type: "dicesRes", dices: throwDicesDto.dices});
                    }
                }, 1000);
            },
            serverThrowDicesReceived(throwDicesReceivedDto) {
                this.$store.commit({type: "clearThrowDicesDtoInterval", throwDicesReceivedDto});
            }
        },
        watch: {
            winner: function (newVal, oldVal) {
                if (newVal) {

                    const endGameDto = {
                        id: Date.now(),
                        room: this.room,
                        winner: true
                    };
                    this.$store.commit({
                        type: "setEndGameDtoInterval",
                        socket: this.$socket,
                        endGameDto
                    });
                    this.$store.dispatch("win");
                }
            },
            isMars: function (newVal) {
                if (newVal) {

                    const endGameDto = {
                        id: Date.now(),
                        room: this.room,
                        isMars: true
                    };
                    this.$store.commit({
                        type: "setEndGameDtoInterval",
                        socket: this.$socket,
                        endGameDto
                    });
                }
            },
            isTurkishMars: function (newVal) {
                if (newVal) {

                    const endGameDto = {
                        id: Date.now(),
                        room: this.room,
                        isTurkishMars: true
                    };
                    this.$store.commit({
                        type: "setEndGameDtoInterval",
                        socket: this.$socket,
                        endGameDto
                    });
                }
            },
            currentTurn: function (currentTurnColor) {
                if (currentTurnColor !== this.loggedInUserColor) {
                    if (this.lastMovesIds.length > 10) {
                        this.$store.commit("emptyLastMovesIds");
                    }
                    if (this.throwDicesDtoIds.length > 4) {
                        this.$store.commit("emptyThrowDicesIds");
                    }
                }
            }
        }
    };
</script>

<style scoped lang='scss'>
</style>

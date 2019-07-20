<template>
    <div class="action-btns" :class="{'hidden': loading}">
        <Button
                v-for="(button,idx) in buttons"
                :key="idx"
                :button="button"
        ></Button>
    </div>
</template>

<script>
    import soundService from "../services/sound.service";
    import {mapGetters} from 'vuex'
    import Button from "./Button";

    export default {
        components: {
            Button
        },
        data() {
            return {
                loading: true,
                diceSound: '',
                isRestarting: false,
            };
        },
        created() {
            setTimeout(() => {
                this.loading = false;
            }, 1000);
        },
        computed: {
            buttons() {
                return [
                    {
                        class: {wait: true, lightSpeedIn: this.showWaitBtn},
                        isShowing: this.showWaitBtn,
                        html: 'Wait..<span class="animated flash slower infinite">.</span>'
                    },
                    {
                        class: {lightSpeedIn: this.showDiceBtn, fadeOutUp: !this.showDiceBtn},
                        isShowing: this.showDiceBtn,
                        html: 'Roll',
                        onClick: this.throwDice
                    },
                    {
                        class: {lightSpeedIn: this.showDicesBtn, fadeOutUp: !this.showDicesBtn},
                        isShowing: this.showDicesBtn,
                        html: 'Roll',
                        onClick: this.throwDices
                    },
                    {
                        class: {'play-again': true, lightSpeedIn: this.winner, fadeOutUp: !this.winner},
                        isShowing: this.showPlayAgainBtn,
                        html: 'Play Again?',
                        onClick: this.restartGame
                    },
                    {
                        class: {restarting: true, lightSpeedIn: this.isRestarting, fadeOutUp: !this.isRestarting},
                        isShowing: this.isRestarting,
                        html: 'Restarting..<span class="animated flash slower infinite">.</span>',
                    }
                ]
            },
            showDicesBtn() {
                return (
                    this.isGameOn &&
                    !this.duringTurn &&
                    !this.rolling &&
                    this.currentTurn === this.loggedInUserColor
                );
            },
            showPlayAgainBtn() {
                return this.winner && !this.isRestarting
            },
            showDiceBtn() {
                return (
                    !this.isGameOn &&
                    (
                        (this.loggedInUserColor === "white" && !this.startDice.white) ||
                        (this.loggedInUserColor === "black" && this.startDice.white && !this.startDice.black)
                    ) && !this.waitingForUser);
            },
            showWaitBtn() {
                return (
                    !this.isGameOn &&
                    ((!this.startDice.white && this.loggedInUserColor === "white") ||
                        (this.startDice.white &&
                            !this.startDice.black &&
                            this.loggedInUserColor === "black")) &&
                    this.waitingForUser
                );
            },
            waitingForUser() {
                return !(this.playersConnected === 2);
            },
            ...mapGetters([
                'winner',
                'playersConnected',
                'startDice',
                'isGameOn',
                'isRolling',
                'loggedInUserColor',
                'currentTurn',
                'duringTurn',
                'dices',
            ])
        },
        methods: {
            async throwDices() {
                await this.$store.dispatch("throwDices");
                const room = 1;
                const throwDicesDto = {
                    room,
                    id: Date.now(),
                    dices: this.dices
                }
                console.log("clientThrowDices", throwDicesDto)
                // this.$socket.emit("clientThrowDices", throwDicesDto);
                this.$store.commit({type: 'setThrowDicesDtoInterval', socket: this.socket, throwDicesDto});
            },
            async throwDice() {
                const userColor = this.userColor === "white" ? "black" : "white";
                await this.$store.dispatch({type: "diceRes", userColor});
                const room = 1;
                const throwDicesDto = {
                    room,
                    id: Date.now(),
                    dice: this.startDice.dice
                }
                console.log("clientThrowDice", throwDicesDto)
                // this.$socket.emit("clientThrowDices", throwDicesDto);
                this.$store.commit({type: 'setThrowDicesDtoInterval', socket: this.socket, throwDicesDto});
            },
            async restartGame() {
                this.isRestarting = true;
                setTimeout(() => {
                    this.isRestarting = false;
                    this.$store.dispatch("restartGame");
                    const room = 1;
                    this.$socket.emit("clientRestartGame", room);
                }, 1500);
            }
        },
        watch: {
            showDicesBtn: (newVal) => {
                if (newVal) {
                    soundService.play("yourTurn");
                }
            }
        }
    };
</script>

<style scoped lang="scss">
</style>

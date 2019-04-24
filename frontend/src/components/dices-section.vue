<template>
    <section class="dices-section" :style="sectionStyle">
        <div class="two-dices-wrapper flex space-between" v-if="isGameOn">
            <dice
                    class="dice1"
                    :shaking="isShaking"
                    :rolling="isRolling"
                    :used="!dices.num1 && !!dices.num2"
                    :num="dices.num1ToShow"
            />
            <dice
                    class="dice2"
                    :shaking="isShaking"
                    :rolling="isRolling"
                    :used="!dices.num2 && !!dices.num1 && dices.doubleCount <= 1"
                    :num="dices.num2ToShow"
            />
        </div>
        <dice v-if="!isGameOn" :rolling="isRolling" :num="startDice.dice"></dice>
    </section>
</template>

<script>
    import gameService from "../services/game.service";
    const dice = () => import('./dice.vue');
    const soldier = () => import('./soldier');
    import ioClient from 'socket.io-client';
    import {mapGetters} from 'vuex'

    export default {
        components: {
            dice,
            soldier
        },
        sockets: {
            serverisRolling() {
                this.$store.dispatch('rollDices');
            },
            serverDicesUnrolling(dices) {
                setTimeout(() => {
                    this.$store.commit('unrollDices');
                    this.$store.commit({type: 'dicesRes', dices});
                }, 1000);
            },
            async serverDiceUnrolling(dice) {
                await setTimeout(() => {
                    this.$store.commit('unrollDices');
                }, 1000);
                await this.$store.dispatch({type: 'diceRes', dice, userColor : this.loggedInUserColor});
            },
            serverEndTurn() {
                setTimeout(() => {
                    this.$store.commit('endTurn');
                }, 1500);
            }
        },
        data() {
          return {
              width: 12,
              height: 5
          }
        },
        computed: {
            ...mapGetters([
                'dices',
                'duringTurn',
                'loggedInUserColor',
                'isShaking',
                'isRolling',
                'isGameOn',
                'startDice',
                'winner',
            ]),
            sectionStyle() {
                return {
                    width: `${this.width}vw`,
                    height: `${this.height}vw`,
                }
            },
        },
        watch: {
            duringTurn: function (newVal) {
                if (newVal === false) {
                    const room = 1;
                    this.$socket.emit('clientEndTurn', room);
                    this.width = 12
                    this.height = 5
                }
            },
            isRolling(newVal) {
                if (newVal) {
                    this.width = gameService.setDicesWidth()
                    this.height = gameService.setDicesHeight()
                }
            },
            'startDice.white': function () {
                if (this.startDice.black && this.startDice.white) {
                    if (this.startDice.white === this.startDice.black) {
                        this.$store.commit('nullDice');
                        return false;
                    }
                    const startingColor =
                        this.startDice.white > this.startDice.black ? 'white' : 'black';
                    this.$store.commit({type: 'setCurrTurn', startingColor});
                    setTimeout(() => {
                        this.$store.commit('gameOn');
                    }, 2000);
                }
            },
            'startDice.black': function () {
                if (this.startDice.black && this.startDice.white) {
                    if (this.startDice.white === this.startDice.black) {
                        this.$store.commit('nullDice');
                        return false;
                    }
                    const startingColor =
                        this.startDice.white > this.startDice.black ? 'white' : 'black';
                    this.$store.commit({type: 'setCurrTurn', startingColor});
                    setTimeout(() => {
                        this.$store.commit('gameOn');
                    }, 2000);
                }
            }
        }
    };
</script>
<style lang="scss" scoped>
    .dices-section {
        background-color: transparent;
        display: flex;
        justify-content: center;
        /*width: 18vw;*/
        transition: width .5s;

        .two-dices-wrapper {
            width: 100%;
        }
        .dice1 {
            align-self: flex-start;
        }
        .dice2 {
            align-self: flex-end;
        }
    }
</style>


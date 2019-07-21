<template>
    <div :class="diceClass">
        <div class="dotsColumn">
            <div v-for="idx in 3" :key="idx" :class="{show: displayDots.includes(-1+idx*2)}" class="dot"></div>
        </div>
        <div class="dotsColumn">
            <div :class="{show: displayDots.includes(7)}" class="dot"></div>
        </div>
        <div class="dotsColumn">
            <div v-for="idx in 3" :key="idx" :class="{show: displayDots.includes(idx*2)}" class="dot"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            num: Number,
            rolling: Boolean,
            used: Boolean,
            shaking: Boolean,

        },
        computed: {
            diceClass() {
                return [
                    'dice',
                    'animated faster infinite',
                    {
                        rolling: this.rolling,
                        used: this.used,
                        shake: this.shaking,
                    }
                ]
            },
            displayDots() {
                switch (this.num) {
                    case 1:
                        return [7];
                    case 2:
                        return [1, 6];
                    case 3:
                        return [1, 6, 7];
                    case 4:
                        return [1, 5, 2, 6];
                    case 5:
                        return [1, 5, 2, 6, 7];
                    case 6:
                        return [1, 2, 3, 4, 5, 6];
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .dice {
        display: flex;
        justify-content: space-evenly;
        background: white;
        width: 5vw;
        height: 5vw;
        z-index: 1;
        border-radius: 5px;
        border: 1px solid black;
        @media (min-width: 850px) {
            border-radius: 8px;
        }

        &:hover {
            animation-name: pulses;
            animation-duration: 0.7s;
            animation-iteration-count: infinite;
        }

        &.shaking {
        }

        &.rolling {
            animation-name: spin;
            animation-duration: 0.1s;
            animation-iteration-count: infinite;
        }

        &.used {
            background-color: rgb(175, 174, 174);
        }

        .dotsColumn {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
        }

        .dot {
            background-color: black;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            visibility: hidden;

            @media (min-width: 850px) {
                width: 6px;
                height: 6px;
            }
            &.show {
                visibility: visible;;
            }
        }
    }

    @keyframes pulses {
        25% {
            transform: scale(1.2)
        }
        50% {
            transform: scale(1.2)
        }
    }

    @keyframes spin {
        100% {
            transform: rotate(360deg);
        }
    }
</style>

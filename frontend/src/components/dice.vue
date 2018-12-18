<template>
    <div class="dice flex flex-row justify-evenly" :class="{'rolling': rolling}">
        <div class="flex flex-column justify-evenly">
            <div v-for="idx in 3" :key="idx" :class="{'show': displayDots.includes(-1+idx*2)}" class="dot"></div>
        </div>
        <div class="flex flex-column justify-evenly">
            <div :class="{'show': displayDots.includes(7)}" class="dot"></div>
        </div>
        <div class="flex flex-column justify-evenly">
            <div v-for="idx in 3" :key="idx" :class="{'show': displayDots.includes(0+idx*2)}" class="dot"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        num: Number,
        rolling: Boolean
    },
    computed: {
        displayDots() {
            switch (this.num) {
                case 1:
                return [7]
                break;
                case 2:
                return [1,6]
                break;
                case 3:
                return [1,6,7]
                break;
                case 4:
                return [1,5,2,6]
                break;
                case 5:
                return [1,5,2,6,7]
                break;
                case 6:
                return [1,2,3,4,5,6]
                break;                
            }
        }
    }
}
</script>

<style scoped lang="scss">
.dice {
    position: relative;
    background: white;
    width: 5vw;
    height: 5vw;
    z-index: 1;
    border-radius: 10px; 
    border: 1px solid black;
    margin: 15px 0;
    &:hover{
        animation-name: pulses;
        animation-duration: 0.7s;
        animation-iteration-count: infinite;    
    }
    &.rolling {
        animation-name: spin;
        animation-duration: 0.1s;
        animation-iteration-count: infinite;
    }
    .dot {
        background-color: black;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        visibility: hidden;
        &.show{
        visibility: visible;;

        }
    }
}



@keyframes pulses{
    25% {
        transform: scale(1.2)
    }
    50% {
        transform: scale(1.2)
    }
}

@keyframes spin{
        100% {
        transform: rotate(360deg);   
    }
}

</style>

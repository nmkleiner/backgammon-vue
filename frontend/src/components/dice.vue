<template>
    <div class="dice flex flex-row justify-evenly" :class="{'rolling': rolling, 'used': used}">
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
        rolling: Boolean,
        used: Boolean
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

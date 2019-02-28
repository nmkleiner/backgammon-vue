<template functional>

    <section class="soldier-section" >
        <!-- @dblclick="listeners.dblclick" -->
        <div class="soldier" v-if="props.soldier"
        @click="listeners.click"
        @mouseout="listeners.mouseout"
        @mouseover="listeners.mouseover"
        :class="{
            'white': props.soldier.color === 'white',
            'black': props.soldier.color === 'black',
            'selected': props.soldier.selected,
            'animated zoomOut fast': props.soldier.isMoving && props.soldier.color !== props.loggedInUserColor,
            'animated zoomIn fast': props.soldier.hasMoved && props.soldier.color !== props.loggedInUserColor,
        }">
        </div>
        <div 
            class="soldier-const" v-if="props.color"
            :class="{
                'white': props.color === 'white',
                'black': props.color === 'black',
                }"
        >
        </div>
    </section>
</template>

<script>
export default {
    props: {
        soldier: Object,
        color: String,
        loggedInUserColor: String,
        const: {
            type: Boolean,
            default: false
        },
    }
}
</script>

<style scoped lang="scss">
.soldier-section {
    z-index: 1;
    .soldier {
        align-self: center;
        height: 5.9vh;
        width: 5.9vh;
        @media (min-width: 850px) {
            height: 4.9vh;
            width: 4.9vh;
        }
        border-radius: 50%;
        &.black{
            background-color: black;
            border: 2px solid white;
            &.selected{
                border: 2px solid yellow;
            }
        }
        &.white{
            background-color: #fff;
            border: 2px solid black;
            &.selected{
                border: 2px solid blue;
            }
        }
    }
    .soldier-const {
        height: 24px;
        width: 24px;
        border-radius: 50%;
        z-index: 0;
        &.black{
            background-color: black;
            border: 2px solid white;
        }
        &.white{
            background-color: #fff;
            border: 2px solid black;
        }
    }
}
</style>





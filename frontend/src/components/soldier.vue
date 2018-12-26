<template>
    <section class="soldier-section">
        <div class="soldier" v-if="soldier"
        :class="{
            'white': soldier.color === 'white',
            'black': soldier.color === 'black',
            'selected': soldier.selected,
            'animated fadeIn': soldier.hasMoved,
            'animated fadeOut': soldier.isMoving
            }">
        </div>
        <div class="soldier-const" v-if="color"
        :class="{
            'white': color === 'white',
            'black': color === 'black',
            }">
        </div>
    </section>
</template>

<script>
export default {
    props: {
        soldier: Object,
        color: String
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
        height: 2.9vw;
        width: 2.9vw;
        border-radius: 50%;
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

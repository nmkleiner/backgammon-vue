<template>
    <section class="msg-wrapper animated 
    fadeInDown
    ">
        <div class="msg-content capitalize">
            {{this.msg}}
        </div>
    </section>
</template>

<script>
export default {
    props: {
        msg: String
    },
    data() {
        return {
            
        }
    },
}
</script>

<style lang="scss" scoped>
.msg-wrapper {
    height: 100vh;
    width: calc(38.4vw + 5px);
    top: 0px;
    left: calc(5vw + 25px);
    @media (min-width: 850px) {
        height: calc(68vh + 10px);
    width: 36vw;
    top: 10px;
    left: calc(5vw + 20px);
    }
    position: absolute;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    .msg-content {
        border: 5px solid black;
        padding: 30px;
        @media (min-width: 850px) {
            padding: 60px;
        }
        font-size: 40px;
        font-family: monospace;
        border-radius: 20px;
        color: #bbb;
        background-color: darken(darkgrey,30%);
    }

}
</style>

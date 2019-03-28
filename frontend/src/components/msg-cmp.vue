<template functional>
    <section class="msg-wrapper animated fadeInDown">
        <div class="msg-content capitalize">
            {{props.msg | capitalize}}
        </div>
    </section>
</template>

<script>
export default {
    props: {
        msg: String
    }
}
</script>

<style lang="scss" scoped>
.msg-wrapper {
    height: 100vh;
    width: calc(6 * 6.4vw);
    top: 0px;
    left: calc(12vw - 29px + 10px);
    position: absolute;
    z-index: 20;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    @media (min-width: 850px) {
        height: calc(68vh + 10px);
        width: 36vw;
        top: 10px;
        left: calc(5vw + 20px);
    }
    .msg-content {
        border: 2px solid #111;
        padding: 30px;
        width: 100%;
        font-size: 32px;
        font-family: monospace;
        color: #111;
        background-color: darken(white,10%);
        margin-top: 10px;
        @media (min-width: 850px) {
            padding: 60px;
        }
    }

}
</style>

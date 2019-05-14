<template>
    <div v-if="notification.isShowing" class="msg-notification">
        <i :class="iconClass"></i>
    </div>
</template>

<script>
    export default {
        name: "msgNotification",
        props: {
          notification: Object,
        },
        computed: {
            iconClass() {
                return `fas fa-${this.notification.icon}`
            }
        }
    }
</script>

<style lang="scss" scoped>

    .msg-notification {
        color: lighten(#25d366, 10%);
        position: absolute;
        top: 28px;
        left: 0px;
        animation: myOrbit .7s linear;

    }

    @keyframes myOrbit {
        0% { transform: rotateZ(0deg) translateX(12px) rotateZ(0deg); }
        50%   { transform: rotateZ(-360deg) translateX(8px) rotateZ(360deg); }
        100%   { transform: rotateZ(-720deg) translateX(4px) rotateZ(720deg); }
    }

</style>

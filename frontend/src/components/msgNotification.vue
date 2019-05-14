<template>
    <div v-if="notification.isShowing" class="msg-notification">
        <i :class="iconClass" id="left"></i>
        <i :class="iconClass" id="right"></i>
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
                return [`fas fa-${this.notification.icon}`, 'icon']
            }
        }
    }
</script>

<style lang="scss" scoped>

    .msg-notification {
        color: #fff;
        position: absolute;
        height: 13px;
        width: 16px;
        bottom: 0;
        left: 0;

        .icon {
            position: absolute;

            &#left {
                animation: animationLeft 1.5s linear;
            }

            &#right {
                left: 4px;
                animation: animationRight 1.5s linear;
                visibility: hidden;
            }
        }

    }


    @keyframes animationLeft {
        0% {
            transform: rotate(0deg) translateX(2px) rotate(-0deg);
        }
        50% {
            transform: rotate(360deg) translateX(2px) rotate(-360deg);
            visibility: hidden;
        }
        100% {
            transform: rotate(360deg) translateX(2px) rotate(-360deg);
            visibility: hidden;
        }
    }

    @keyframes animationRight {
        0% {
            transform: rotate(-180deg) translateX(2px) rotate(180deg);
            visibility: hidden;
        }
        50% {
            transform: rotate(180deg) translateX(2px) rotate(-180deg);
            visibility: hidden;
        }
        100% {
            transform: rotate(-180deg) translateX(2px) rotate(180deg);
            visibility: visible;

        }
    }

</style>

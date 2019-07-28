<template>
    <div class="iconWrapper" @click="openApp()">
        <img :src="appIcon.img" >
        <div class="iconCover"></div>
    </div>
</template>

<script>
    export default {
        name: "AppIcon",
        props: {
          appIcon: Object
        },
        methods: {
            openApp() {
                window.open(this.appIcon.app);
            }
        },
    }
</script>

<style scoped lang="scss">
    .iconWrapper {
        position: relative;

        img {
            width: 64px;
            transition: .3s;
        }

        .iconCover {
            position: absolute;
            top: 0;
            left: 0;
            width: 64px;
            height: 64px;
            background-color: #fff;
            opacity: 0;
            cursor: pointer;
            transition: .2s;

            &:hover {
                opacity: 0.3;
            }
        }
    }
</style>

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


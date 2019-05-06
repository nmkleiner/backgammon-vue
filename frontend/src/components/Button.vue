<template>
    <button
            :class="['animated bold',button.class]"
            v-if="button.isShowing"
            v-html="button.html"
            @click.stop="button.onClick"
    >
    </button>
</template>

<script>
    export default {
        name: "Button",
        props: {
            button: Object,
        }
    }
</script>

<style scoped>
</style>

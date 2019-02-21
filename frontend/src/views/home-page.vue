<template>
    <div class="home-page">
        <aside-cmp></aside-cmp>
        <app-board></app-board>
    </div>
</template>

<script>
const asideCmp = () => import('../components/aside-cmp')
const appBoard = () => import('../components/app-board')
export default {
    components: {
        appBoard,
        asideCmp
    },
    
}
</script>

<style>

</style>

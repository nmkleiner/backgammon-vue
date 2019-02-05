<template>
    <div class="home-page">
        <aside-cmp></aside-cmp>
        <app-board></app-board>
    </div>
</template>

<script>
import asideCmp from '../components/aside-cmp'
import appBoard from '../components/app-board'
export default {
    components: {
        appBoard,
        asideCmp
    },
    
}
</script>

<style>

</style>

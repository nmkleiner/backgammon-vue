<template>
    <div class="home-page">
        <aside-cmp></aside-cmp>
        <app-board></app-board>
    </div>
</template>

<script>
const asideCmp = () => import('../components/aside-cmp')
import appBoard from '../components/app-board'
export default {
    components: {
        appBoard,
        asideCmp
    },
    
}
</script>
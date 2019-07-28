<template>
    <div class="home-page">
        <button @click="getARoom">Get a room</button>
        <textarea class="hiddenInput" ref="clipboard"></textarea>
    </div>
</template>

<script>
    const asideCmp = () => import('../components/aside-cmp');
    import appBoard from '../components/app-board';
    import utilService from '../services/util.service'

    export default {
        components: {
            appBoard,
            asideCmp
        },
        methods: {
            getARoom() {
                const room = utilService.makeid(8);
                this.copyLinkToClipboard(room);
                this.$router.push(`/game/${room}?isFromLink=false`);
            },
            copyLinkToClipboard(room) {
                const elClipboard = this.$refs.clipboard;
                elClipboard.value = `https://backgammon-app.herokuapp.com/game/${room}?isFromLink=true`;
                elClipboard.select();
                document.execCommand('copy');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .home-page {
        .hiddenInput {
            position: absolute;
            top: -1000px;
        }
    }
</style>

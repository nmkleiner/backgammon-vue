<template>
    <div class="home-page">
        <aside-cmp></aside-cmp>
        <app-board></app-board>
        <modal name="hello-world">
            <div class="innerWrapper">
                <div class="title" v-text="'Link copied to clipboard. Send to friend via:'"></div>
                <div class="iconsContainer">
                    <AppIcon v-for="(appIcon,key) in appIcons" :key="key" :appIcon="appIcon"></AppIcon>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
    const asideCmp = () => import('../components/aside-cmp');
    const AppIcon = () => import('../components/AppIcon');

    import appBoard from '../components/app-board';

    export default {
        components: {
            appBoard,
            asideCmp,
            AppIcon
        },
        data() {
            return {
                room: ''
            }
        },
        computed: {
            appIcons() {
                return [
                    {
                        app: `whatsapp://send?text=${this.whatsappMessage}`,
                        img: require('../assets/imgs/icons/whatsapp-icon.png')
                    },
                    {app: 'fb-messenger://', img: require('../assets/imgs/icons/messenger-icon.png')},
                ]
            },
            whatsappMessage() {
                return 'Hey buddy! Click the link to join me for a game of backgammon. https://backgammon-app.herokuapp.com/game/${this.room}?isFromLink=true'
            }

        },
        created() {
            this.room = this.$route.params.room;
            this.$store.commit({type: 'setRoom', room: this.room});
        },
        mounted() {
            const isFromLink = this.$route.query.isFromLink;
            if (isFromLink === 'false') {
                this.$modal.show('hello-world')
            }
        }

    }
</script>

<style lang="scss" scoped>
    .innerWrapper {
        display: flex;
        height: 100%;
        flex-direction: column;
        justify-content: space-evenly;

        .title {
            text-align: center;
            font-size: 20px;
        }

        .iconsContainer {
            display: flex;
            width: 60%;
            justify-content: space-around;
            margin: 0 auto;

            /*.iconWrapper {*/
            /*position: relative;*/

            /*img {*/
            /*width: 64px;*/
            /*transition: .3s;*/
            /*}*/

            /*.iconCover {*/
            /*position: absolute;*/
            /*top: 0;*/
            /*left: 0;*/
            /*width: 64px;*/
            /*height: 64px;*/
            /*background-color: #fff;*/
            /*opacity: 0;*/
            /*cursor: pointer;*/
            /*transition: .2s;*/

            /*&:hover {*/
            /*opacity: 0.3;*/
            /*}*/
            /*}*/
            /*}*/
        }
    }

</style>

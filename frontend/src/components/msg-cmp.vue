<template functional>
    <section class="msg-wrapper animated fadeInDown">
        <div class="msg-content capitalize">
            {{props.msg}}
        </div>
    </section>
</template>

<script>
export default {
    props: {
        msg: String
    }
}
</script>

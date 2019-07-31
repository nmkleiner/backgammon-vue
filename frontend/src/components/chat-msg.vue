<template functional>
  <div
    class="container round msg"
    :class="{msgOut: props.nickname === props.msg.from, msgIn: props.nickname !== props.msg.from}"
  >
    <div class="img-wrapper">
      <img v-if="props.msg.pic" :src="props.msg.pic">
      <img v-else src="../../public/img/user.jpg">
      <soldier :color="props.msg.color"></soldier>
    </div>
    <span class="chat-user-name">{{props.msg.from}}:</span>
    <br>
    {{props.msg.txt}}
  </div>
</template>

<script>
export default {
  props: {
    msg: Object,
    nickname: String
  }
};
</script>

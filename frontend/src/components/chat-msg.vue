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

<style lang="scss" scoped>
.container {
  border: 1px solid black;
  background-color: white;
  border-radius: 5px;
  overflow-wrap: break-word;
  padding: 5px;
  margin: 5px 5px;
  position: relative;
  width: 40vw;
  min-height: 78px;
  font-size: 18px;
  @media (min-width: 850px) {
    width: unset;
  }
  &::after {
    content: "";
    clear: both;
    display: table;
  }

  .chat-user-name {
    font-size: 16px;
    font-weight: bold;
  }
}

.msgOut {
  background-color: lighten(#25d366, 10%);
  margin: 5px 50px 0px 5px;
  &::after {
    content: " ";
    position: absolute;
    width: 0;
    height: 0;
    left: -20px;
    right: auto;
    top: 38px;
    bottom: auto;
    border: 12px solid;
    border-color: lighten(#25d366, 10%) lighten(#25d366, 10%) transparent
      transparent;
  }
}

.msgIn {
  background-color: darken(white, 3%);
  margin: 5px 5px 0px 50vw;
  @media (min-width: 850px) {
    margin: 5px 5px 0px 50px;
  }
  &:after {
    content: " ";
    position: absolute;
    width: 0;
    height: 0;
    left: auto;
    right: -20px;
    top: 38px;
    bottom: auto;
    border: 12px solid;
    border-color: darken(white, 3%) transparent transparent darken(white, 3%);
  }
}

.round {
  border-radius: 30px;
  -webkit-border-radius: 30px;
  -moz-border-radius: 30px;
}
.msg {
  color: black;
  padding: 10px;
  .img-wrapper {
    position: relative;
    img {
      border-radius: 50%;
      width: 48px;
      height: 48px;
    }
    .soldier-section {
      position: absolute;
      top: 34px;
      left: 34px;
    }
  }
}
</style>

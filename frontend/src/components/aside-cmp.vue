<template>
  <section class="aside-cmp">

    <aside-btn></aside-btn>
    <transition name="slide">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
const loginCmp = () => import("./login-cmp");
const signupCmp = () => import("./signup-cmp");
const chatCmp = () => import("./chat-cmp");
const asideBtn = () => import("./aside-btn");

export default {
  components: {
    chatCmp,
    loginCmp,
    signupCmp,
    asideBtn
  },
};
</script>

<style lang="scss" scoped>

.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}
</style>

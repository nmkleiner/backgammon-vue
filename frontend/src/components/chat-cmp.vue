<template>
  <section class="chat-cmp aside-card">
    <!-- <div class="empty"></div> -->
    <div class="conversation-container">
      <div :class="{'input-focus': isInputFocus}" class="empty"></div>
      <div :class="{'input-focus': isInputFocus}" class="conversation" ref="conversationRef">
        <chat-msg v-for="(msg, idx) in msgs" :key="idx" :msg="msg" :nickname="nickname"/>
      </div>

      <form :class="{'input-focus': isInputFocus}" class="conversation-compose">
        <textarea
          v-model="newMsg.txt"
          @focus="toggleInputFocus"
          @blur="toggleInputFocus"
          class="border-bottom-input"
          placeholder="Type a message"
          autocomplete="off"
          autofocus
        ></textarea>
        <button class="send-btn" @click.prevent="send">
          <i class="far fa-comment"></i>
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import ioClient from "socket.io-client";
import msgService from "../services/msg.service.js";
import soundService from "../services/sound.service.js";

const soldier = () => import("./soldier");
const chatMsg = () => import("./chat-msg");
export default {
  components: {
    soldier,
    chatMsg
  },
  props: {
    isChatOpen: Boolean
  },
  data() {
    return {
      msgs: [],
      newMsg: {},
      typeMsg: "",
      loading: true
    };
  },
  methods: {
    send() {
      if (!this.newMsg.txt) return;
      this.$socket.emit("assignMsg", {
        msg: {
          ...this.newMsg,
          from: this.nickname,
          color: this.loggedInUser.color,
          pic: this.loggedInUser.pic
        },
        room: 1
      });
      this.newMsg = msgService.createEmptyMsg(this.nickname);
      this.pushMsgToHistory(this.newMsg);
    },
    scrollToEnd() {
      var container = this.$refs.conversationRef;
      var scrollHeight = container.scrollHeight;
      container.scrollTop = scrollHeight;
    },
    // scrollIntoView() {
    //   var container = this.$refs.conversationRef;
    //   container.scrollIntoView();
    // },
    pushMsgToHistory(msg) {
      this.$emit("pushMsgToHistory", msg);
    },
    toggleInputFocus() {
      this.$store.commit('toggleInputFocus')
    }
  },
  async created() {
    await this.$store.dispatch("getLoggedInUser");
    this.newMsg = msgService.createEmptyMsg(this.nickname);
    const room = 1;
    this.$socket.emit("chatJoined", room);
    setTimeout(() => (this.loading = false), 1200);
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
    nickname() {
      return this.loggedInUser.userName ? this.loggedInUser.userName : "guest";
    },
    isInputFocus() {
      return this.$store.getters.isInputFocus;
    }
  },
  sockets: {
    renderMsg(msg) {
      soundService.play("msg");
      this.$store.commit({ type: "setShowNotification", value: true });
      this.msgs.push(msg);
      this.scrollToEnd()
    }
  }
};
</script>

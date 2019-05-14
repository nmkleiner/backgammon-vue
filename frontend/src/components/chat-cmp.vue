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
      const container = this.$refs.conversationRef;
      const scrollHeight = container.scrollHeight;
      container.scrollTop = scrollHeight;
    },
    pushMsgToHistory(message) {
      this.$emit("pushMsgToHistory", message);
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
};
</script>

<style scoped lang='scss'>
.chat-cmp {
  .empty {
    height: 65px;
    &.input-focus {
      height: 0;
      @media (min-width: 850px) {
        height: 65px;
      }
    }
  }
  .conversation-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: fit-content;
    z-index: 10;
    @media (min-width: 850px) {
      width: 360px;
    }
    width: 100vw;
  }

  .conversation {
    overflow: auto;
    height: calc(100vh - 65px - 52px);
    @media (min-width: 850px) {
      height: 400px;
    }

    &.input-focus {
      @media (max-width: 850px) {
        height: calc(100vh);
        z-index: 12;
      }
    }

    padding: 0 15px 15px 15px;
  }

  .conversation-compose {
    display: flex;
    align-items: center;
    padding: 3px 20px;
    background-color: lighten(black, 10%);
    width: 100%;
    justify-content: flex-start;
    z-index: 1;
    @media (min-width: 850px) {
      padding: 10px 20px;
    }

    &.input-focus {
      align-items: flex-end;
      position: fixed;
      bottom: 0;
      z-index: 12;
      @media (min-width: 500px) {
        height: 100vh;
      }
      @media (min-width: 850px) {
        height: unset;
        position: unset;
      }

      .border-bottom-input {
        outline: none;
      }
    }

    textarea.border-bottom-input {
      height: unset;
      width: 70%;
      @media (min-width: 850px) {
        height: unset;
      }
    }

    .send-btn {
      padding: 7px;
      width: 46px;
      height: 46px;
      background-color: darken(#25d366, 20%);
      border: none;
      color: darken(white, 15%);
      border-radius: 50%;
      outline: 0;
      font-size: 16px;
      margin-left: 25px;
      cursor: pointer;
    }
  }
}
</style>










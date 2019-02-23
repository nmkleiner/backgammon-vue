<template>
  <section class="chat-cmp">
    <div
      class="conversation animated"
      :class="{'hidden': loading,'slideOutRight': !isChatOpen, 'slideInRight': isChatOpen}"
    >
      <div :class="{'input-focus': isInputFocus}" class="empty"></div>
      <div
        :class="{'input-focus': isInputFocus}"
        class="conversation-container"
        ref="conversationRef"
      >
        <div v-for="(msg, idx) in msgs" :key="idx">
          <div
            class="container round msg"
            :class="{msgOut: nickname === msg.from, msgIn: nickname !== msg.from}"
          >
            <div class="img-wrapper">
              <img v-if="msg.pic" :src="msg.pic">
              <img v-else src="../../public/img/user.jpg">
              <soldier :color="msg.color"></soldier>
            </div>
            <span class="chat-user-name">{{msg.from}}:</span>
            <br>
            {{msg.txt}}
          </div>
        </div>
      </div>

      <form :class="{'input-focus': isInputFocus}" class="conversation-compose flex align-center">
        <textarea
          v-model="newMsg.txt"
          @focus="toggleInputFocus"
          @blur="toggleInputFocus"
          class="border-bottom-input"
          placeholder="Type a message"
          autocomplete="off"
          autofocus
        />
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
export default {
  components: {
    soldier
  },
  props: {
    isChatOpen: Boolean
  },
  data() {
    return {
      msgs: [],
      newMsg: {},
      typeMsg: "",
      loading: true,
      isInputFocus: false
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
    scrollIntoView() {
      var container = this.$refs.conversationRef;
      container.scrollIntoView();
    },
    pushMsgToHistory(msg) {
      this.$emit("pushMsgToHistory", msg);
    },
    toggleInputFocus() {
      this.isInputFocus = !this.isInputFocus;
      this.$emit("onToggleInputFocus");
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
    }
  },
  sockets: {
    renderMsg(msg) {
      soundService.play("msg");
      this.$emit("showNotification");
      this.msgs.push(msg);
    }
  }
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
  .conversation {
    background-color: black;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 10;
    @media (min-width: 850px) {
      width: 24vw;
      min-width: 196px;
      border-radius: 6px;
      border-left: 2px solid darken(white, 10%);
      border-bottom: 2px solid darken(white, 10%);
    }
    width: 100vw;
  }
  .conversation-container {
    overflow: auto;
    height: calc(100vh - 65px - 52px);
    @media (min-width: 850px) {
      height: 400px;
    }
    &.input-focus {
      @media (max-width: 850px) {
        height: calc(100vh);
      }
    }
    padding: 0 15px 15px 15px;
  }

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

  .conversation-compose {
    padding: 3px 0;
    background-color: lighten(black, 10%);
    width: 100%;
    justify-content: space-evenly;
    z-index: 1;
    @media (min-width: 850px) {
      padding: 10px 0;
    }
    &.input-focus {
      position: fixed;
      bottom: 0;
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
      cursor: pointer;
    }
  }
}
</style>










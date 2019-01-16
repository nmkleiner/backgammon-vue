<template>
  <div class="chat-cmp">
    <button class="open-btn" @click="isChatOpen = !isChatOpen">
      <i class="far fa-comments"></i>
    </button>
    <div class="conversation animated" 
      :class="{'hidden': loading,'slideOutRight': isChatOpen, 'slideInRight': !isChatOpen}"
    >
      <div class="empty"></div>
      <div class="conversation-container" ref="conversationRef">
        <div v-for="(msg, idx) in msgs" :key="idx">
          <div
            class="container round"
            :class="{msgOut: nickname === msg.from, msgIn: nickname !== msg.from}"
          >
            <p class="msg">
              <soldier :color="msg.color"></soldier>
              <span class="chat-user-name">{{msg.from}}:</span>
              <br>
              {{msg.txt}}
            </p>
          </div>
        </div>
      </div>

      <form class="conversation-compose flex space-between">
        <input
          type="text"
          v-if="!hasNickname"
          v-model="nickname"
          class="input-msg"
          placeholder="Choose nickname"
        >
        <textarea
          v-else
          v-model="newMsg.txt"
          class="input-msg"
          name="input"
          placeholder="Type a message"
          autocomplete="off"
          autofocus
        ></textarea>
        <button class="send-btn" v-if="!hasNickname" @click.prevent="enterNickname">
          <i class="far fa-comment"></i>
        </button>

        <button class="send-btn" v-else @click.prevent="send">
          <i class="far fa-comment"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import ioClient from "socket.io-client";
import msgService from "../services/msg.service.js";
import soldier from "./soldier";
export default {
  components: {
    soldier
  },
  data() {
    return {
      msgs: [],
      nickname: null,
      hasNickname: false,
      newMsg: null,
      typeMsg: "",
      isChatOpen: true,
      loading: true
    };
  },
  methods: {
    send() {
      if (!this.newMsg.txt) return;
      this.$socket.emit("assignMsg", {
        msg: { ...this.newMsg, color: this.loggedInUser.color },
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
    enterNickname() {
      this.hasNickname = true;
      this.newMsg.from = this.nickname;
    }
  },
  created() {
    this.newMsg = msgService.createEmptyMsg(this.nickname);
    const room = 1;
    this.$socket.emit("chatJoined", room);
    setTimeout(() => this.loading = false,1200)
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    }
  },
  sockets: {
    renderMsg(msg) {
      this.scrollIntoView();
      this.msgs.push(msg);
      this.$nextTick(() => {
        this.scrollToEnd();
      });
    }
  }
};
</script>

<style scoped lang='scss'>
.chat-cmp {
  // margin-top: 40px;
  // display: flex;
  // width: 100%;
  // justify-content: flex-end;
  .open-btn {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 11;
    padding: 10px;
    background-color: black;
    color: white;
    border-radius: 50%;
    border: none;
    outline: 0;
    font-size: 18px;
    cursor: pointer;
  }
  .conversation {
    border-left: 2px solid darken(white,10%);
    border-bottom: 2px solid darken(white,10%);
    border-radius: 6px;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 10;
  }
  .empty {
    height: 55px;
    background-color: black;
  }

  .conversation-container {
    overflow: auto;
    background-color: black;
    @media (min-width: 850px) {
      width: 18.6vw;
      height: 400px;
    }
    width: 100vw;
    height: calc(100vh - 55px - 52px);
    padding: 0 15px 15px 15px;
    // padding-top: 40px;
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

  }

  .container::after {
    content: "";
    clear: both;
    display: table;
  }

  .msgOut {
    background-color: lighten(#25D366, 10%);
    margin: 5px 50px 0px 5px;
    &:after {
      content: ' ';
      position: absolute;
      width: 0;
      height: 0;
      left: -20px;
      right: auto;
      top: 38px;
      bottom: auto;
      border: 12px solid;
      border-color: lighten(#25D366, 10%) lighten(#25D366, 10%) transparent transparent;
    }
  }

  .msgIn {
    background-color: darken(white, 3%);
    margin: 5px 5px 0px 50vw;
    @media (min-width: 850px) {
    margin: 5px 5px 0px 50px;

    }
    &:after {
      content: ' ';
      position: absolute;
      width: 0;
      height: 0;
      left: auto;
      right: -20px;
      top: 38px;
      bottom: auto;
      border: 12px solid;
      border-color: darken(white, 3%) transparent transparent darken(white,3%);
    }
  }
    
  .round{
    border-radius: 30px;
    -webkit-border-radius: 30px;
    -moz-border-radius: 30px;
  }
  .msg {
    color: black;
    padding: 5px;
    .soldier-const {
      width: 2vw!important;
      height: 2vw!important;
      outline: 1px red;
    }
  }

  .conversation-compose {
    @media (min-width: 850px) {
      padding: 10px 20px;
    }
    padding: 3px 20px;
    background-color: black;

  }

  .chat-user-name {
    font-size: 16px;
    font-weight: bold;
  }


  .input-msg {
    @media (min-width: 850px) {
      width: 150px;
    }
    width: 40vw;
    padding: 3px;
    border-radius: 10px;
    font-size: 16px;
    &:focus {
      outline: none;
    }
  }

  .send-btn {
    padding: 7px;
    width: 46px;
    background-color: darken(#25D366, 20%);
    border: none;
    color: darken(white,15%);
    border-radius: 50%;
    outline: 0;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>










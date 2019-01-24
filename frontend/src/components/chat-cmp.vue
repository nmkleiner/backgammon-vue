<template>
  <section class="chat-cmp">
    <div class="btn-wrapper">
      <button class="open-btn" @click="toggleChat">
        <i class="far fa-times-circle" v-if="isChatOpen"></i>
        <i class="far fa-comments" v-else></i>
      </button>
      <div class="msg-notification" v-if="showNotification && !isChatOpen">
        <i class="fas fa-envelope"></i>
      </div>
    </div>
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
            class="container round"
            :class="{msgOut: nickname === msg.from, msgIn: nickname !== msg.from}"
          >
            <p class="msg">
            <img src="https://res.cloudinary.com/do6zqbr29/image/upload/w_48,h_48/v1548316876/samples/Optimized-20160428_111029.jpg"/>
            <soldier :color="msg.color"></soldier>
            <!-- https://res.cloudinary.com/demo/image/upload/w_400,h_350,c_crop,g_face/r_20,bo_5px_solid_black/l_cloudinary_icon,o_50,w_0.25,fl_relative,g_north_east,y_10,x_10/q_auto,f_auto/sample_woman.jpg -->
              <span class="chat-user-name">{{msg.from}}:</span>
              <br>
              {{msg.txt}}
            </p>
          </div>
        </div>
      </div>

      <form :class="{'input-focus': isInputFocus}" class="conversation-compose flex align-center">
        <input
          v-if="!hasNickname"
          v-model="nickname"
          @focus="isInputFocus = true"
          @blur="isInputFocus = false"
          class="input-msg"
          placeholder="Choose nickname"
          autocomplete="off"
        >
        <textarea
          v-else
          v-model="newMsg.txt"
          @focus="isInputFocus = true"
          @blur="isInputFocus = false"
          class="input-msg"
          name="input"
          placeholder="Type a message"
          autocomplete="off"
          autofocus
        />
        <button class="send-btn" v-if="!hasNickname" @click.prevent="enterNickname">
          <i class="far fa-comment"></i>
        </button>

        <button class="send-btn" v-else @click.prevent="send">
          <i class="far fa-comment"></i>
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import ioClient from "socket.io-client";
import msgService from "../services/msg.service.js";
import soundService from "../services/sound.service.js"
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
      isChatOpen: false,
      loading: true,
      isInputFocus: false,
      showNotification: false
    };
  },
  methods: {
    toggleChat() {
      this.isChatOpen = !this.isChatOpen;
      this.showNotification = false;
    },
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
      soundService.play('msg')
      this.showNotification = true
      this.msgs.push(msg);
    }
  }
};
</script>

<style scoped lang='scss'>
.chat-cmp {
  .btn-wrapper {
    position: fixed;
    z-index: 11;
    top: 10px;
    right: 10px;
    .open-btn {
      position: relative;
      padding: 10px;
      background-color: black;
      color: white;
      border-radius: 50%;
      border: none;
      outline: 0;
      font-size: 18px;
      cursor: pointer;
      &.input-focus {
        visibility: hidden;
        @media (min-width: 850px) {
          visibility: visible;
        }
      }
    }

    .msg-notification {
      color: lighten(#25D366, 10%);
      position: absolute;
      top: 28px;
      left: 28px;
    }
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
    height: 65px;
    background-color: black;
    &.input-focus {
      height: 0;
      @media (min-width: 850px) {
      height: 65px;
      }
    }
  }

  .conversation-container {
    overflow: auto;
    background-color: black;
    @media (min-width: 850px) {
      width: 18.6vw;
      height: 400px;
    }
    width: 100vw;
    height: calc(100vh - 65px - 52px);
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
    img {
      border-radius: 50%;
    }
    .chat-user-name {
      font-size: 16px;
      font-weight: bold;
    }

  }

  .msgOut {
    background-color: lighten(#25D366, 10%);
    margin: 5px 50px 0px 5px;
    &::after {
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
    padding: 3px 0;
    background-color: lighten(black,10%);
    width: 100%;
    justify-content: space-evenly;
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
      .input-msg {
          outline: none;
      }
    }

    .input-msg {
      background-color: transparent;
      border: none;
      border-bottom: darken(#25D366, 20%) 1px solid;
      color: white;
      width: 70vw;
      padding: 3px;
      font-size: 16px;
      @media (min-width: 850px) {
        width: 150px;
      }
    }
    textarea.input-msg {
      height: unset;
      @media (min-width: 500px) {
        height: 80vh;
      }
      @media (min-width: 850px) {
        height: unset;
      }
    }

    .send-btn {
      padding: 7px;
      width: 46px;
      height: 46px;
      background-color: darken(#25D366, 20%);
      border: none;
      color: darken(white,15%);
      border-radius: 50%;
      outline: 0;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
</style>










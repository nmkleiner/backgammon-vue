import ioClient from "socket.io-client";


export default {
    joinGame
}

var socket = null;
connectSocket();

function connectSocket() {
    socket = ioClient('http://localhost:3000');
    
    // socket.on('chat history', (historyMsgs) => {
    //     msgs.push(...historyMsgs)
    // });
    
    // socket.on('chat newMsg', (msg) => {
    //     // JIF
    //     if (nickName === msg.from) msgs[msgs.length - 1].processed = true;
    //     else msgs.push(msg);
    // });
    
}

const send = (msg) => {
    msgs.push(msg);
    socket.emit('chat msg', msg);
}

function joinGame() {
    const room = 1
    socket.emit("gameJoined", room);
}
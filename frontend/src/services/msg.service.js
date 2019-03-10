import ioClient from 'socket.io-client'

const msgs = [];



const getMsgs = () => {
    return msgs;
}


function createEmptyMsg(nickname = 'john doe', txt = '') {
    return { txt, from: nickname };
}


function roomJoin(roomName) {
    socket.emit('chat room-joined', roomName)
}

function disconnectFromRoom(){
    socket.emit('disconnect');
}

export default {
    getMsgs,
    createEmptyMsg,
    roomJoin,
    disconnectFromRoom
}



function lorem(size = 5) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

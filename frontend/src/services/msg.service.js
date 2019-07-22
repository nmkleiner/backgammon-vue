
function createEmptyMsg(nickname = 'john doe', txt = '') {
    return { txt, from: nickname };
}

export default {
    createEmptyMsg,
}

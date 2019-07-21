export default {
    play,
    load
}

const sounds = {
    dice: 'mp3',
    move: 'wav',
    eat: 'wav',
    msg: 'wav',
    yourTurn: 'wav',
    win: 'wav'
};

function load() {
    for (let key in sounds) {
        sounds[key] = new Audio(require('../../public/audio/' + key + '.' + sounds[key]))
    }
}

function play(fileName) {
    sounds[fileName].play()
}

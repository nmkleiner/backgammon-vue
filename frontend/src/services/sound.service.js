export default {
    play,
    load
}

var sounds = {dice: '', click: '', eat: ''}

function load() {
    sounds.dice = new Audio(require('../../public/audio/cubes.mp3'))
    sounds.click = new Audio(require('../../public/audio/click.wav'))
    sounds.eat = new Audio(require('../../public/audio/eat.wav'))
}

function play(fileName) {
    sounds[fileName].play()
}
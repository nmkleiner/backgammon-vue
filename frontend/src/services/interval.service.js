export default {
    strongClearInterval
}

function strongClearInterval(interval) {
    clearInterval(interval);
    interval = null;
}

const text = document.getElementById("text");
var port = browser.runtime.connectNative("gamepadremapper.r01");

function start() {
    port.postMessage({"start": true, "stop": false, "config": "test"})
}

function stop() {
    port.postMessage({"start": false, "stop": true, "config": "test"})
}

document.getElementById("button").addEventListener("click", start);
document.getElementById("button2").addEventListener("click", stop)
port.onMessage.addListener(res => {
    console.log(res);
});

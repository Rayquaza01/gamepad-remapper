function onMessage(message) {
    console.log(message);
}

function sendMessage(message) {
    if (message.action === "start") {
        port.postMessage({
            action: "start",
            config: message.config
        });
    } else if (message.action === "stop") {
        port.postMessage({
            action: "stop"
        });
    } else if (message.action === "updateConsts") {
        port.postMessage({
            action: "updateConsts",
            config: message.config
        });
    }
}

const port = browser.runtime.connectNative("gamepadremapper.r01");
port.onMessage.addListener(onMessage);
browser.runtime.onMessage.addListener(sendMessage);

function sendMessage(message) {
    browser.runtime.sendNativeMessage("gamepadremapper.r01", {
        type: "typeString",
        string: message.split("")
    });
}

browser.runtime.onMessage.addListener(sendMessage);

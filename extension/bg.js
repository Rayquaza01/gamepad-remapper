function sendMessage(message) {
    browser.runtime.sendNativeMessage("gamepadremapper.r01", {
        type: "typeString",
        string: " ".split("")
    });
}

browser.runtime.onMessageRecived(sendMessage);

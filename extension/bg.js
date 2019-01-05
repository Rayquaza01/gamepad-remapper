function sendMessage(message) {
    browser.runtime.sendNativeMessage("gamepadremapper.r01", message);
}

browser.runtime.onMessage.addListener(sendMessage);

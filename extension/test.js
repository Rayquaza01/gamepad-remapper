var port = browser.runtime.connectNative("gamepad_remapper");
const text = document.getElementById("text");

// function onResponse(response) {
//     console.log(response);
// }

// function onError(error) {
//     console.log(error);
// }

async function main() {
    text.focus();
    port.postMessage(["a", "b", "c", "left", "d"]);
    // browser.runtime.sendNativeMessage("gamepad_remapper", ["a", "b", "c", "left", "d"]).then(onResponse, onError);
}

document.getElementById("button").addEventListener("click", main);
port.onMessage.addListener(res => {
    console.log(res);
})

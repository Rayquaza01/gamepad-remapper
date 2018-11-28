const text = document.getElementById("text");
var port = browser.runtime.connectNative("gamepadremapper.r01");

// function onResponse(response) {
//     console.log(response);
// }

// function onError(error) {
//     console.log(error);
// }

async function main() {
    text.focus();
    port.postMessage({
        type: "typeString",
        string: ["a", "b", "c", "left", "d"]
    });
    // browser.runtime.sendNativeMessage("gamepadremapper.r01", ["a", "b", "c", "left", "d"]).then(onResponse, onError);
}

document.getElementById("button").addEventListener("click", main);
port.onMessage.addListener(res => {
    console.log(res);
});

// const test_b = document.getElementById("test");
// const test_a = document.getElementById("test_a");

console.log("Gamepad Remapper Running");

function main(oldButtons = [], oldAxes = []) {
    let gamepad = navigator.getGamepads()[0];
    let buttons = gamepad.buttons.map(item => item.pressed);
    let axes = gamepad.axes.map(item => Math.round(item));
    // test_b.innerText = JSON.stringify(buttons);
    // test_a.innerText = JSON.stringify(axes);
    sendEvent(buttons, oldButtons, "button");
    sendEvent(axes, oldAxes, "axis");
    requestAnimationFrame(main.bind(null, buttons, axes));
}

function sendEvent(current, old, type) {
    current
        .filter((item, index) => item !== old[index])
        .forEach((item, index) => {
            console.log(type);
            switch (type) {
                case "button":
                    createEvent(document, "gamepadpressed", {
                        button: index,
                        pressed: current[index]
                    });
                    break;
                case "axis":
                    createEvent(document, "gamepadaxis", {
                        axis: index,
                        value: current[index]
                    });
                    break;
            }
        });
}

function createEvent(target, eventType, detail) {
    let event = new CustomEvent(eventType, {
        detail: detail
    });
    target.dispatchEvent(event);
}

function event(e) {
    console.log(e.detail);
    console.log(e.detail.pressed);
    browser.runtime.sendMessage({
        type: "typeString",
        string: " ".split("")
    });
    if (e.detail.pressed) {
        console.log(e.detail.pressed);
    }
}

function axisEvent(e) {
    console.log(e.detail);
}

document.addEventListener("gamepadpressed", event);
document.addEventListener("gamepadaxis", axisEvent);
window.addEventListener("gamepadconnected", main);

// const test_b = document.getElementById("test");
// const test_a = document.getElementById("test_a")

console.log("Gamepad Remapper Running")
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
    for (let i = 0; i < current.length; i++) {
        if (old.hasOwnProperty(i) && current.hasOwnProperty(i)) {
            if (current[i] !== old[i]) {
                switch (type) {
                    case "button":
                        createEvent(document, "gamepadpressed", {
                            button: i,
                            pressed: current[i]
                        });
                        break;
                    case "axis":
                        createEvent(document, "gamepadaxis", {
                            axis: i,
                            value: current[i]
                        });
                        break;
                }
            }
        }
    }
}

function createEvent(target, eventType, detail) {
    let event = new CustomEvent(eventType, {
        detail: detail
    });
    target.dispatchEvent(event);
}

function event(e) {
    console.log(e.detail);
    console.log(e.detail.pressed)
    if (e.detail.pressed) {
        console.log("SEND KEYPRESS")
        let event = new Event("keydown");
        event.key = " ";
        event.keyCode = " ".charCodeAt(0);
        event.which = event.keycode;
        event.bubbles = true;
        event.repeat = true;
        console.log(document.activeElement)
        document.activeElement.dispatchEvent(event);
    } else {
        let key = new KeyboardEvent("keyup", {
            key: " "
        });
        document.activeElement.dispatchEvent(key);
    }
}

function axisEvent(e) {
    console.log(e.detail);
}

document.addEventListener("gamepadpressed", event);
document.addEventListener("gamepadaxis", axisEvent);
window.addEventListener("gamepadconnected", main);

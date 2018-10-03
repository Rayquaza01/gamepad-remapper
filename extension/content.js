const test = document.getElementById("test");

function main(oldButtons = []) {
    let gamepad = navigator.getGamepads()[0];
    let buttons = gamepad.buttons.map(item => item.pressed);
    test.innerText = JSON.stringify(buttons);
    for (let i = 0; i < buttons.length; i++) {
        if (oldButtons.hasOwnProperty(i)) {
            if (buttons[i] !== oldButtons[i]) {
                sendGamepadEvent(i, buttons[i]);
            }
        }
    }
    requestAnimationFrame(main.bind(null, buttons));
}

function sendGamepadEvent(i, pressed) {
    let event = new CustomEvent("gamepadpressed", {
        detail: {
            button: i,
            pressed: pressed
        }
    });
    document.dispatchEvent(event);
}

function event(e) {
    console.log(e.detail);
}

document.addEventListener("gamepadpressed", event);
window.addEventListener("gamepadconnected", main);

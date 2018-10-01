function main() {
    let gamepad = navigator.getGamepads()[0];
    for (let i = 0; i < gamepad.buttons.length; i++) {
        if (gamepad.buttons[i].pressed) {
            let event = new CustomEvent("gamepadpressed", {
                button: i,
                pressed: gamepad.buttons[i].pressed
            });
            document.dispatchEvent(event);
        }
    }
    requestAnimationFrame(main);
}

function event(e) {
    console.log(e);
}

document.addEventListener("gamepadpressed", event);
window.addEventListener("gamepadconnected", main);

/* eslint no-unused-vars: 0 */
const BUTTONS = {
    FACEBUTTONS: ["fup", "fdown", "fleft", "fright"],
    DPAD: ["up", "down", "left", "right"],
    SHOULDER: ["L", "R", "ZL", "ZR"],
    MENU: ["start", "select"],
    STICKS: ["1X", "1Y", "2X", "2Y"]
};

function buildPage(buttons) {
    Object.keys(BUTTONS).forEach(type => {
        let typeCont = document.getElementById("container-" + type);
    });
}

async function main() {
    let res = await browser.storage.local.get("buttons");
}

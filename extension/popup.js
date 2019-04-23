/* globals findActive */
const modes = document.getElementById("modes");
const start_btn = document.getElementById("start");
const stop_btn = document.getElementById("stop");

function changeActive(e) {
    document.getElementsByClassName("active")[0].className = "";
    e.target.className = "active";
}

async function main() {
    let res = await browser.storage.local.get();

    // disable buttons based on current state
    if (!res.hasOwnProperty("state") || res.state === "stopped") {
        stop_btn.disabled = true;
        start_btn.disabled = false;
    } else if (res.state === "started") {
        start_btn.disabled = true;
        stop_btn.disabled = false;
    }

    // find which config should be active
    let active = await findActive();
    // if not disabled, but active is different from current mode
    if (res.mode !== null && active.name !== res.mode) {
        active = res.options_json.find(item => item.name === res.mode);
    }

    // create a list of configs to select from
    for (let config of res.options_json) {
        let item = document.createElement("li");
        if (config.name === active.name) {
            item.className = "active";
        }
        item.innerText = config.name;
        item.addEventListener("click", changeActive);
        modes.appendChild(item);
    }
}

async function start() {
    let res = await browser.storage.local.get();
    // start mapping process with selected config
    browser.runtime.sendMessage({
        action: "start",
        config: res.options_json.find(
            item => item.name === document.getElementsByClassName("active")[0].innerText
        )
    });
    // toggle disabled buttons
    start_btn.disabled = true;
    stop_btn.disabled = false;
}

function stop() {
    // stop mapping process
    browser.runtime.sendMessage({ action: "stop" });
    // toggle disabled buttons
    start_btn.disabled = false;
    stop_btn.disabled = true;
}

// event listeners
document
    .getElementById("settings")
    .addEventListener("click", () => browser.runtime.openOptionsPage());
start_btn.addEventListener("click", start);
stop_btn.addEventListener("click", stop);
document.addEventListener("DOMContentLoaded", main);

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

    if (!res.hasOwnProperty("state") || res.state === "stopped") {
        stop_btn.disabled = true;
        start_btn.disabled = false;
    } else if (res.state === "started") {
        start_btn.disabled = true;
        stop_btn.disabled = false;
    }

    let active = await findActive();
    console.log(res.mode, active.name);
    if (res.mode !== null && active.name !== res.mode) {
        active = res.options_json.find(item => item.name === res.mode);
    }

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
    browser.runtime.sendMessage({
        action: "start",
        config: res.options_json.find(
            item => item.name === document.getElementsByClassName("active")[0].innerText
        )
    });
    start_btn.disabled = true;
    stop_btn.disabled = false;
}

function stop() {
    browser.runtime.sendMessage({ action: "stop" });
    start_btn.disabled = false;
    stop_btn.disabled = true;
}

document
    .getElementById("settings")
    .addEventListener("click", () => browser.runtime.openOptionsPage());
start_btn.addEventListener("click", start);
stop_btn.addEventListener("click", stop);
document.addEventListener("DOMContentLoaded", main);

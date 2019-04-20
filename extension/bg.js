/* globals jsyaml findActive */
function defaultValues(object, settings) {
    for (let key in settings) {
        if (!object.hasOwnProperty(key)) {
            object[key] = settings[key];
        }
    }
    return object;
}

async function setOpts() {
    let sample = await (await fetch(
        browser.extension.getURL("sample_config.yaml")
    )).text();
    let res = await browser.storage.local.get();
    res = defaultValues(res, {
        options_yaml: sample,
        options_json: jsyaml.safeLoad(sample),
        notifications: true,
        change_with_tabs: true,
        state: "stopped",
        mode: null
    });
    browser.storage.local.set(res);
}

async function tabChange() {
    let res = await browser.storage.local.get();
    let active = await findActive();
    if (res.change_with_tabs) {
        if (active.name !== res.mode && res.mode !== null) {
            port.postMessage({ action: "stop" });
            port.postMessage({ action: "start", config: active });
        }
    }
}

async function onMessage(message) {
    let res = await browser.storage.local.get();
    if (typeof message === "object") {
        browser.storage.local.set(message);
        if (res.notifications) {
            browser.notifications.create({
                type: "basic",
                title: "Gamepad Remapper is " + message.state,
                message: "Current mode is " + message.mode
            });
        }
    } else {
        console.log(message);
    }
}

function sendMessage(message) {
    if (message.action === "start") {
        port.postMessage({
            action: "start",
            config: message.config
        });
    } else if (message.action === "stop") {
        port.postMessage({
            action: "stop"
        });
    } else if (message.action === "restart") {
        port.postMessage({
            action: "restart",
            config: message.config
        });
    } else if (message.action === "tester") {
        port.postMessage({
            action: "tester"
        });
    }
}

const port = browser.runtime.connectNative("gamepadremapper.r01");
port.onMessage.addListener(onMessage);
browser.tabs.onActivated.addListener(tabChange);
browser.tabs.onUpdated.addListener(tabChange);
browser.runtime.onMessage.addListener(sendMessage);
browser.runtime.onStartup.addListener(() =>
    browser.storage.local.set({ mode: null, state: "stopped" })
);
browser.runtime.onInstalled.addListener(setOpts);

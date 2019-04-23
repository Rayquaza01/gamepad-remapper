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
    // get sample config
    let sample = await (await fetch(
        browser.extension.getURL("sample_config.yaml")
    )).text();
    let res = await browser.storage.local.get();
    // store default values into settings
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
    // change mode based on URL of tab, if enabled
    let res = await browser.storage.local.get();
    if (res.change_with_tabs) {
        let active = await findActive();
        if (active.name !== res.mode && res.mode !== null) {
            port.postMessage({ action: "stop" });
            port.postMessage({ action: "start", config: active });
        }
    }
}

async function onMessage(message) {
    if (typeof message === "object") {
        let res = await browser.storage.local.get();
        // store message from native app
        browser.storage.local.set(message);
        if (res.notifications) {
            // create notification with state and mode info if enabled
            browser.notifications.create({
                type: "basic",
                title: "Gamepad Remapper is " + message.state,
                message: "Current mode is " + message.mode
            });
        }
    }
}

function sendMessage(message) {
    if (message.action === "start") {
        // start mapping process
        port.postMessage({
            action: "start",
            config: message.config
        });
    } else if (message.action === "stop") {
        // stop mapping process
        port.postMessage({
            action: "stop"
        });
    } else if (message.action === "tester") {
        // open gamepad tester
        port.postMessage({
            action: "tester"
        });
    }
}

// open native app
const port = browser.runtime.connectNative("gamepadremapper.r01");
// listen for messages from native app
port.onMessage.addListener(onMessage);
// set default mode, state
browser.runtime.onStartup.addListener(() =>
    browser.storage.local.set({ mode: null, state: "stopped" })
);
// event listeners
browser.tabs.onActivated.addListener(tabChange);
browser.tabs.onUpdated.addListener(tabChange);
browser.runtime.onMessage.addListener(sendMessage);
browser.runtime.onInstalled.addListener(setOpts);

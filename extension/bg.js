/* globals jsyaml */
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
        options_json: jsyaml.safeLoad(sample)
    });
    browser.storage.local.set(res);
}

function onMessage(message) {
    console.log(message);
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
browser.runtime.onMessage.addListener(sendMessage);
browser.runtime.onInstalled.addListener(setOpts);

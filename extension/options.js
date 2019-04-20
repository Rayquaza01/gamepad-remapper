/* globals jsyaml */
const options_yaml = document.getElementById("options_yaml");
const options_json = document.getElementById("options_json");
const opt_notifications = document.getElementById("notifications");
const opt_change_with_tabs = document.getElementById("change_with_tabs");

function launchTester() {
    browser.runtime.sendMessage({ action: "tester" });
}

function tabSpace(e) {
    // from https://stackoverflow.com/questions/6637341/use-tab-to-indent-in-textarea/14166052#14166052
    if (e.key === "Tab") {
        e.preventDefault();
        let start = this.selectionStart;
        this.value =
            this.value.substring(0, start) +
            "  " +
            this.value.substring(this.selectionEnd);
        this.selectionEnd = start + 2;
    }
}

async function load() {
    let res = await browser.storage.local.get();
    options_yaml.value = res.options_yaml;
    options_json.value = JSON.stringify(jsyaml.safeLoad(res.options_yaml), null, 4);
    opt_notifications.value = JSON.stringify(res.notifications);
    opt_change_with_tabs.value = JSON.stringify(res.change_with_tabs);
}

async function save() {
    let sample = await (await fetch(
        browser.extension.getURL("sample_config.yaml")
    )).text();
    options_json.value = JSON.stringify(jsyaml.safeLoad(options_yaml.value), null, 4);
    browser.storage.local.set({
        options_yaml: options_yaml.value || sample,
        options_json: JSON.parse(options_json.value) || jsyaml.safeLoad(sample)
    });
}

// save selectors
opt_notifications.addEventListener("change", () =>
    browser.storage.local.set({ notifications: JSON.parse(opt_notifications.value) })
);
opt_change_with_tabs.addEventListener("change", () =>
    browser.storage.local.set({
        change_with_tabs: JSON.parse(opt_change_with_tabs.value)
    })
);

options_yaml.addEventListener("keydown", tabSpace);
document.getElementById("save").addEventListener("click", save);
document.getElementById("open").addEventListener("click", launchTester);
document.addEventListener("DOMContentLoaded", load);

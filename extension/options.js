/* globals jsyaml */
const options_yaml = document.getElementById("options_yaml");
const options_json = document.getElementById("options_json");

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
    let res = await browser.storage.local.get("options_yaml");
    options_yaml.value = res.options_yaml;
    options_json.value = JSON.stringify(jsyaml.safeLoad(res.options_yaml), null, 4);
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

options_yaml.addEventListener("keydown", tabSpace);
document.getElementById("save").addEventListener("click", save);
document.getElementById("open").addEventListener("click", launchTester);
document.addEventListener("DOMContentLoaded", load);

async function findActive() {
    // find the active mode based on current URL and match property
    let res = await browser.storage.local.get();
    let tab = (await browser.tabs.query({ active: true, currentWindow: true }))[0];
    let active = res.options_json.find(
        item => item.hasOwnProperty("match") && tab.url.match(new RegExp(item.match))
    );
    if (active === undefined || !res.change_with_tabs) {
        active = res.options_json.find(item => item.name === "Default");
    }
    return active;
}

function zip(arr1, arr2) {
	let val = {};
	if (
		arr1.length === arr2.length && // both same length
	    arr1.every((item, index) => arr1.indexOf(item) === index) // keys contain only unique values
	) {
		for (let i = 0; i < arr1.length; i++) {
			val[arr1[i]] = arr2[i];
		}
		return val;
	} else {
		return false;
	}
}

async function restoreSettings() {
	let res = await browser.storage.local.get("options");
	Object.keys(res.options).forEach(item => document.getElementById("opt-" + item).value = res[item])
}

async function saveSettings() {
	let res = await browser.storage.local.get("options");
	let settings = Array.from(document.getElementsByClassName("opt"));
	let keys = Object.keys(res.options);
	let vals = settings.map(item => res.options[item.id.substring(4)]);
	await browser.storage.local.set({ options: zip(keys, vals) });
}

function main() {
	restoreSettings();
    // main
}

document.getElementsById("settings").addEventListener("input", saveSettings);
document.addEventListener("DOMContentLoaded", main);

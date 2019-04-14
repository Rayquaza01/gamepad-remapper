/* no-unused-vars: 0 */
const INI = {
    parse: (raw, comment = "#") => {
        let obj = {};
        let state = "";
        for (let row of raw.split("\n")) {
            if (row.match(/^\[.+]$/)) {
                // set which section is being written
                state = row.substring(1, row.length - 1);
                obj[state] = {};
            } else if (row.startsWith(comment)) {
                // ignore comments
                continue;
            } else if (row.indexOf("=") > -1) {
                // write variable
                let split = row.split("=");
                obj[state][split[0]] = split[1];
            }
        }
        return obj;
    },
    stringify: obj => {
        let ini = "";
        // loop through sections
        for (let head of Object.keys(obj)) {
            // add section to ini
            ini += "[" + head + "]\n";
            // loop through keys
            for (let key of Object.keys(obj[head])) {
                // add key, value to ini
                ini += key + "=" + obj[head][key] + "\n";
            }
        }
        // return, removing trailing line break
        return ini.replace(/\n$/, "");
    }
};

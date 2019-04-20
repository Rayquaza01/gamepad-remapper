let map = {
    "buttons": {
        "1": ["up", "single"],
        "0": ["z", "single"],
        "4": ["c", "single"],
        "5": ["c", "single"]
    },
    "axes": {
        "0": {
            "neg": ["left", "repeat"],
            "pos": ["right", "repeat"]
        },
        "1": {
            "neg": ["space", "single"],
            "pos": ["down", "repeat"]
        }
    },
    "hats": {
        "0": {
            "x": {
                "neg": ["left", "repeat"],
                "pos": ["right", "repeat"]
            },
            "y": {
                "pos": ["space", "single"],
                "neg": ["down", "repeat"]
            }
        }
    }
};


function start() {
    browser.runtime.sendMessage({ action: "start", config: map });
}

function stop() {
    browser.runtime.sendMessage({ action: "stop" });
}

document.getElementById("start").addEventListener("click", start);
document.getElementById("stop").addEventListener("click", stop);

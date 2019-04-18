#!/usr/bin/python3 -u
import nativemessaging as nm
import threading
import gpmap


if __name__ == "__main__":
    gvars = {}
    while True:
        message = nm.get_message()
        if message["action"] == "start":
            gvars["kill"] = threading.Event()
            gvars["t"] = threading.Thread(target=gpmap.main, args=(gvars["kill"], message["config"]))
            gvars["t"].start()
        elif message["action"] == "stop":
            gvars["kill"].set()
            gvars["t"].join()
        nm.send_message(nm.encode_message("OK"))

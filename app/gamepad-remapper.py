#!/usr/bin/python3 -u
import nativemessaging as nm
import subprocess


if __name__ == "__main__":
    proc = None
    while True:
        message = nm.get_message()
        if message["action"] == "start":
            if proc is None or proc.poll() is not None:
                proc = subprocess.Popen(["./gpmap.py", message["config"]])
        elif message["action"] == "stop":
            if proc is not None:
                proc.kill()
        nm.send_message(nm.encode_message("OK"))

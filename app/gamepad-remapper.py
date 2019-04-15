#!/usr/bin/python3 -u
import nativemessaging as nm
import subprocess


proc = None
if __name__ == "__main__":
    while True:
        message = nm.get_message()
        if message["start"]:
            proc = subprocess.Popen(["./gpmap.py", message["config"]])
        if message["stop"]:
            proc.terminate()

#!/usr/bin/python3 -u
import nativemessaging as nm
import os
import threading
import subprocess
import sys
import json
import pyautogui
os.environ["PYGAME_HIDE_SUPPORT_PROMPT"] = ""
import pygame


dirs = {"neg": -1, "pos": 1}
axes = {"x": 0, "y": 1}


def sendKeyPress(key):
    if type(key) is list:
        pyautogui.hotkey(*key)
    else:
        pyautogui.press(str(key))


def mapping(stop=None, map={"buttons": {}, "axes": {}, "hats": {}}):
    if "buttons" not in map:
        map["buttons"] = {}
    if "axes" not in map:
        map["axes"] = {}
    if "hats" not in map:
        map["hats"] = {}
    pygame.joystick.init()
    pygame.display.init()
    clock = pygame.time.Clock()
    js = pygame.joystick.Joystick(0)
    js.init()
    while stop is None or not stop.is_set():
        # use events for single button presses
        for event in pygame.event.get():
            if event.type == pygame.JOYBUTTONDOWN:
                id = str(event.button)
                if id in map["buttons"] and map["buttons"][id][1] == "single":
                    if js.get_button(event.button) == 1:
                        sendKeyPress(map["buttons"][id][0])
            if event.type == pygame.JOYAXISMOTION:
                id = str(event.axis)
                if id in map["axes"]:
                    for dir in map["axes"][id].keys():
                        if map["axes"][id][dir][1] == "single":
                            if round(event.value) == dirs[dir] and abs(round(event.value) - event.value) <= .001:
                                sendKeyPress(map["axes"][id][dir][0])
            if event.type == pygame.JOYHATMOTION:
                id = str(event.hat)
                if id in map["hats"]:
                    for axis in map["hats"][id]:
                        for dir in map["hats"][id][axis]:
                            if map["hats"][id][axis][dir][1] == "single":
                                if event.value[axes[axis]] == dirs[dir]:
                                    sendKeyPress(map["hats"][id][axis][dir][0])
        # use loop for repeating
        for button in map["buttons"].keys():
            if map["buttons"][button][1] == "repeat":
                if js.get_button(int(button)) == 1:
                    sendKeyPress(map["buttons"][button][0])
        for axis in map["axes"].keys():
            for dir in map["axes"][axis]:
                if map["axes"][axis][dir][1] == "repeat":
                    if round(js.get_axis(int(axis))) == dirs[dir]:
                        sendKeyPress(map["axes"][axis][dir][0])
        for hat in map["hats"].keys():
            for axis in map["hats"][hat]:
                for dir in map["hats"][hat][axis]:
                    if map["hats"][hat][axis][dir][1] == "repeat":
                        if js.get_hat(int(hat))[axes[axis]] == dirs[dir]:
                            sendKeyPress(map["hats"][hat][axis][dir][0])
        clock.tick(60)


if __name__ == "__main__":
    if "gamepad-remapper@r01" in sys.argv:
        gvars = {}
        while True:
            message = nm.get_message()
            if message["action"] == "start":
                gvars["kill"] = threading.Event()
                gvars["t"] = threading.Thread(target=mapping, args=(gvars["kill"], message["config"]))
                gvars["t"].start()
                nm.send_message(nm.encode_message({"state": "started", "mode": message["config"]["name"]}))
            elif message["action"] == "stop":
                gvars["kill"].set()
                gvars["t"].join()
                nm.send_message(nm.encode_message({"state": "stopped", "mode": None}))
            elif message["action"] == "tester":
                with open(os.devnull, "w") as fp:
                    subprocess.Popen("./test.py", stdout=fp)
                nm.send_message(nm.encode_message("LAUNCHED TEST"))
    else:
        print("GAMEPAD REMAPPER")
        if len(sys.argv) > 1 and os.path.isfile(sys.argv[1]):
            with open(sys.argv[1], "r") as f:
                map = json.loads(f.read())
        else:
            map = json.loads(input("Please provide a config file: "))
        for key in map:
            print(key)
        config = input("Choose your config: ")
        mapping(None, map[config])

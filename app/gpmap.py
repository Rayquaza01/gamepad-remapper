#!/usr/bin/env python3
import pygame
import pyautogui
import json
import urllib.parse
import sys
import math


dirs = {"neg": -1, "pos": 1}
axes = {"x": 0, "y": 1}


def main():
    # map = json.loads(urllib.parse.unquote_plus(sys.argv[1]))
    map = {
        "buttons": {
            "0": ["left", "repeat"],
            "1": ["right", "repeat"]
        },
        "axes": {
            "0": {
                "neg": ["left", "single"],
                "pos": ["right", "single"]
            }
        },
        "hats": {
            "0": {
                "x": {
                    "neg": ["left", "repeat"],
                    "pos": ["right", "repeat"]
                }
            }
        }
    }
    pygame.init()
    pygame.mixer.quit()
    js = pygame.joystick.Joystick(0)
    js.init()
    while True:
        # use events for single button presses
        for event in pygame.event.get():
            if event.type == pygame.JOYBUTTONDOWN:
                id = str(event.button)
                if id in map["buttons"] and map["buttons"][id][1] == "single":
                    if js.get_button(event.button) == 1:
                        pyautogui.press(map["buttons"][id][0])
            if event.type == pygame.JOYAXISMOTION:
                id = str(event.axis)
                if id in map["axes"]:
                    for dir in map["axes"][id].keys():
                        if map["axes"][id][dir][1] == "single":
                            if math.floor(event.value) == dirs[dir] and abs(event.value) > .9:
                                pyautogui.press(map["axes"][id][dir][0])
            if event.type == pygame.JOYHATMOTION:
                id = str(event.hat)
                if id in map["hats"]:
                    for axis in map["hats"][id]:
                        for dir in map["hats"][id][axis]:
                            if map["hats"][id][axis][dir][1] == "single":
                                if event.value[axes[axis]] == dirs[dir]:
                                    pyautogui.press(map["hats"][id][axis][dir][0])
        # use loop for repeating
        for button in map["buttons"].keys():
            if map["buttons"][button][1] == "repeat":
                if js.get_button(int(button)) == 1:
                    pyautogui.press(map["buttons"][button][0])
        for axis in map["axes"].keys():
            for dir in map["axes"][axis]:
                if map["axes"][axis][dir][1] == "repeat":
                    if round(js.get_axis(int(axis))) == dirs[dir]:
                        pyautogui.press(map["axes"][axis][dir][0])
        for hat in map["hats"].keys():
            for axis in map["hats"][hat]:
                for dir in map["hats"][hat][axis]:
                    if map["hats"][hat][axis][dir][1] == "repeat":
                        if js.get_hat(int(hat))[axes[axis]] == dirs[dir]:
                            pyautogui.press(map["hats"][hat][axis][dir][0])
    pygame.time.Clock(60)


if __name__ == "__main__":
    main()

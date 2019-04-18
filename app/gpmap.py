#!/usr/bin/env python3
import pyautogui
# prevent pygame from breaking web-ext
import os
os.environ["PYGAME_HIDE_SUPPORT_PROMPT"] = ""
import pygame

dirs = {"neg": -1, "pos": 1}
axes = {"x": 0, "y": 1}


def main(stop=None, map={"buttons": {}, "axes": {}, "hats": {}}):
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
                        pyautogui.typewrite([map["buttons"][id][0]])
            if event.type == pygame.JOYAXISMOTION:
                id = str(event.axis)
                if id in map["axes"]:
                    for dir in map["axes"][id].keys():
                        if map["axes"][id][dir][1] == "single":
                            if round(event.value) == dirs[dir] and abs(round(event.value) - event.value) <= .001:
                                pyautogui.typewrite([map["axes"][id][dir][0]])
            if event.type == pygame.JOYHATMOTION:
                id = str(event.hat)
                if id in map["hats"]:
                    for axis in map["hats"][id]:
                        for dir in map["hats"][id][axis]:
                            if map["hats"][id][axis][dir][1] == "single":
                                if event.value[axes[axis]] == dirs[dir]:
                                    pyautogui.typewrite([map["hats"][id][axis][dir][0]])
        # use loop for repeating
        for button in map["buttons"].keys():
            if map["buttons"][button][1] == "repeat":
                if js.get_button(int(button)) == 1:
                    pyautogui.typewrite([map["buttons"][button][0]])
        for axis in map["axes"].keys():
            for dir in map["axes"][axis]:
                if map["axes"][axis][dir][1] == "repeat":
                    if round(js.get_axis(int(axis))) == dirs[dir]:
                        pyautogui.typewrite([map["axes"][axis][dir][0]])
        for hat in map["hats"].keys():
            for axis in map["hats"][hat]:
                for dir in map["hats"][hat][axis]:
                    if map["hats"][hat][axis][dir][1] == "repeat":
                        if js.get_hat(int(hat))[axes[axis]] == dirs[dir]:
                            pyautogui.typewrite([map["hats"][hat][axis][dir][0]])
        clock.tick(60)


if __name__ == "__main__":
    main()

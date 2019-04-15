#!/usr/bin/env python3
import pygame
import pyautogui
import json
import urllib.parse
import sys


def main():
    # map = json.loads(urllib.parse.unquote_plus(sys.argv[1]))
    map = {"0": [["left"], "repeat"], "1": [["right"], "repeat"]}
    pygame.init()
    pygame.mixer.quit()
    js = pygame.joystick.Joystick(0)
    js.init()
    while True:
        # use events for single button presses
        for event in pygame.event.get():
            if event.type == pygame.JOYBUTTONDOWN:
                b_id = str(event.button)
                if b_id in map and map[b_id][1] == "single":
                    if js.get_button(event.button) == 1:
                        pyautogui.typewrite(map[b_id][0])
        # use loop for repeating
        for button in map.keys():
            if map[button][1] == "repeat":
                if js.get_button(int(button)) == 1:
                    pyautogui.typewrite(map[button][0])
    pygame.time.Clock(60)


if __name__ == "__main__":
    main()

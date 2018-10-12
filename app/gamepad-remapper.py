#!/usr/bin/env python3 -u
import nativemessaging
import pyautogui


if __name__ == "__main__":
    while True:
        message = nativemessaging.get_message()
        if type(message) is list:
            pyautogui.typewrite(message)
            nativemessaging.send_message(nativemessaging.encode_message({"keystrokes": message}))

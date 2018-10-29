#!/usr/bin/env python3 -u
import nativemessaging
import pyautogui


if __name__ == "__main__":
    while True:
        message = nativemessaging.get_message()
        if type(message) is dict:
            if message["type"] == "typeString":
                pyautogui.typewrite(message["string"])
                nativemessaging.send_message(nativemessaging.encode_message({
                    "response": "OK"
                }))
            else:
                nativemessaging.send_message(nativemessaging.encode_message({
                    "response": "INVALID"
                }))
        else:
            nativemessaging.send_message(nativemessaging.encode_message({
                "response": "INVALID"
            }))

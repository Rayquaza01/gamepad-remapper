#!/usr/bin/python3 -u
import nativemessaging as nm
import pyautogui


if __name__ == "__main__":
    while True:
        message = nm.get_message()
        if type(message) is dict:
            if message["type"] == "typeString":
                pyautogui.typewrite(message["string"])
                nm.send_message(nm.encode_message({
                    "response": "OK"
                }))
            else:
                nm.send_message(nm.encode_message({
                    "response": "INVALID"
                }))
        else:
            nm.send_message(nm.encode_message({
                "response": "INVALID"
            }))

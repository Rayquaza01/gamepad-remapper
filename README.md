# gamepad-remapper
A Firefox extension that remaps gamepad buttons to keyboard buttons.

# How To Use:
1. Clone repository
2. Run `pip3 install -r requirements.txt` in app/
3. `pip3 install nativemessaging` (need command line script from this, so it must be installed separately)
4. Run `nativemessaging-install.py firefox` in app/
5. Install browser extension

# Config File
The config file can be edited from within the browser. It is written in YAML, but converted to JSON. The format is as follows:
```yaml
---
- name: SomeName
  match: regex to match a url
  buttons:
    0:
      - z
      - single
    1:
      - x
      - repeat
    2:
      - - ctrl
        - c
      - single
  axes:
    0:
      pos:
        - right
        - repeat
      neg:
        - left
        - repeat
  hats:
    0:
      x:
        pos:
          - right
          - repeat
        neg:
          - left
          - repeat
```
The top level needs to be an array of objects. The objects need to have a `name` parameter, and a `match` parameter that can regex match a URL. There needs to be an object with the name `Default`, and it does not need to have a match property. It will be used as the fallback if no other URLs match.

The buttons property contains properties with button ids. The value must be an array with: 
1. a single character, or special key (like `left`, `escape`, `f10`, etc.) OR an array with multiple keys (useful for keyboard shortcuts like Ctrl-C)
2. a mode (either `single` or `repeat`). Single means pressing the controller button once presses the keyboard button once, while repeat will keep repeating the keypress as long as you hold down the controller button.

The axes property is similar to the buttons property, but axes are split into negative and positive parts. The negative mapping will trigger when the axis's value is negative and vice versa.

The hats property is also similar, except hats are split into x and y parts, along with positive and negative parts.

# The Options Page
On the options page, you can directly edit the YAML. Save it with the `Save` button. The final JSON is also shown next to the YAML, but it is read only.

There is a button to open a Gamepad Tester. This is useful for determining the IDs of the buttons, axes, and hats.

There is an option to change whether or not the extension changes with tabs. If this is set to off (default on), the match property will NOT be used. If it is set to on, the configuration will automatically change based on the URL of the current tab and the match property.

There is an option to enable or disable notifications. When it is on (default), it will notify you when the mapping starts or stops.

# The Popup
In the popup, there is a list of configurations. The selected configuration (marked by underline) will be used when you press `Start`.

There are `Start` and `Stop` buttons. The start button will enable mapping with the selected config. The stop button will stop mapping.

The `Settings` button will open the options page.

# As A Standalone Program
You can use `gamepad-remapper.py` as a standalone program. Just save the JSON config from the browser to a file, open `gamepad-remapper.py`, and give it the config. It will ask you to type in the name of the config you want to use, and will start mapping after you enter the name.

# Adknowledgements
 - Using icon from [Material Design Icons](https://materialdesignicons.com)
 - Using [PyAutoGUI](https://pypi.org/project/PyAutoGUI/)
 - Using [pygame](https://pypi.org/project/pygame/)
 - Using [js-yaml](https://github.com/nodeca/js-yaml)

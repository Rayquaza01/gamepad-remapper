#!/usr/bin/env python3
import os
import sys
import json
if sys.platform == "win32":
    import winreg


def readFile(file):
    with open(file, "r") as f:
        return f.read()


def writeFile(file, contents):
    with open(file, "w") as f:
        f.write(contents)


def main():
    if len(sys.argv) > 1 and os.path.isfile(sys.argv[1]):  # read from arguments if available
        print("Reading manifest: " + sys.argv[1])
        file = readFile(sys.argv[1])
    elif os.path.isfile("install.json"):  # fall back to install.json
        print("Reading manifest: install.json")
        file = readFile("install.json")
    else:
        raise Exception("No manifest found. Supply a manifest in the arguments, or create a manifest named install.json")
    manifest = json.loads(file)
    manifest["path"] = os.path.abspath(manifest["path"])  # ensure path is absolute
    print("Absolute path: " + manifest["path"])
    if sys.platform == "win32":
        install_dir = os.path.dirname(manifest["path"])
        if manifest["path"].endswith(".py"):  # create batch file for python apps in windows
            batch_path = os.path.join(install_dir, manifest["name"] + ".bat")
            writeFile(batch_path,
                      "@echo off\npython -u \"{0}\"".format(manifest["path"]))
            manifest["path"] = batch_path
            print("Batch file created at: " + manifest["path"])
        manifest_path = os.path.join(install_dir, manifest["name"] + ".json")
        writeFile(manifest_path, json.dumps(manifest))
        print("Saved manifest file to " + manifest_path)
        # write registry key to HKCU\Software\Mozilla\NativeMessagingHosts\<name> on windows
        registry_path = "Software\\Mozilla\\NativeMessagingHosts\\" + manifest["name"]
        winreg.CreateKey(winreg.HKEY_CURRENT_USER, registry_path)
        registry_key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, registry_path, 0, winreg.KEY_WRITE)
        winreg.SetValue(registry_key, "", winreg.REG_SZ, manifest_path)
        winreg.CloseKey(registry_key)
        print("Created registry key at HKEY_CURRENT_USER\\" + registry_path)
    if sys.platform == "linux":
        # save manifest in ~/.mozilla/native-messaging-hosts/<name>.json on linux
        manifest_path = os.path.join(os.path.expandvars("$HOME"), ".mozilla/native-messaging-hosts", manifest["name"] + ".json")
        writeFile(manifest_path, json.dumps(manifest))
        print("Saved manifest file to " + manifest_path)
    if sys.platform == "darwin":
        # save manifest in ~/Library/Application Support/Mozilla/NativeMessagingHosts/<name>.json on mac
        manifest_path = os.path.join(os.path.expandvars("$HOME"), "Library/Application Support/Mozilla/NativeMessagingHosts",
                                     manifest["name"] + ".json")
        writeFile(manifest_path, json.dumps(manifest))
        print("Saved manifest file to " + manifest_path)
    input("Done! Press enter or close the window.")


if __name__ == "__main__":
    main()

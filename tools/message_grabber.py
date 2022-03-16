#!/usr/bin/env python3

# Copyright (C) 2022 Frederick Clausen II
# This file is part of acarshub <https://github.com/fredclausen/docker-acarshub>.
# acarshub is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# acarshub is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with acarshub.  If not, see <http://www.gnu.org/licenses/>.

# Quick and dirty program to grab ADSB / ACARS messages from the server and
# store them in a queue. This is a quick and dirty way to get the messages
# for playback via the spammer utility or for the CI tests.

# The idea is to keep everything in time sorted order, and have both ADSB and ACARS
# available for playback.

# TODO: Take in a command line optional switch to allow specifying the output file
# TODO: Take in a command line optiona switch to allow specifying the ADSB fetch rate
# TODO: Take in a command line option switch to allow specifying the server URL
# TODO: Take in a command line option switch to allow specifying the number of messages to download
# TODO: Enable / disable the various kinds of input (ie ADSB, ACARS, VDLM) to allow removing stuff
# from the output you may not need
# TODO: ADSB filtering - remove extra cruft fields that aren't needed for playback

import socketio
import os
import json
import requests
import time
from threading import Thread, Event

sio = socketio.Client()

ADSB_URL = "http://127.0.0.1/data/aircraft.json"
ADSB_UPDATE_RATE = 10

output_messages = []
acars_message_count = 0
adsb_message_count = 0

adsb_downloader_thread = Thread()
adsb_downloader_event = Event()


def adsb_downloader():
    global ADSB_URL
    global ADSB_UPDATE_RATE
    global adsb_message_count
    while not adsb_downloader_event.is_set():
        try:
            response = requests.get(ADSB_URL)
            if response.status_code == 200:
                adsb_message_count = adsb_message_count + 1
                print(f"Received ADSB response #{adsb_message_count}")
                formatted_message = response.json()
                output_messages.insert(
                    0,
                    {
                        "adsb": {
                            "message": formatted_message,
                        }
                    },
                )
        except Exception as e:
            print(e)
        finally:
            time.sleep(ADSB_UPDATE_RATE)


@sio.event
def connect():
    global adsb_downloader_thread, adsb_downloader_event
    print("I'm connected!")


@sio.on("acars_msg", namespace="/main")
def on_message(data):
    global acars_message_count

    if "done_loading" in data and data["done_loading"] is True:
        print("done loading")
    elif "loading" not in data and "done_loading" not in data:
        output_messages.insert(
            0,
            {
                "acars"
                if data["msghtml"]["message_type"] == "ACARS"
                else "vdlm": {
                    "msghtml": data["msghtml"],
                }
            },
        )
        acars_message_count = acars_message_count + 1
        print(f"Received message #{acars_message_count}")

        if acars_message_count >= 100:
            print(f"Received {acars_message_count} messages")
            print("Writing file and exiting")
            adsb_downloader_event.set()
            # write the messages out to a file in the home directory and exit
            try:
                with open(os.path.expanduser("~/acars_messages.json"), "w") as f:
                    json.dump(output_messages, f, indent=4)
            except Exception as e:
                print(f"Error writing to file: {e}")
            finally:
                sio.disconnect()
    else:
        pass


@sio.on("features_enabled", namespace="/main")
def on_features_enabled(data):
    global ADSB_URL
    if data["adsb"]["enabled"]:
        print("ADSB is enabled")
        if data["adsb"]["bypass"]:
            ADSB_URL = data["adsb"]["url"]

            print("Starting ADSB Downloader")

            adsb_downloader_thread = Thread(target=adsb_downloader)
            adsb_downloader_thread.start()


if __name__ == "__main__":
    sio.connect("http://localhost")

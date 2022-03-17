// Copyright (C) 2022 Frederick Clausen II
// This file is part of acarshub <https://github.com/sdr-enthusiasts/docker-acarshub>.

// acarshub is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// acarshub is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with acarshub.  If not, see <http://www.gnu.org/licenses/>.

const MessageHandler = require("../data-handling/message_handler");
const fs = require("fs");
const pth = require("path");

jest.mock("../acarshub", () => ({
  get_setting: jest.fn((setting) => {
    if (setting === "live_messages_page_exclude_empty") return false;
    if (setting === "live_messages_page_exclude_labels") return [];
    if (setting === "live_messages_page_num_items") return 20;
  }),
  is_label_excluded: jest.fn(() => false),
  get_alerts: jest.fn(() => {
    return [];
  }),
}));

try {
  const data = fs.readFileSync(
    pth.join(__dirname, "../../data/acars_messages.json"),
    "utf8"
  );
  const messages = JSON.parse(data);
  const msg_handler = new MessageHandler.MessageHandler();

  // Initial run with no ADSB
  messages.forEach((message) => {
    if (message) {
      if (typeof message.vdlm !== "undefined") {
        msg_handler.acars_message(message.vdlm);
      } else if (typeof message.acars !== "undefined") {
        msg_handler.acars_message(message.acars);
      }
    }
  });

  test("First plane has expected number of messages", () => {
    expect(msg_handler.planes[0].messages.length).toBe(1);
  });
  test("Second plane has expected number of messages", () => {
    expect(msg_handler.planes[1].messages.length).toBe(1);
  });
  test("First plane should not be filtered", () => {
    expect(
      msg_handler.should_display_message(msg_handler.planes[0].messages[0])
    ).toBe(true);
  });
  test("Second plane should not be filtered", () => {
    expect(
      msg_handler.should_display_message(msg_handler.planes[1].messages[0])
    ).toBe(true);
  });
  test("All messages returns expected number of messages (no filtering)", () => {
    expect(msg_handler.get_all_messages().length).toBe(20);
  });
} catch (err) {
  console.log(err);
}

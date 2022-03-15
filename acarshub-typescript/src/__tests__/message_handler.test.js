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
  get_setting: jest.fn(() => "false"),
  is_label_excluded: jest.fn(),
  get_alerts: jest.fn(() => {
    return [];
  }),
}));

try {
  const data = fs.readFileSync(
    pth.join(__dirname, "../../data/messages.json"),
    "utf8"
  );
  const messages = JSON.parse(data);
  const msg_handler = new MessageHandler.MessageHandler();

  test("Load in all messages with no filtering", () => {
    messages.forEach((message) => {
      if (message) {
        msg_handler.acars_message(message);
      }
    });
    expect(msg_handler.planes.length).toBe(2);
  });
} catch (err) {
  console.log(err);
}

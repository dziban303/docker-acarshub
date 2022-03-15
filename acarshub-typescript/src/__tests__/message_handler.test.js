// import { MessageHandler } from "../data-handling/message_handler";

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

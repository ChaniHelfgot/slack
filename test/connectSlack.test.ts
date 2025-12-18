const mockPostMessage = jest.fn();
const mockHistory = jest.fn();
const mockUsersList = jest.fn();

const consoleLog = jest.spyOn(console, "log").mockImplementation(() => {});
const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

jest.mock("@slack/web-api", () => ({
  WebClient: jest.fn().mockImplementation(() => ({
    chat: { postMessage: mockPostMessage },
    conversations: { history: mockHistory },
    users: { list: mockUsersList }
  }))
}));

process.env.SLACK_BOT_TOKEN = "dummy_token";
process.env.SLACK_CHANNEL = "TEST_CHANNEL";

import {
  sendDirectMessage,
  readChannelMessages,
  listAllUsers
} from "../src/connectSlack";


describe("Slack API – Full Test Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("sendDirectMessage sends a message", async () => {
    mockPostMessage.mockResolvedValue({ ok: true });

    await sendDirectMessage("U123", "hello");

    expect(mockPostMessage).toHaveBeenCalledTimes(1);
    expect(mockPostMessage).toHaveBeenCalledWith({
      channel: "U123",
      text: "hello"
    });
    expect(consoleLog).toHaveBeenCalledWith("Message sent to user U123");
  });

  test("sendDirectMessage handles errors", async () => {
    mockPostMessage.mockRejectedValue(new Error("Slack ERROR"));

    await sendDirectMessage("U1", "msg");

    expect(consoleError).toHaveBeenCalled();
  });

  test("readChannelMessages reads channel history", async () => {
    mockHistory.mockResolvedValue({
      ok: true,
      messages: [{ user: "U1", text: "Hello!" }]
    });

    await readChannelMessages(7);

    expect(mockHistory).toHaveBeenCalledWith({
      channel: "TEST_CHANNEL",
      limit: 7
    });
    expect(consoleLog).toHaveBeenCalledWith("Messages in channel TEST_CHANNEL:");
  });

  test("readChannelMessages handles API errors", async () => {
    mockHistory.mockRejectedValue(new Error("Slack Down"));

    await readChannelMessages();

    expect(consoleError).toHaveBeenCalled();
  });

  test("listAllUsers returns members", async () => {
    mockUsersList.mockResolvedValue({
      ok: true,
      members: [{ id: "U1", name: "Test User" }]
    });

    const users = await listAllUsers();

    expect(mockUsersList).toHaveBeenCalledTimes(1);
    expect(users).toEqual([{ id: "U1", name: "Test User" }]);
  });

  test("listAllUsers handles Slack ERROR", async () => {
    mockUsersList.mockResolvedValue({
      ok: false,
      error: "NO_AUTH"
    });

    const users = await listAllUsers();

    expect(consoleError).toHaveBeenCalledWith("Error fetching users:", "NO_AUTH");
    expect(users).toEqual([]);
  });

  test("listAllUsers handles thrown error", async () => {
    mockUsersList.mockRejectedValue(new Error("Network Failed"));

    const users = await listAllUsers();

    expect(consoleError).toHaveBeenCalled();
    expect(users).toBeUndefined(); 
  });
});

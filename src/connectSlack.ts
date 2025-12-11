import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.SLACK_BOT_TOKEN ?? "";
const channel = process.env.SLACK_CHANNEL ?? "";

if (!token) throw new Error("Missing SLACK_BOT_TOKEN in .env");
if (!channel) throw new Error("Missing SLACK_BOT_TOKEN in .env");

const client = new WebClient(token);

async function readChannelMessages(limit: number = 10) {
  try {
    const result = await client.conversations.history({
      channel,
      limit: limit,
    });
    console.log(`Messages in channel ${channel}:`);
    result.messages?.forEach((message) => {
      console.log(`- ${message.user}: ${message.text}`);
    });
  } catch (error) {
    console.error('Error reading channel messages:', error);
  }
}

async function sendDirectMessage(goal: string, message: string): Promise<void> {
  try {
    await client.chat.postMessage({
      channel: goal,
      text: message,
    });
    console.log(`Message sent to user ${goal}`);
  } catch (error) {
    console.error('Error sending direct message:', error);
  }
}

async function listAllUsers() {
  try {
    const result = await client.users.list();
    if (result.ok) {
      console.log("Users:", result.members);
      return result.members;
    } else {
      console.error("Error fetching users:", result.error);
      return [];
    }
  } catch (error) {
    console.error("Network or API error:", error);
  }
}


sendDirectMessage('U0A1QMUAK7H', 'Hello from your bot!');

readChannelMessages(); 

listAllUsers()

export {sendDirectMessage,readChannelMessages,listAllUsers}
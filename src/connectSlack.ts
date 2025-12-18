import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.SLACK_BOT_TOKEN ?? "";
const channel = process.env.SLACK_CHANNEL ?? "";

if (!token) throw new Error("Missing SLACK_BOT_TOKEN in .env");
if (!channel) throw new Error("Missing SLACK_BOT_TOKEN in .env");

const client = new WebClient(token);

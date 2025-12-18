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

export {readChannelMessages}
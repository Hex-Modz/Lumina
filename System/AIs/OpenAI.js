const fs = require("fs");
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync("./Configs/config.yml", "utf8"));
const OpenAI = require("openai");
const userMessageHistory = {};

const openai = new OpenAI({
  apiKey: config.OpenAI.OpenAIAPI,
});

module.exports = async (client) => {
  client.on("messageCreate", async (msg) => {
    try {
      if (msg.author.bot || !msg.mentions.users.has(client.user.id)) return;

      msg.content = msg.content.replace(/<@\d+>/g, "");
      const content = msg.content;
      const userId = msg.author.id;

      if (!userMessageHistory[userId]) {
        userMessageHistory[userId] = [];
      }

      userMessageHistory[userId].push({ role: "user", content });

      if (userMessageHistory[userId].length > 30) {
        userMessageHistory[userId].shift();
      }

      await msg.channel.sendTyping();

      const response = await openai.chat.completions.create({
        model: config.OpenAI.OpenAIModel,
        messages: userMessageHistory[userId],
        temperature: 0,
        max_tokens: 1024,
      });

      if (response.choices && response.choices.length > 0) {
        const reply = response.choices[0].message.content;
        await msg.reply(`<@${userId}> ${reply}`);
      } else {
        console.log(
          "Generated reply is empty or response structure is unexpected."
        );
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      // Consider throwing the error or logging it for further analysis
    }
  });
};
//© 2024 Shadow Modz
const fs = require("fs");
const yaml = require("js-yaml");
const axios = require("axios");

// Load configuration from YAML file
const config = yaml.load(fs.readFileSync("./Configs/config.yml", "utf8"));

// Define maximum concurrent requests and request timeout
const MAX_CONCURRENT_REQUESTS = config.Ollama.concurrent;
const REQUEST_WINDOW_TIME = config.Ollama.requestWindowTime; // Time window in milliseconds
const MAX_REQUESTS_PER_WINDOW = config.Ollama.maxRequestsPerWindow;

// Maintain a queue to handle requests asynchronously
const requestQueue = [];
let concurrentRequests = 0;
let requestCount = 0;
let lastWindowReset = Date.now();
let aiDisabledTime = 0;

const processQueue = async () => {
  while (
    requestQueue.length > 0 &&
    concurrentRequests < MAX_CONCURRENT_REQUESTS
  ) {
    concurrentRequests++;
    const request = requestQueue.shift();
    try {
      await processRequest(request);
    } catch (error) {
      request.channel.send(`An error occurred: ${error.message}`);
    } finally {
      concurrentRequests--;
    }
  }
};

const processRequest = async (msg) => {
  if (msg.author.bot || !msg.mentions.users.has(msg.client.user.id)) return;

  // Check if AI functionality should be disabled due to high traffic
  if (isRateLimitReached()) {
    const remainingTime = getRemainingCooldown();
    await msg.channel.send(
      `Sorry <@${msg.author.id}>, due to server overload, My systems have temporarily disabled the AI functionality. It will be back online in ${remainingTime} seconds.`
    );
    return;
  }

  const content = msg.content;

  await msg.channel.sendTyping();

  const apiEndpoint = config.Ollama.OllamaURL;

  // Disable AI functionality during cooldown period
  if (aiDisabledTime && Date.now() < aiDisabledTime + REQUEST_WINDOW_TIME) {
    await msg.channel.send(
      "AI functionality is currently disabled. Please try again later."
    );
    return;
  }

  const apiResponse = await axios.post(apiEndpoint, {
    model: config.Ollama.OllamaModel,
    messages: [
      {
        role: "user",
        content: content,
      },
    ],
    stream: false,
  });

  const reply = apiResponse.data?.message?.content;

  if (reply) {
    await msg.reply(`${reply}`);
  } else {
    msg.channel.send(
      "Generated reply is empty or response structure is unexpected."
    );
  }
};

const isRateLimitReached = () => {
  const now = Date.now();
  if (now - lastWindowReset > REQUEST_WINDOW_TIME) {
    // Reset request count if the window has passed
    requestCount = 0;
    lastWindowReset = now;
  }
  return requestCount >= MAX_REQUESTS_PER_WINDOW;
};
const getRemainingCooldown = () => {
  const now = Date.now();
  let cooldownEndTime = aiDisabledTime + REQUEST_WINDOW_TIME;

  if (cooldownEndTime < now) {
    // If the cooldown end time is in the past or has not been set yet
    cooldownEndTime = now + REQUEST_WINDOW_TIME; // Set it to the current time plus the cooldown time
  }

  let remainingTime = Math.ceil((cooldownEndTime - now) / 1000); // Convert milliseconds to seconds

  if (remainingTime < 0) {
    remainingTime = 0; // Ensure remaining time is not negative
  } else if (remainingTime > REQUEST_WINDOW_TIME / 1000) {
    // If remaining time is greater than the actual cooldown time, set it to the cooldown time
    remainingTime = REQUEST_WINDOW_TIME / 1000;
  }

  return remainingTime;
};

module.exports = (client) => {
  client.on("messageCreate", async (msg) => {
    requestQueue.push(msg);
    processQueue();
    // Increment request count for rate limiting
    requestCount++;
  });
};
//© 2024 Shadow Modz
const axios = require("axios");
const colors = require("colors");
const yaml = require("js-yaml");
const fs = require("fs");
const { EmbedBuilder, WebhookClient } = require("discord.js");

// Load the configuration from config.yml
const config = yaml.load(fs.readFileSync("./Configs/config.yml", "utf8"));

// Variables for API and License settings
const siteURL = "https://shadowmodz.dev";  // Updated auth server
const productID = "10";                     // Product ID for the new auth server
const apiURL = `${siteURL}/app/api/v1/check.php?product=${productID}&ip=`;  // Updated API URL
const Webhooks = true;

// Function to get the public IP Address
async function getPublicIPAddress() {
  try {
    // Use an external service to fetch the public IP address
    const response = await axios.get("https://api.ipify.org?format=json");
    return response.data.ip; // Return the public IP
  } catch (error) {
    console.error("Error fetching public IP:", error.message);
    return null; // Return null on error
  }
}

// Function to send logs to Discord via Webhook
const sendLog = async (status, color, fields) => {
  if (!Webhooks) return; // Exit if webhook logging is disabled
  const webhookUrl = `https://discord.com/api/webhooks/1287384328615104512/LeUbjV4qqSEZIPRqPmskdBi8lD-Wex6IHuWEDAuJfgIEF4iPmV1n5nOagD2WQmCFdN7X`;
  const webhookClient = new WebhookClient({ url: webhookUrl });

  const embed = new EmbedBuilder()
    .setTitle(`Nighthawk Auth`)
    .addFields(fields)
    .setColor(color)
    .setThumbnail("https://cdn.discordapp.com/app-icons/1157650863511318639/12e5dcc036f99858d28b679f5d45f407.png")
    .setFooter({ text: "© 2024 Shadow Modz." })
    .setTimestamp();

  await webhookClient.send({ embeds: [embed] });
};

// Main authorization function using the new API (IP-based)
async function Auth() {
  const userIP = await getPublicIPAddress(); // Fetch public IP

  if (!userIP) {
    console.log("[AUTH]".brightRed, "Failed to retrieve public IP address.");
    process.exit(1); // Exit if we can't get the public IP
  }

  const fullApiURL = `${apiURL}${userIP}`; // Complete API URL with public IP

  try {
    const response = await axios.get(fullApiURL, { headers: { Referer: siteURL } });
    const { status, data } = response;

    if (status === 200 && data.status === true) {
      console.log("[AUTH]".brightGreen, `Lumina v${config.Settings.Version}: Authorization successful`);

      const successFields = [
        { name: `Authorization`, value: `Successful`, inline: true },
        { name: `Product ID`, value: productID, inline: true },
        { name: `IP Address`, value: userIP, inline: true },
      ];

      await sendLog('Authorization Successful', "#00FF00", successFields);
    } else {
      console.log("[AUTH]".brightRed, `Lumina v${config.Settings.Version}: Authorization failed`);

      const failureFields = [
        { name: `Authorization`, value: `Failed`, inline: true },
        { name: `Product ID`, value: productID, inline: true },
        { name: `IP Address`, value: userIP, inline: true },
      ];

      await sendLog('Authorization Failed', "#FF0000", failureFields);
      process.exit(1); // Exit if authorization fails
    }
  } catch (error) {
    console.error("Error:", error.message);

    const errorFields = [
      { name: `Authorization`, value: `Failed`, inline: true },
      { name: `Product ID`, value: productID, inline: true },
      { name: `IP Address`, value: userIP, inline: true },
      { name: `Error Details`, value: `${error.message}`, inline: true },
    ];

    await sendLog('Authorization Error', "#FF0000", errorFields);
    process.exit(1); // Exit on error
  }
}

module.exports = { Auth };

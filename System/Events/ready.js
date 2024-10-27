const fs = require("fs")
const yaml = require("js-yaml")
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ActivityType,
  WebhookClient,
} = require("discord.js")

const config = yaml.load(fs.readFileSync("./Configs/config.yml", "utf8"))

// Function to send logs
const sendLog = async (status, color, fields) => {
  if (!config.Webhooks.Enabled) return // Exit if webhook logging is not enabled

  try {
    
    const webhookUrl = config.Webhooks.Url;
    const webhook = new WebhookClient({ url: webhookUrl })

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(config.URLS.Website)
        .setLabel(config.Labels.Website)
        .setStyle(ButtonStyle.Link)
        .setEmoji(config.Emojis.Website),
    )

    const embed = new EmbedBuilder()
      .setTitle(`${config.Settings.Name} | Startup`)
      .addFields(fields)
      .setURL(config.URLS.Website)
      .setColor(config.Settings.Color)
      .setThumbnail(config.Icons.Thumbnail)
      .setFooter({ iconURL: config.Icons.Icon, text: config.Auth.copright })
      .setTimestamp()

   await Webhook.send({  embeds: [embed], components: [row1] });
  } catch (error) {
    console.error("Error sending log:", error)
  }
}

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    // Function to update bot's presence
    if (!config.Status.Enabled) return

    const updatePresence = async () => {
      const statusTexts = []

      // Push status values into the array if they exist
      if (config.Status.Value1) statusTexts.push(config.Status.Value1)
      if (config.Status.Value2) statusTexts.push(config.Status.Value2)
      if (config.Status.Value3) statusTexts.push(config.Status.Value3)
      if (config.Status.Value4) statusTexts.push(config.Status.Value4)

      // Create a status string for server and member count
      let countText = ""

      if (config.Status.ServerCount) {
        countText += `${client.guilds.cache.size} Server(s)`
      }

      // Push the combined count text if it exists
      if (countText) statusTexts.push(countText)

      // Select a random status text
      const randomText =
        statusTexts[Math.floor(Math.random() * statusTexts.length)]

      // Update the bot's presence
      client.user.setPresence({
        activities: [
          { name: randomText, type: ActivityType[config.Status.Type] },
        ],
        status: config.Status.Mode,
      })
    }

    // Set interval to update presence based on config.Status.Timer
    setInterval(updatePresence, config.Status.Timer)

    // Initial call to set presence immediately
    await updatePresence()

    // Log the number of commands loaded
    const commandCount = client.commands.size
    console.log(
      "[COMMANDS]".green,
      `${config.Settings.Name} loaded ${commandCount} command(s).`
    )

    // Log bot's latency
    console.log(
      `[LATENCY]`.blue,
      `${config.Settings.Name}'s latency is ${client.ws.ping}ms.`
    )

    // Check which AI APIs are enabled and create a string to represent the connection status
    let aiApiStatus = []
    if (config.AIModules["Enable-Ollama"]) {
      aiApiStatus.push("Ollama")
    }
    if (config.AIModules["Enable-OpenAI"]) {
      aiApiStatus.push("OpenAI")
    }

    // If no API is connected, set a default message
    const aiApiValue =
      aiApiStatus.length > 0 ? aiApiStatus.join(", ") : "No AI API Connected"

    // Send webhook logs if enabled
    if (config.Webhooks.Enabled) {
      try {
        
        const webhookUrl = config.Webhooks.Url;
        const Webhook = new WebhookClient({ url: webhookUrl })

        const row1 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL(config.URLS.Website)
            .setLabel(config.Labels.Website)
            .setStyle(ButtonStyle.Link)
            .setEmoji(config.Emojis.Website),
        )

        const embed = new EmbedBuilder()
          .setTitle(`${config.Settings.Name} | Status`)
          .addFields(
            {
              name: `🟢 ${config.Settings.Name} is`,
              value: `Online!`,
              inline: false,
            },
            {
              name: `🟢 ${aiApiValue}`,
              value: "API Connected",
              inline: false,
            },
            {
              name: `🟢 ${config.Settings.Name}'s Latency`,
              value: `${client.ws.ping}ms`,
              inline: false,
            },
            {
              name: `🟢 ${config.Settings.Name} is Available in`,
              value: `${client.guilds.cache.size} Server(s)`,
              inline: false,
            },
            {
              name: `🟢 ${config.Settings.Name} is Watching`,
              value: `${client.guilds.cache
                .map((g) => g.memberCount)
                .reduce((a, c) => a + c)} user(s)`,
              inline: false,
            },
            {
              name: `🟢 Commands Loaded`,
              value: `${commandCount} command(s)`,
              inline: false,
            }
          )
          .setURL(config.URLS.Website)
          .setColor(config.Settings.Color)
          .setThumbnail(config.Icons.Thumbnail)
          .setImage(config.Icons.Banner)
          .setFooter({ iconURL: config.Icons.Icon, text: config.Auth.copright })
          .setTimestamp()

          await Webhook.send({  embeds: [embed], components: [row1]});
      } catch (error) {
        console.error("Error sending webhook status:", error)
      }
    }

    // Check if both AI backends are enabled
    if (
      config.AIModules["Enable-Ollama"] &&
      config.AIModules["Enable-OpenAI"]
    ) {
      console.log(
        "[ERROR]".brightRed,
        `${config.Settings.Name}:`,
        `Cannot run both AI backends at the same time`
      )
      process.exit() // Invoke the exit function
    }

    // Check and load Ollama backend if enabled
    if (config.AIModules["Enable-Ollama"]) {
      require("../AIs/Ollama.js")(client) // Pass the client object if necessary
      console.log(
        "[API]".brightMagenta,
        `${config.Settings.Name} is`,
        `Operating the Ollama AI API Backend!`
      )
    }

    // Check and load OpenAI backend if enabled
    if (config.AIModules["Enable-OpenAI"]) {
      require("../AIs/OpenAI.js")(client) // Pass the client object if necessary
      console.log(
        "[API]".brightYellow,
        `${config.Settings.Name} is`,
        `Operating the OpenAI API Backend!`
      )
    }
  },
}
//© 2024 Shadow Modz
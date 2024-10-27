const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ChannelType,
  WebhookClient,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const { Auth } = require("./System/Auth/API"); // Ensure this matches the export
const fs = require("fs");
const yaml = require("js-yaml");
const colors = require("colors");
const config = yaml.load(fs.readFileSync("./Configs/config.yml", "utf8"));

// Use the Auth function correctly
async function authenticate() {
  await Auth(); // Call the Auth function
}

// Intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();

// Handling
const functions = fs
  .readdirSync("./System/Functions")
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./System/Events")
  .filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./System/Commands");

// Load functions, events, and commands
(async () => {
  for (const file of functions) {
    require(`./System/Functions/${file}`)(client);
  }

  await authenticate(); // Call the authenticate function instead of API()

  client.handleEvents(eventFiles, "System/Events"); // Ensure this path is correct
  client.handleCommands(commandFolders, "System/Commands");
  await client.login(config.Settings.Token);
})();

// Error handling
process.on("unhandledRejection", (reason, promise) => {
  
});

process.on("uncaughtException", (err) => {
  
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  
});

// Event handler for when the bot joins a server
client.on("guildCreate", async (guild) => {
  // Welcome message
  {
    const channel = guild.channels.cache.find(
      (c) =>
        c.type === ChannelType.GuildText &&
        c.permissionsFor(guild.members.me).has("SendMessages")
    );

    if (channel) {
      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setURL(config.URLS.TOS)
        .setLabel(config.Labels.TOS)
        .setStyle(ButtonStyle.Link)
        .setEmoji(config.Emojis.Privacy),

      new ButtonBuilder()
        .setURL(config.URLS.Privacy)
        .setLabel(config.Labels.Privacy)
        .setStyle(ButtonStyle.Link)
        .setEmoji(config.Emojis.Privacy)
    );
      const embed = new EmbedBuilder()
        .setTitle(`${config.Settings.Name} | Thank You for Adding Me!`)
        .setDescription(
          `Hello! Thank you for adding ${config.Settings.Name} to your server. Here's how you can use me:`
        )
        .addFields(
          {
            name: `How to Use ${config.Settings.Name}`,
            value: `To get started, use ${config.Settings.Name}'s \`/help\` command to see a list of available commands and features.`,
            inline: false,
          },
          {
            name: `How to Use the AI Function`,
            value: `To use the AI function, simply type \`@${config.Settings.Name} + (Your Message Here)\` in any channel.`,
            inline: false,
          }
        )
        .setURL(config.URLS.Website)
        .setColor(config.Settings.Color)
        .setThumbnail(config.Icons.Thumbnail)
        .setImage(config.Icons.Banner)
        .setFooter({  iconURL: config.Icons.Icon,  text: config.Auth.copright })
        .setTimestamp();

      await channel.send({ embeds: [embed], components: [row1] });
    } else {
      
    }
  }

  // Send webhook logs if enabled
  if (config.Webhooks.Enabled) {
    const webhookUrl = config.Webhooks.Url;

    const Webhook = new WebhookClient({ url: webhookUrl });
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(config.URLS.Website)
        .setLabel(config.Labels.Website)
        .setStyle(ButtonStyle.Link)
        .setEmoji(config.Emojis.Website),
    );
    const embed = new EmbedBuilder()
      .setTitle(`${config.Settings.Name} | Join Log`)
      .addFields({
        name: `📅 Server Joined`,
        value: `${config.Settings.Name} has joined **${guild.name}** (ID: ${guild.id}).`,
        inline: false,
      })
      .setURL(config.URLS.Website)
      .setColor(config.Settings.Color)
      .setThumbnail(config.Icons.Thumbnail)
      .setImage(config.Icons.Banner)
      .setFooter({  iconURL: config.Icons.Icon,  text: config.Auth.copright })
      .setTimestamp();

      await Webhook.send({
        embeds: [embed],
        components: [row1]
      });
      
  }
});

// Event handler for when the bot leaves a server
client.on("guildDelete", async (guild) => {
  // Send webhook logs if enabled
  if (config.Webhooks.Enabled) {
  
    const webhookUrl = config.Webhooks.Url;

    const Webhook = new WebhookClient({ url: webhookUrl });
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(config.URLS.Website)
        .setLabel(config.Labels.Website)
        .setStyle(ButtonStyle.Link)
        .setEmoji(config.Emojis.Website),
    );
    const embed = new EmbedBuilder()
      .setTitle(`${config.Settings.Name} | Leave Log`)
      .addFields({
        name: `📅 Server Left`,
        value: `${config.Settings.Name} has left **${guild.name}** (ID: ${guild.id}).`,
        inline: false,
      })
      .setURL(config.URLS.Website)
      .setColor(config.Settings.Color)
      .setThumbnail(config.Icons.Thumbnail)
      .setImage(config.Icons.Banner)
      .setFooter({  iconURL: config.Icons.Icon,  text: config.Auth.copright })
      .setTimestamp();

    await Webhook.send({ embeds: [embed], components: [row1]});
  }
});

// Event handler for when a message is created
client.on("messageCreate", async (message) => {
  // Send webhook logs if enabled
  if (config.Webhooks.Enabled) {
    if (!message.mentions.everyone && !message.author.bot) {
      const guildName = message.guild.name;
      const channelName = message.channel.name;
      const authorName = message.author.tag;
      const messageContent = message.content;

    
      const webhookUrl = config.Webhooks.Url;

      const Webhook = new WebhookClient({ url: webhookUrl });
      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setURL(config.URLS.Website)
          .setLabel(config.Labels.Website)
          .setStyle(ButtonStyle.Link)
          .setEmoji(config.Emojis.Website),
      );
      const embed = new EmbedBuilder()
        .setTitle(`**${config.Settings.Name}**`)
        .setURL(config.Settings.URL)
        .addFields(
          { name: "Server", value: guildName, inline: true },
          { name: "Channel", value: channelName, inline: true },
          { name: "User", value: authorName, inline: true },
          { name: "Message", value: messageContent }
        )
        .setURL(config.URLS.Website)
        .setColor(config.Settings.Color)
        .setThumbnail(config.Icons.Thumbnail)
        .setImage(config.Icons.Banner)
        .setFooter({  iconURL: config.Icons.Icon,  text: config.Auth.copright })
        .setTimestamp();

      try {
        await Webhook.send({  embeds: [embed], components: [row1] });
      } catch (error) {
        console.error("Error sending webhook:", error);
      }
    }
  }
});
//© 2024 Shadow Modz
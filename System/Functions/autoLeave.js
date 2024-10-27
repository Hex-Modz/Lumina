const yaml = require("js-yaml");
const fs = require("fs");
const { SlashCommandBuilder,EmbedBuilder,ButtonBuilder,ActionRowBuilder,ButtonStyle,ComponentType,ApplicationCommandOptionType,WebhookClient, ChannelType  } = require("discord.js");
// Load configuration from YAML file
const config = yaml.load(fs.readFileSync("./Configs/config.yml", "utf8"));

// Define field names
const FIELD_NAMES = {
  JOIN_SERVER: {
    title: "Server Joined",
    color: "#0000FF",
    fields: {
      Action: "Joined Server",
      "Server Name": "",
      "Server ID": "",
    },
  },
  BLACKLISTED_JOIN: {
    title: "Blacklisted Server Joined",
    color: "#FF0000",
    fields: {
      Action: "Blacklisted Server Joined",
      "Server Name": "",
      "Server ID": "",
    },
  },
  LEFT_BLACKLISTED: {
    title: "Left Blacklisted Server",
    color: "#00FF00",
    fields: {
      Action: "Left Blacklisted Server",
      "Server Name": "",
      "Server ID": "",
    },
  },
  FAILED_TO_LEAVE: {
    title: "Failed to Leave Blacklisted Server",
    color: "#FF0000",
    fields: {
      Action: "Failed to Leave Blacklisted Server",
      "Server Name": "",
      "Server ID": "",
      Error: "",
    },
  },
};

module.exports = (client) => {
  // Read blacklisted server IDs from the config
  const blacklistedServerIds = config.Blacklisted || [];

  client.once("ready", async () => {
    // Check all existing guilds
    for (const guild of client.guilds.cache.values()) {
      if (blacklistedServerIds.includes(guild.id)) {
        await sendLog(FIELD_NAMES.BLACKLISTED_JOIN, guild);

        try {
          // Find a random text channel with permission to send messages
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
              .setTitle(`${config.Settings.Name} | Warning!`)
              .setDescription(
                `Hello! **${guild.name}** has been added to a blacklist due to illegal activities. ${config.Settings.Name} is now leaving the server.`
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
          await guild.leave();
          await sendLog(FIELD_NAMES.LEFT_BLACKLISTED, guild);
        } catch (error) {
          await sendLog(FIELD_NAMES.FAILED_TO_LEAVE, guild, error.message);
        }
      }
    }
  });

  client.on("guildCreate", async (guild) => {
    // Log when the bot joins a new server
    await sendLog(FIELD_NAMES.JOIN_SERVER, guild);

    // Check if the server is blacklisted
    if (blacklistedServerIds.includes(guild.id)) {
      await sendLog(FIELD_NAMES.BLACKLISTED_JOIN, guild);

      try {
        // Find a random text channel with permission to send messages
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
            .setTitle(`${config.Settings.Name} | Warning!`)
            .setDescription(
              `Hello! **${guild.name}** has been added to a blacklist due to illegal activities. ${config.Settings.Name} is now leaving the server.`
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
        await guild.leave();
        await sendLog(FIELD_NAMES.LEFT_BLACKLISTED, guild);
      } catch (error) {
        await sendLog(FIELD_NAMES.FAILED_TO_LEAVE, guild, error.message);
      }
    }
  });

  // Function to send logs to a webhook
  const sendLog = async (fieldName, guild, errorMessage) => {
    if (config.Webhooks.Enabled) return;
     
    const webhookUrl = config.Webhooks.Url;
    const Webhook = new WebhookClient({ url: webhookUrl });

    // Get field settings from FIELD_NAMES
    const { title, color, fields } = fieldName;

    // Update fields with actual data
    const updatedFields = {
      ...fields,
      "Server Name": guild.name,
      "Server ID": guild.id,
    };
    if (errorMessage) {
      updatedFields["Error"] = errorMessage;
    }

    // Convert fields object to an array of objects with name and value properties
    const embedFields = Object.entries(updatedFields).map(([name, value]) => ({
      name,
      value,
    }));

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(config.URLS.Website)
        .setLabel(config.Labels.Website)
        .setStyle(ButtonStyle.Link)
        .setEmoji(config.Emojis.Website),
    );

    const embed = new EmbedBuilder()
      .setTitle(`${config.Settings.Name} | ${title}`)
      .addFields(embedFields)
      .setURL(config.URLS.Website)
      .setColor(config.Settings.Color)
      .setThumbnail(config.Icons.Thumbnail)
      .setImage(config.Icons.Banner)
      .setFooter({  iconURL: config.Icons.Icon,  text: config.Auth.copright })
      .setTimestamp();

    try {
      await Webhook.send({ embeds: [embed], components: [row1] });
    } catch (error) {
      console.error("Failed to send log message:", error);
    }
  };
};
//© 2024 Shadow Modz
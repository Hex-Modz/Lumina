const { SlashCommandBuilder,EmbedBuilder,ButtonBuilder,ActionRowBuilder,ButtonStyle,ComponentType,ApplicationCommandOptionType, } = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync("././Configs/config.yml", "utf8"));
const moment = require("moment");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription(`Get information about the server`),
  async execute(interaction, client) {
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(config.URLS.Website)
        .setLabel(config.Labels.Website)
        .setStyle(ButtonStyle.Link)
        .setEmoji(config.Emojis.Website),

    );
    try {
      let date = interaction.guild.createdAt;
      let nowdate = new Date();
      let timedif = Math.abs(nowdate.getTime() - date.getTime());
      let daydif = timedif / (1000 * 3600 * 24);

      if (interaction.guild.verificationLevel === "NONE")
        interaction.guild.verificationLevel = "None";
      if (interaction.guild.verificationLevel === "LOW")
        interaction.guild.verificationLevel = "Low";
      if (interaction.guild.verificationLevel === "MEDIUM")
        interaction.guild.verificationLevel = "Medium";
      if (interaction.guild.verificationLevel === "HIGH")
        interaction.guild.verificationLevel = "High";
      if (interaction.guild.verificationLevel === "VERY_HIGH")
        interaction.guild.verificationLevel = "Very High";

      if (interaction.guild.defaultMessageNotifications === "ALL_MESSAGES")
        interaction.guild.defaultMessageNotifications = "All Messages";
      if (interaction.guild.defaultMessageNotifications === "ONLY_MENTIONS")
        interaction.guild.defaultMessageNotifications = "Only Mentions";

      const icon = interaction.guild.iconURL();
      const serverInfo = new EmbedBuilder()
        .setTitle(`${interaction.guild.name}`)
        .addFields(
          {
            name: "Server Details:",
            value: `> **Name:** ${interaction.guild.name}\n> **ID:** ${
              interaction.guild.id
            }\n> **Owner:** <@!${
              interaction.guild.ownerId
            }>\n> **Created at:** ${moment(interaction.guild.createdAt).format(
              "DD/MM/YY"
            )} (${parseInt(daydif)} days)\n> **Verification:** ${
              interaction.guild.verificationLevel
            }\n> **Notifications:** ${
              interaction.guild.defaultMessageNotifications
            }`,
          },
          {
            name: "Server Stats:",
            value: `> **Members:** ${interaction.guild.memberCount}\n> **Roles:** ${interaction.guild.roles.cache.size}\n> **Channels:** ${interaction.guild.channels.cache.size}\n> **Emojis:** ${interaction.guild.emojis.cache.size}\n> **Stickers:** ${interaction.guild.stickers.cache.size}\n> **Boosts:** ${interaction.guild.premiumSubscriptionCount}`,
          }
        )
        .setURL(config.URLS.Website)
        .setColor(config.Settings.Color)
        .setThumbnail(config.Icons.Thumbnail)
        .setImage(config.Icons.Banner)
        .setFooter({  iconURL: config.Icons.Icon,  text: config.Auth.copright })
        .setTimestamp();

      interaction.reply({ embeds: [serverInfo], components: [row1] });
    } catch (error) {
      console.error("Error in serverinfo command: ", error);
      interaction.reply({
        content: "Sorry, there was an error retrieving the server information.",
        ephemeral: true,
      });
    }
  },
};
//© 2024 Shadow Modz
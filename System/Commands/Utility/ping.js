const { SlashCommandBuilder,EmbedBuilder,ButtonBuilder,ActionRowBuilder,ButtonStyle,ComponentType,ApplicationCommandOptionType, } = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync("././Configs/config.yml", "utf8"));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping the bot"),
  async execute(interaction, client) {
    await interaction.deferReply();
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(config.URLS.Website)
        .setLabel(config.Labels.Website)
        .setStyle(ButtonStyle.Link)
        .setEmoji(config.Emojis.Website),
    );
    const ping = new EmbedBuilder()
      .setTitle(`📶 ${config.Settings.Name}'s Network info`)
      .addFields({ name: "API", value: client.ws.ping + "ms", inline: true })
      .addFields({
        name: "Bot",
        value: `${Date.now() - interaction.createdTimestamp} ms.`,
        inline: true,
      })
      .setURL(config.URLS.Website)
      .setColor(config.Settings.Color)
      .setThumbnail(config.Icons.Thumbnail)
      .setImage(config.Icons.Banner)
      .setFooter({  iconURL: config.Icons.Icon,  text: config.Auth.copright })
      .setTimestamp();
    interaction.editReply({ embeds: [ping], components: [row1] });
  },
};
//© 2024 Shadow Modz
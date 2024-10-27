const { SlashCommandBuilder,EmbedBuilder,ButtonBuilder,ActionRowBuilder,ButtonStyle,ComponentType,ApplicationCommandOptionType, } = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync("././Configs/config.yml", "utf8"));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription(`send the Invite menu to the server`),
  async execute(interaction, client) {
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(config.URLS.Website)
        .setLabel(config.Labels.Website)
        .setStyle(ButtonStyle.Link)
        .setEmoji(config.Emojis.Website),
        
        new ButtonBuilder()
        .setURL(config.URLS.Support)
        .setLabel(config.Labels.Support)
        .setStyle(ButtonStyle.Link)
        .setEmoji(config.Emojis.Support),

        new ButtonBuilder()
        .setURL(config.URLS.Inv)
        .setLabel(config.Labels.Inv)
        .setStyle(ButtonStyle.Link)
        .setEmoji(config.Emojis.Inv)
    );

    const Page1 = new EmbedBuilder()
      .setTitle(`${config.Settings.Name} | Invite`)
      .setDescription(
        `> If you would like to invite Razer IA to your server, you can do so with the invite link below. Alternatively, if you would like to join our support server, you can use the link below.`
      )
      .setURL(config.URLS.Website)
      .setColor(config.Settings.Color)
      .setThumbnail(config.Icons.Thumbnail)
      .setImage(config.Icons.Banner)
      .setFooter({  iconURL: config.Icons.Icon,  text: config.Auth.copright })
      .setTimestamp();
    interaction.reply({ embeds: [Page1], components: [row1] });
  },
};
//© 2024 Shadow Modz
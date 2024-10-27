const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
  ApplicationCommandOptionType,
} = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync("./Configs/config.yml", "utf8"));
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dog")
    .setDescription(`Get a random picture of a dog`),
  async execute(interaction, client) {
    try {
      await interaction.deferReply();
      let infoWeb = await fetch("https://random.dog/woof.json");
      let dogimg = await infoWeb.json();
      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setURL(config.URLS.Website)
          .setLabel(config.Labels.Website)
          .setStyle(ButtonStyle.Link)
          .setEmoji(config.Emojis.Website),
      );
      let embed = new EmbedBuilder()
        .setTitle(`${config.Settings.Name} Woof Woof`)
        .setImage(dogimg.url)
        .setURL(config.URLS.Website)
        .setColor(config.Settings.Color)
        .setThumbnail(config.Icons.Thumbnail)
        .setFooter({ iconURL: config.Icons.Icon, text: config.Auth.copright })
        .setTimestamp();
      interaction.editReply({ embeds: [embed], components: [row1] });
    } catch (error) {
      console.log(
        "[COMMANDS]".brightRed,
        ("Error fetching dog image: ", error)
      );
      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setURL(config.URLS.Website)
          .setLabel(config.Labels.Website)
          .setStyle(ButtonStyle.Link)
          .setEmoji(config.Emojis.Website),

      );
      const embedError = new EmbedBuilder()
        .setTitle(`${config.Settings.Name}'s Error`)
        .setDescription("Sorry, I couldn't fetch a dog image at the moment.")
        .setURL(config.URLS.Website)
        .setColor(config.Settings.Color)
        .setThumbnail(config.Icons.Thumbnail)
        .setImage(config.Icons.Banner)
        .setFooter({ iconURL: config.Icons.Icon, text: config.Auth.copright })
        .setTimestamp();

      interaction.followUp({ embeds: [embedError], components: [row1] });
    }
  },
};
//© 2024 Shadow Modz

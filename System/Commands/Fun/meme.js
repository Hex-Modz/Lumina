const { SlashCommandBuilder,EmbedBuilder,ButtonBuilder,ActionRowBuilder,ButtonStyle,ComponentType,ApplicationCommandOptionType, } = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync("./Configs/config.yml", "utf8"));
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Get a random meme"),
  async execute(interaction, client) {
    await interaction.deferReply();

    fetch("https://meme-api.com/gimme/dankmemes")
      .then((res) => {
        if (!res.ok) {
          console.log(
            "[COMMANDS]".brightRed,
            ("Failed to fetch meme, Meme API might be down or busy. ")
          );
          throw new Error("Failed to fetch meme, Meme API might be down or busy.");
        }
        return res.json();
      })
      .then((json) => {
        const data = json;
        const memeUrl = data.postLink;
        const memeImage = data.url;
        const memeTitle = data.title;
        const memeUpvotes = data.ups; // The Meme API may not provide upvotes, adjust accordingly if needed
        const memeNumComments = data.num_comments || 0; // The Meme API may not provide comments, set to 0 if not available

        const row1 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL(config.URLS.Website)
            .setLabel(config.Labels.Website)
            .setStyle(ButtonStyle.Link)
            .setEmoji(config.Emojis.Website),
        );

        const embed = new EmbedBuilder()
          .setTitle(memeTitle)
          .setURL(memeUrl)
          .setImage(memeImage)
          .setColor(config.Settings.Color)
          .setThumbnail(config.Icons.Thumbnail)
          .setFooter({
            text: `👍 ${memeUpvotes} 💬 ${memeNumComments}`,
          })
          .setTimestamp();
        interaction.editReply({ embeds: [embed] , components: [row1] });
      })
      .catch((error) => {
        console.log(
          "[COMMANDS]".brightRed,
          ("Error fetching meme: ", error)
        );
        const row1 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL(config.URLS.Website)
            .setLabel(config.Labels.Website)
            .setStyle(ButtonStyle.Link)
            .setEmoji(config.Emojis.Website),
        );
        const embedError = new EmbedBuilder()
          .addFields({
            name: `${config.MainSettings.Name}`,
            value: error.message,
            inline: true,
          })
          .setURL(config.URLS.Website)
          .setColor(config.Settings.Color)
          .setThumbnail(config.Icons.Thumbnail)
          .setImage(config.Icons.Banner)
          .setFooter({  iconURL: config.Icons.Icon,  text: config.Auth.copright })
          .setTimestamp();

        interaction.followUp({ embeds: [embedError] , components: [row1]});
      });
  },
};
//© 2024 Shadow Modz
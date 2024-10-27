const { SlashCommandBuilder,EmbedBuilder,ButtonBuilder,ActionRowBuilder,ButtonStyle,ComponentType,ApplicationCommandOptionType, } = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync("././Configs/config.yml", "utf8"));

const counterFile = './counter.json';

// Initialize the counter file if it does not exist
if (!fs.existsSync(counterFile)) {
  fs.writeFileSync(counterFile, JSON.stringify({ count: 0 }));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("usage")
    .setDescription(`Shows the usage statistics`),
  async execute(interaction, client) {
    // Read the current count from the counter file
    let counterData = JSON.parse(fs.readFileSync(counterFile, 'utf8'));
    counterData.count += 1;

    // Save the updated count back to the file
    fs.writeFileSync(counterFile, JSON.stringify(counterData));
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(config.URLS.Website)
        .setLabel(config.Labels.Website)
        .setStyle(ButtonStyle.Link)
        .setEmoji(config.Emojis.Website),
    );
    // Create the embed message
    const Page1 = new EmbedBuilder()
      .setTitle(`${config.Settings.Name} | Usage`)
      .setDescription(`> Here you can see the status for ${config.Settings.Name}`)
      .addFields([
        {
          name: "Servers",
          value: `${client.guilds.cache.size} Server${client.guilds.cache.size !== 1 ? 's' : ''}`,
          inline: true,
        },
        {
          name: "Users",
          value: `${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} Users`,
          inline: true,
        },
        {
          name: "Times Used",
          value: `${counterData.count} time${counterData.count !== 1 ? 's' : ''}`,
          inline: true,
        }
      ])
      .setURL(config.URLS.Website)
      .setColor(config.Settings.Color)
      .setThumbnail(config.Icons.Thumbnail)
      .setImage(config.Icons.Banner)
      .setFooter({  iconURL: config.Icons.Icon,  text: config.Auth.copright })
      .setTimestamp();

    await interaction.reply({ embeds: [Page1], components: [row1] });
  },
};
//© 2024 Shadow Modz
const { SlashCommandBuilder,EmbedBuilder,ButtonBuilder,ActionRowBuilder,ButtonStyle,ComponentType,ApplicationCommandOptionType, } = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync("././Configs/config.yml", "utf8"));
const path = require("path");

const categoryEmojis = {
  Fun: "😄",
  Info: "📜",
  Owner: "👑",
  Utility: "⚙️",
};

function getCommands(directory, commands = {}) {
  const filesOrDirectories = fs.readdirSync(directory, { withFileTypes: true });

  for (const item of filesOrDirectories) {
    const fullPath = path.join(directory, item.name);

    if (item.isDirectory()) {
      commands[item.name] = []; // Create a category for the directory
      getCommands(fullPath, commands); // Recursively get commands in the directory
    } else if (item.name.endsWith('.js')) {
      const commandName = item.name.replace('.js', ''); // Remove the .js extension
      const categoryName = path.basename(path.dirname(fullPath)); // Get the category name

      if (!commands[categoryName]) commands[categoryName] = []; // Initialize the category if it doesn't exist
      commands[categoryName].push(commandName); // Add the command to the category
    }
  }

  return commands; // Return the commands object
};


module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription(`View a list of all the commands`),
  async execute(interaction, client) {
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(config.URLS.Website)
        .setLabel(config.Labels.Website)
        .setStyle(ButtonStyle.Link)
        .setEmoji(config.Emojis.Website),
    );

    const commandsPath = path.resolve(__dirname, "../");
    const commandCategories = getCommands(commandsPath);

    const helpEmbed = new EmbedBuilder()
      .setTitle(`${config.Settings.Name}'s Commands`)
      .setDescription(
        `Thank you for choosing ${config.Settings.Name}! Should you encounter any issues, require assistance, or have suggestions for improving the bot, we invite you to connect with us on our [Discord server](https://shadowhub.dev/) and create a support ticket`
      )
      .setURL(config.URLS.Website)
      .setColor(config.Settings.Color)
      .setThumbnail(config.Icons.Thumbnail)
      .setImage(config.Icons.Banner)
      .setFooter({  iconURL: config.Icons.Icon,  text: config.Auth.copright })
      .setTimestamp();
    Object.entries(commandCategories).forEach(([category, commands]) => {
      if (commands.length) {
        const emoji = categoryEmojis[category] || "";
        helpEmbed.addFields({
          name: `**${emoji} ${category}**`,
          value: `\`${commands.join("`, `")}\``,
          inline: false,
        });
      }
    });

    await interaction.reply({ embeds: [helpEmbed], components: [row1] });
  },
};
//© 2024 Shadow Modz
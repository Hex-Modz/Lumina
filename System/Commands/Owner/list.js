const { SlashCommandBuilder,EmbedBuilder,ButtonBuilder,ActionRowBuilder,ButtonStyle,ComponentType,ApplicationCommandOptionType, } = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync("././Configs/config.yml", "utf8"));

// Function to split an array into chunks
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription(`List all servers ${config.Settings.Name} is in`),

  async execute(interaction, client, message) {
    if (interaction.user.id !== config.Settings.Owners) {
      // If not the owner, reply with an error message
      const ErrorMag = new EmbedBuilder()
        .setTitle(`${config.Settings.Name} Authorization Error!`)
        .addFields({
          name: `${interaction.user.username}`,
          value: `You are not authorized to use this command.`,
          inline: true,
        })
        .setURL(config.URLS.Website)
        .setColor(config.Settings.Color)
        .setThumbnail(config.Icons.Thumbnail)
        .setImage(config.Icons.Banner)
        .setFooter({  iconURL: config.Icons.Icon,  text: config.Auth.copright })
        .setTimestamp();
      interaction.reply({ embeds: [ErrorMag], ephemeral: true });
      return;
    }

    // Get the list of servers the bot is in
    const guildsList = client.guilds.cache.map((guild) => {
      const joinedAt = guild.joinedAt.toLocaleString(); // Get the joined timestamp in a readable format
      return `${guild.name} \n (ID: \`${guild.id}\`) \n Joined at: \`${joinedAt}\``;
    });

    // Split the guildsList into chunks to avoid exceeding message length limit
    const chunkedGuilds = chunkArray(guildsList, 10); // You can adjust the chunk size

    // Initialize pagination index
    let pageIndex = 0;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setLabel("Previous")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("Next")
        .setStyle(ButtonStyle.Primary)
    );

    // Function to create a paginated embed
    const createPaginatedEmbed = (pageIndex) => {
      const listservers = new EmbedBuilder()
        .setTitle(
          `${config.Settings.Name} Has Joined ${client.guilds.cache.size} Servers!`
        )
        .addFields({
          name: `${config.Settings.Name} is in: \n`,
          value: chunkedGuilds[pageIndex].join("\n"),
          inline: true,
        })
        .setURL(config.URLS.Website)
        .setColor(config.Settings.Color)
        .setThumbnail(config.Icons.Thumbnail)
        .setImage(config.Icons.Banner)
        .setFooter({  iconURL: config.Icons.Icon,  text: config.Auth.copright })
        .setTimestamp();

      return listservers;
    };

    // Send the initial paginated embed
    await interaction.reply({
      embeds: [createPaginatedEmbed(pageIndex)],
      components: [row],
      ephemeral: true,
    });

    // Define the filter for the button interaction
    const filter = (buttonInteraction) => {
      return (
        buttonInteraction.customId === "next" ||
        buttonInteraction.customId === "previous"
      );
    };

    // Create collector for button interactions
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    // Handle button interactions
    collector.on("collect", async (buttonInteraction) => {
      // Handle next button
      if (buttonInteraction.customId === "next") {
        pageIndex++;
      }
      // Handle previous button
      else if (buttonInteraction.customId === "previous") {
        pageIndex--;
      }

      // Ensure the index stays within bounds
      pageIndex = Math.max(0, Math.min(pageIndex, chunkedGuilds.length - 1));

      // Update the original reply with the new paginated embed
      await interaction.editReply({
        embeds: [createPaginatedEmbed(pageIndex)],
      });

      // Acknowledge the button click
      buttonInteraction.deferUpdate();
    });

    // Handle the end of the button interactions
    collector.on("end", (collected, reason) => {
      // Cleanup logic if needed
    });

  },
};
//© 2024 Shadow Modz
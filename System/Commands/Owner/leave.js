const { SlashCommandBuilder,EmbedBuilder,ButtonBuilder,ActionRowBuilder,ButtonStyle,ComponentType,ApplicationCommandOptionType, } = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync("././Configs/config.yml", "utf8"));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave the specified server")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("ID of the server to leave")
        .setRequired(true)
    ),
  async execute(interaction, client, message) {
    // Check if the user is the bot owner
    if (interaction.user.id !== config.Settings.Owners) {
      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setURL(config.URLS.Website)
          .setLabel(config.Labels.Website)
          .setStyle(ButtonStyle.Link)
          .setEmoji(config.Emojis.Website),
      );
      // If not the owner, reply with an error message
      const errorEmbed = new EmbedBuilder()
        .setTitle(`${interaction.client.user.username} Authorization Error!`)
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

      await interaction.reply({ embeds: [errorEmbed], components: [row1], ephemeral: true });
      return;
    }

    // If the user is the bot owner, proceed with leaving the server
    const serverId = interaction.options.getString("serverid");

    try {
      const guild = interaction.client.guilds.cache.get(serverId);
      if (guild) {
        await guild.leave();
        const row1 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL(config.URLS.Website)
            .setLabel(config.Labels.Website)
            .setStyle(ButtonStyle.Link)
            .setEmoji(config.Emojis.Website),
      
          new ButtonBuilder()
            .setURL(config.URLS.Gumroad)
            .setLabel(config.Labels.Gumroad)
            .setStyle(ButtonStyle.Link)
            .setEmoji(config.Emojis.Gumroad)
        );
        // 
        const successEmbed = new EmbedBuilder()
          .setTitle(`${config.Settings.Name} | Success`)
          .setDescription(
            `${config.Settings.Name} Has Left the server with ID: ${serverId}`
          )
          .setURL(config.URLS.Website)
          .setColor(config.Settings.Color)
          .setThumbnail(config.Icons.Thumbnail)
          .setImage(config.Icons.Banner)
          .setFooter({  iconURL: config.Icons.Icon,  text: config.Auth.copright })
          .setTimestamp();
        await interaction.reply({ embeds: [successEmbed], components: [row1], ephemeral: true });
      } else {
        const row1 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL(config.URLS.Website)
            .setLabel(config.Labels.Website)
            .setStyle(ButtonStyle.Link)
            .setEmoji(config.Emojis.Website),
      
          new ButtonBuilder()
            .setURL(config.URLS.Gumroad)
            .setLabel(config.Labels.Gumroad)
            .setStyle(ButtonStyle.Link)
            .setEmoji(config.Emojis.Gumroad)
        );
        // 
        const notFoundEmbed = new EmbedBuilder()
          .setTitle(`${config.Settings.Name} | Server ID Error`)
          .setDescription(
            `${config.Settings.Name} Was unable to find a server with the provided ID: ${serverId}`
          )
          .setURL(config.URLS.Website)
          .setColor(config.Settings.Color)
          .setThumbnail(config.Icons.Thumbnail)
          .setImage(config.Icons.Banner)
          .setTimestamp()
          .setFooter({
            text: `${config.Settings.Name} Error`,
            iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
          });
        await interaction.reply({ embeds: [notFoundEmbed], components: [row1], ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setURL(config.URLS.Website)
          .setLabel(config.Labels.Website)
          .setStyle(ButtonStyle.Link)
          .setEmoji(config.Emojis.Website),
    
     
      );
      const errorEmbed = new EmbedBuilder()
        .setTitle(`${config.Settings.Name} | Error`)
        .setDescription(
          `${config.Settings.Name} Has encountered an error while leaving the server with ID: ${serverId}`
        )
        .setURL(config.URLS.Website)
        .setColor(config.Settings.Color)
        .setThumbnail(config.Icons.Thumbnail)
        .setImage(config.Icons.Banner)
        .setTimestamp()
        .setFooter({
          text: `${config.Settings.Name} Error`,
          iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
        });
      await interaction.reply({ embeds: [errorEmbed], components: [row1], ephemeral: true});
    }
  },
};
//© 2024 Shadow Modz
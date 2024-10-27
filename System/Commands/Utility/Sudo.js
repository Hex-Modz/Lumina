const fs = require("fs");
const yaml = require("js-yaml");
const config = yaml.load(fs.readFileSync("././Configs/config.yml", "utf8"));
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sudo")
    .setDescription("Send a fake message from another user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to mention")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send")
        .setRequired(true)
    ),
  async execute(interaction, args) {
    if (!interaction.member.permissions.has("Administrator"))
      return interaction.reply({
        content: "you do not have permission to use this command",
        ephemeral: true,
      });
    try {
      const mentionedUser = interaction.options.getUser("user");
      if (!mentionedUser) {
        return interaction.reply({
          content: "Invalid arguments. Please mention a user.",
          ephemeral: true,
        });
      }

      const msg = interaction.options.getString("message");
      if (!msg || !msg.length) {
        return interaction.reply({
          content: "Invalid arguments. Please provide a message.",
          ephemeral: true,
        });
      }

      const channel = interaction.channel;
      let webhook = (await channel.fetchWebhooks()).find(
        (webhook) => webhook.name === "sudo"
      );
      if (!webhook) {
        webhook = await channel.createWebhook({
          name: "sudo",
          avatar: mentionedUser.displayAvatarURL({ dynamic: true }),
          reason: "Creating webhook for sudo command",
        });
      }

      webhook.send({
        content: msg,
        username: mentionedUser.username,
        avatarURL: mentionedUser.displayAvatarURL({ dynamic: true }),
      });

      return interaction.reply({
        content: "Sudo command executed successfully.",
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error trying to send a message:", error);
      return interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  },
};
//© 2024 Shadow Modz
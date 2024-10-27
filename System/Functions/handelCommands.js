const fs = require("fs");
const yaml = require("js-yaml");
const colors = require("colors");
const { REST, Routes } = require('discord.js');
const config = yaml.load(fs.readFileSync("./Configs/config.yml", "utf8"));
const clientId = config.Settings.BotID;

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (let folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../Commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }

        const rest = new REST({ version: '10' }).setToken(config.Settings.Token);

        try {
            console.log(`[DISCORD]`.magenta, `Started refreshing application (/) commands.`);

            await rest.put(Routes.applicationCommands(clientId), { body: client.commandArray });

            console.log(`[DISCORD]`.magenta, 'Successfully reloaded application (/) commands.');

        } catch (error) {
            console.error(error);
        }
    };
};
//© 2024 Shadow Modz
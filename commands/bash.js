const { SlashCommandBuilder } = require("discord.js");
const { runCommand } = require("../utils/os");
const { FILE_LIMIT } = require("../utils/config");
const { errorHandler } = require("../utils/helper");
const quote = require("shell-quote").quote;

var blackList = ["ls", "cat", "mv", "nc", "telnet", "cd", "/bin/bash", "flag", "FLAG"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bash")
        .setDescription("Execute any bash command. Just don't slip in some other commands")
        .addStringOption(option => option.setName("command").setDescription("Command").setRequired(true)),
    async execute(interaction) {
        const command = interaction.options.getString("command");

        console.log(`user ${interaction.user.id} ran custom command "${command}"`);

        if (/[a-zA-Z0-9]/gm.test(command) && /[$`()#!{}<\\’,;|&]/gm.test(command)) {
            command = quote(command);
        }

        var noExec = false
        blackList.forEach((c) => {
            if (command.includes(c)) {
                noExec = true;
            }
        });
        if (noExec) {
            return await interaction.reply("Sorry that command is black listed.");
        }

        try {
            var out = await runCommand(`${command}`, interaction.user.id);
        } catch (e) {
            return await interaction.reply(errorHandler(e));
        }

        await interaction.reply(`Bash: '\n${out}'`);
    },
};
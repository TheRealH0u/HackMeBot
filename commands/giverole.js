const { SlashCommandBuilder } = require("discord.js");
const { errorHandler } = require("../utils/helper");
const { runCommand } = require("../utils/os");
const quote = require("shell-quote").quote;
const { GUILD_ID } = require("../utils/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("giverole")
        .setDescription("Give role to a user.")
        .addStringOption(option => option.setName("role").setDescription("Role name").setRequired(true)),
    async execute(interaction) {
        console.log(`user ${interaction.user.id} ran giverole`);

        const role = interaction.options.getString("role");
        console.log(role.charCodeAt(0));

        if (role == "ADMIN") {
            return await interaction.reply(`Cannot give ADMIN role to you. Sorry.`);
        }

        //Check if role exists on server
        if (interaction.guild.roles.cache.some(r => r.name === role.toUpperCase())) {
            console.log(role.toUpperCase());
            let discordRole = interaction.guild.roles.cache.find(r => r.name === role.toUpperCase());
            console.log(discordRole);
            interaction.member.roles.add(discordRole);
            console.log(`Gave role ${discordRole.name} to user ${interaction.user.id}`);
        } else {
            return await interaction.reply("What role do you want exactly?");
        }

        return await interaction.reply(`Added role`);
    },
};
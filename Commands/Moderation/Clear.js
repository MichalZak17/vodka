const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { LogHandler } = require("./../../Handlers/LogHandler");
const { DatabaseHandler } = require("./../../Handlers/DatabaseHandler");

const Messages = require("./../../Messages.json")

module.exports = {
    moderatorOnly: true,
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear the messages from the channel")
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("Amount of messages to be cleared [1 - 100]")
                .setRequired(true)
            )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

        async execute(interaction) {
            const amount = interaction.options.getInteger("amount");

            if (amount > 100) {
                return await interaction.reply({ content: Messages.ClearCommands.TooManyMessages[Math.floor(Math.random() * Messages.ClearCommands.TooManyMessages.length)], ephemeral: true });
            } else if (amount < 1) {
                return await interaction.reply({ content: Messages.ClearCommands.TooFewMessages[Math.floor(Math.random() * Messages.ClearCommands.TooFewMessages.length)], ephemeral: true });
            }

            await interaction.channel.bulkDelete(amount, true).catch(error => { LogHandler.logException(error); });

            await DatabaseHandler.log(interaction.guild.id, 6, `${interaction.member.user.tag} cleared ${amount} messages from ${interaction.channel.name}.`)

            return await interaction.reply({ content: Messages.ClearCommands.ClearCommandSuccess[Math.floor(Math.random() * Messages.ClearCommands.ClearCommandSuccess.length)], ephemeral: true });
        }
};
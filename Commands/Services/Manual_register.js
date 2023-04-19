const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { DatabaseHandler } = require("./../../Handlers/DatabaseHandler");

const Messages = require("./../../Messages.json");

module.exports = {
    moderatorOnly: true,
	data: new SlashCommandBuilder()
		.setName('manual_register')
		.setDescription('Manually register all the users in the server to the users database table.'),

	async execute(interaction) {

        // Check if the server is already registered in the database.

        const server = await DatabaseHandler.query(`SELECT * FROM servers WHERE id = ${interaction.guild.id}`);

        // If the server is not registered, register it.

        if (server.length === 0) {
            await DatabaseHandler.query(`INSERT INTO servers (id) VALUES (${interaction.guild.id})`);
            await DatabaseHandler.log(interaction.guild.id, 6, `The server ${interaction.guild.name} has been added to the database.`);
        }

        // Check if the users are already registered in the database.

        const members = await interaction.guild.members.fetch();

        members.forEach(async member => {
            const inDatabase = await DatabaseHandler.query(`SELECT * FROM users WHERE user_id = ${member.user.id}`);

            if (inDatabase.length === 0) {
                await DatabaseHandler.query(`INSERT INTO users (user_id, server_id) VALUES (${member.user.id}, ${interaction.guild.id})`);
                await DatabaseHandler.log(interaction.guild.id, 6, `The user ${member.user.tag} has been added to the database.`);
            }
        });

        // Send the reply.

        const manualRegisterEmbed = new EmbedBuilder()
            .setColor(Messages.Colors.default)
            .setTitle("Manual Register")
            .setDescription("All the users in the server have been registered.")

        return await interaction.reply({ embeds: [manualRegisterEmbed], ephemeral: true });
	},
};
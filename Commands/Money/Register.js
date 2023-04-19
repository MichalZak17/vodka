const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { DatabaseHandler } = require("./../../Handlers/DatabaseHandler");

const Messages = require("./../../Messages.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Register your account to start playing Money Heist game.'),

	async execute(interaction) {

		// Check if the user is already registered in users database table.

		const inDatabase = await DatabaseHandler.query(`SELECT * FROM users WHERE user_id = ${interaction.member.user.id}`);

		if (inDatabase.length === 0) {
			await DatabaseHandler.query(`INSERT INTO users (user_id, server_id) VALUES (${interaction.member.user.id}, ${interaction.guild.id})`);
			await DatabaseHandler.log(interaction.guild.id, 6, `The user ${interaction.member.user.tag} has been added to the database.`);
		}

        // Check if the user is already registered in game_money database table.

		const user = await DatabaseHandler.query(`SELECT * FROM game_money WHERE user_id = ${interaction.member.user.id}`);

		if (user.length > 0) {
			const alreadyRegisteredEmbed = new EmbedBuilder()
				.setColor(Messages.Colors.default)
				.setTitle("Money Heist Registration")
				.setDescription(Messages.Money.AlreadyRegistered[Math.floor(Math.random() * Messages.Money.AlreadyRegistered.length)])

			return await interaction.reply({ embeds: [alreadyRegisteredEmbed], ephemeral: true });
		}

		// Register the user in game_money database table.

		await DatabaseHandler.query(`INSERT INTO game_money (user_id, wallet, bank, credit) VALUES (${interaction.member.user.id}, 0, 5000, 0)`);
		await DatabaseHandler.log(interaction.guild.id, 6, `The user ${interaction.member.user.tag} has registered to Money Heist game.`);

		const registeredEmbed = new EmbedBuilder()
			.setColor(Messages.Colors.default)
			.setTitle("Money Heist Registration")
			.setDescription("You have successfully registered to Money Heist game. You can now start playing.")

		return await interaction.reply({ embeds: [registeredEmbed], ephemeral: true });
	},
};
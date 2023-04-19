const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { DatabaseHandler } = require("./../../Handlers/DatabaseHandler");
const Messages = require("./../../Messages.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('transfer')
		.setDescription('Transfer money to another user.')
		.addUserOption(option => 
			option.setName('user')
			.setDescription('The intended recipient of the funds transfer.')
			.setRequired(true)
		)
		.addIntegerOption(option =>
			option.setName('amount')
			.setDescription('The monetary value to be transferred.')
			.setRequired(true)
		),

	async execute(interaction) {
		const { options } = interaction;

		const user = options.getUser('user');
		const member = await interaction.guild.members.fetch(user.id);
		const amount = options.getInteger('amount');

		const [giver_money] = await DatabaseHandler.query(`SELECT * FROM game_money WHERE user_id = ${interaction.member.user.id}`);

		if (giver_money.bank < amount) {
			return await interaction.reply({ content: Messages.MoneyHeistGame.NotEnoughMoney[Math.floor(Math.random() * Messages.MoneyHeistGame.NotEnoughMoney.length)], ephemeral: true });
		}
		
		await DatabaseHandler.query(`UPDATE game_money SET bank = bank + ${amount} WHERE user_id = ${member.user.id}`);
		await DatabaseHandler.query(`UPDATE game_money SET bank = bank - ${amount} WHERE user_id = ${interaction.member.user.id}`)

		const transferEmbed = new EmbedBuilder()
			.setColor(0x00FF00)
			.setTitle("Money Transfer")
			.setDescription(`The transfer has been successfully completed. Funds have been transferred accurately and securely. You can check your balance by using the \`/balance\` command.`)
			.setTimestamp();

		await interaction.reply({ embeds: [transferEmbed], ephemeral: true });

		const DMTransferEmbed = new EmbedBuilder()
			.setColor(0x00FF00)
			.setTitle('Money Transfer')
			.setDescription(`Transfer of **${amount}**$ has been successfully completed from the account of **${interaction.member.user.tag}** to your account. You can check your balance by using the \`/balance\` command.`)
			.setTimestamp()

		await member.user.send({ embeds: [DMTransferEmbed], ephemeral: true });

		await DatabaseHandler.addHistory(interaction.member.user.id, user.id, "transfer", amount);
		return await DatabaseHandler.log(interaction.guild.id, 6, `${interaction.member.user.tag} has transferred ${amount}$ to ${member.user.tag}.`)
	},
};
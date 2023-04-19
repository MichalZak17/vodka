const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { DatabaseHandler } = require("./../../Handlers/DatabaseHandler");

const Messages = require("./../../Messages.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Information about the current balance of your account.'),

	async execute(interaction) {
		const [user_money] = await DatabaseHandler.query(`SELECT * FROM game_money WHERE user_id = ${interaction.member.user.id}`);

        const balanceEmbed = new EmbedBuilder()
            .setColor(Messages.Colors.default)
            .setTitle("Balance")
            .setDescription(`Current balance of all your accounts`)
            .addFields(
                { name: "Bank", value: `${user_money.bank}$`, inline: true },
                { name: "Wallet", value: `${user_money.wallet}$`, inline: true },
                { name: "Credit", value: `${user_money.credit}$`, inline: true },
                { name: "Total", value: `${user_money.bank + user_money.wallet}$`, inline: true }
            )            
            .setTimestamp();

        return await interaction.reply({ embeds: [balanceEmbed], ephemeral: true });
	},
};
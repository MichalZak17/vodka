const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { DatabaseHandler } = require("./../../Handlers/DatabaseHandler");
const Messages = require("./../../Messages.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bet')
        .setDescription(`Bet your virtual money to win more!`)
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of money you want to bet.')
                .setRequired(true)
        ),

	async execute(interaction) {
        const { options } = interaction;
        const amount = options.getInteger('amount');

        // Check if user have enough money on credit account
        const [user_money] = await DatabaseHandler.query(`SELECT * FROM game_money WHERE user_id = ${interaction.member.user.id}`);
        if (user_money.credit < amount) { return await interaction.reply({ content: "You do not have enough money on your credit account.", ephemeral: true }); }

        // Generate random number between 0 and 10
        const random = Math.floor(Math.random() * 10);

        // If the number is smaller then 6, the user has lost
        if (random < 6) {
            await DatabaseHandler.query(`UPDATE game_money SET credit = credit - ${amount} WHERE user_id = ${interaction.member.user.id}`);
            
            const lostEmbed = new EmbedBuilder()
                .setColor(Messages.Colors.error)
                .setTitle("Bet result")
                .setDescription(`You have lost **${amount}**$!`)
                .setTimestamp();

            return await interaction.reply({ embeds: [lostEmbed], ephemeral: true });
        } else {
            await DatabaseHandler.query(`UPDATE game_money SET credit = credit + ${amount} WHERE user_id = ${interaction.member.user.id}`);

            const wonEmbed = new EmbedBuilder()
                .setColor(Messages.Colors.success)
                .setTitle("Bet result")
                .setDescription(`You have won **${amount}**$!`)
                .setTimestamp();

            return await interaction.reply({ embeds: [wonEmbed], ephemeral: true });
        }
		
	},
};
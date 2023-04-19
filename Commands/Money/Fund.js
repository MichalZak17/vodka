const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { DatabaseHandler } = require("./../../Handlers/DatabaseHandler");

const Messages = require("./../../Messages.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fund')
		.setDescription('Transfer money between your accounts.')
        .addStringOption(option =>
            option.setName('account')
                .setDescription('The account you want to transfer money from.')
                .setRequired(true)
                .addChoices(
                    { name: 'Bank', value: 'bank' },
                    { name: 'Wallet', value: 'wallet' },
                    { name: 'Credit', value: 'credit' }
                )          
        )
        .addStringOption(option =>
            option.setName('target')
                .setDescription('The account you want to transfer money to.')
                .setRequired(true)
                .addChoices(
                    { name: 'Bank', value: 'bank' },
                    { name: 'Wallet', value: 'wallet' },
                    { name: 'Credit', value: 'credit' }
                )
        )
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of money you want to transfer.')
                .setRequired(true)
        ),

	async execute(interaction) {
		const { options } = interaction;

        const account = options.getString('account');
        const target = options.getString('target');
        const amount = options.getInteger('amount');

        if (account === target) { return await interaction.reply({ content: "You cannot transfer money between the same accounts.", ephemeral: true }); }

        if (amount <= 0) { return await interaction.reply({ content: "You cannot transfer a negative amount of money.", ephemeral: true }); }

        const [user_money] = await DatabaseHandler.query(`SELECT * FROM game_money WHERE user_id = ${interaction.member.user.id}`);

        if (account === 'bank') { 
            if (user_money.bank < amount) { 
                return await interaction.reply({ content: "You do not have enough money in your bank account.", ephemeral: true }); 
            }
        } else if (account === 'wallet') {
            if (user_money.wallet < amount) { 
                return await interaction.reply({ content: "You do not have enough money in your wallet.", ephemeral: true }); 
            }
        } else if (account === 'credit') {
            if (user_money.credit < amount) { 
                return await interaction.reply({ content: "You do not have enough money in your credit account.", ephemeral: true }); 
            }
        }

        if (target === 'bank') {
            await DatabaseHandler.query(`UPDATE game_money SET bank = ${user_money.bank + amount} WHERE user_id = ${interaction.member.user.id}`);
        } else if (target === 'wallet') {
            await DatabaseHandler.query(`UPDATE game_money SET wallet = ${user_money.wallet + amount} WHERE user_id = ${interaction.member.user.id}`);
        } else if (target === 'credit') {
            await DatabaseHandler.query(`UPDATE game_money SET credit = ${user_money.credit + amount} WHERE user_id = ${interaction.member.user.id}`);
        }

        if (account === 'bank') {
            await DatabaseHandler.query(`UPDATE game_money SET bank = ${user_money.bank - amount} WHERE user_id = ${interaction.member.user.id}`);
        } else if (account === 'wallet') {
            await DatabaseHandler.query(`UPDATE game_money SET wallet = ${user_money.wallet - amount} WHERE user_id = ${interaction.member.user.id}`);
        } else if (account === 'credit') {
            await DatabaseHandler.query(`UPDATE game_money SET credit = ${user_money.credit - amount} WHERE user_id = ${interaction.member.user.id}`);
        }

        const fundEmbed = new EmbedBuilder()
            .setColor(Messages.Colors.success)
            .setTitle("Fund")
            .setDescription(`You have successfully transferred ${amount}$ from your ${account} account to your ${target} account.`)
            .setTimestamp();

        return await interaction.reply({ embeds: [fundEmbed], ephemeral: true });
	},
};
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { DatabaseHandler } = require("./../../Handlers/DatabaseHandler");

const Messages = require("./../../Messages.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('attack')
		.setDescription('Attack a user and steal their money from their wallet.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you want to attack.')
                .setRequired(true)
        ),

	async execute(interaction) {
        const { options } = interaction;

        const user = options.getUser('user');

        if (user.id === interaction.member.user.id) { return await interaction.reply({ content: "You cannot attack yourself.", ephemeral: true }); }
        if (user.bot) { return await interaction.reply({ content: "You cannot attack a bot.", ephemeral: true }); }

        // Check if the user is trying to attack a user that is not in the game_money table

        const [user_money_exists] = await DatabaseHandler.query(`SELECT * FROM game_money WHERE user_id = ${user.id}`);
        if (!user_money_exists) { 
            const failEmbed = new EmbedBuilder()
                .setColor(Messages.Colors.error)
                .setTitle("Attack Failed")
                .setDescription(`**${user.username}** is not registered in the game. You cannot attack them.`)
            
            
            return await interaction.reply({ embeds: [failEmbed] });
        }
        
        const random = Math.floor(Math.random() * 2);

        async function performAttack(interaction, user, amount, isSuccessful, message) {
            if (isSuccessful) {
                await DatabaseHandler.query(`UPDATE game_money SET wallet = wallet + ${amount} WHERE user_id = ${interaction.member.user.id}`);
                await DatabaseHandler.query(`UPDATE game_money SET wallet = wallet - ${amount} WHERE user_id = ${user.id}`);
            } else {
                await DatabaseHandler.query(`UPDATE game_money SET bank = bank - ${amount} WHERE user_id = ${interaction.member.user.id}`);
                await DatabaseHandler.query(`UPDATE game_money SET bank = bank + ${amount} WHERE user_id = ${user.id}`);
            }
        
            // Create and send the message
            const embed = new EmbedBuilder()
                .setColor(message.color)
                .setTitle("Attack")
                .setDescription(message.description.replace(/\{attacker\}/g, interaction.member.user.username).replace(/\{victim\}/g, user.username).replace(/\{amount\}/g, `${amount}$`));
        
            await interaction.reply({ embeds: [embed] });
        
            // Add the attack to the history
            await DatabaseHandler.addHistory(interaction.member.user.id, user.id, "attack", amount);
        }
        
        // 0 = Fail
        // 1 = Success
        const isSuccessful = (random === 1);
        if (isSuccessful) {
            const [user_money] = await DatabaseHandler.query(`SELECT * FROM game_money WHERE user_id = ${user.id}`);
            const random_amount = Math.floor(Math.random() * user_money.wallet);
            await performAttack(interaction, user, random_amount, true, {
                color: Messages.Colors.success,
                description: "**{attacker}** has successfully attacked **{victim}** and stole **{amount}** from their wallet.",
            });
        } else {
            const [user_money] = await DatabaseHandler.query(`SELECT * FROM game_money WHERE user_id = ${interaction.member.user.id}`);
            const random_amount = Math.floor(Math.random() * user_money.bank);
            await performAttack(interaction, user, random_amount, false, {
                color: Messages.Colors.error,
                description: "**{attacker}** has failed to attack **{victim}** and lost **{amount}** from their bank account. The police have been notified and are ordering **{attacker}** to pay **{amount}** to **{victim}** within 24 hours.",
            });
        }
        
        
	},
};
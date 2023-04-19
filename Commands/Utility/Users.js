const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const Messages = require('./../../Messages.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
        
	async execute(interaction) {
		const userEmbed = new EmbedBuilder()
			.setColor(Messages.Colors.default)
			.setTitle('User Info')
			.setThumbnail(interaction.user.displayAvatarURL())
			.setDescription(`Name: **${interaction.user.tag}**\nID: **${interaction.user.id}**\nJoined: **${interaction.user.createdAt}**`)
			.setTimestamp();

		return await interaction.reply({ embeds: [userEmbed] });
	},
};
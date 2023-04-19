const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const Messages = require('./../../Messages.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Display info about this server.'),
        
	async execute(interaction) {

		const serverEmbed = new EmbedBuilder()
			.setColor(Messages.Colors.default)
			.setTitle('Server Info')
			.setDescription(`Name: **${interaction.guild.name}**\nID: **${interaction.guild.id}**\nMembers: **${interaction.guild.memberCount}**`)
			.setTimestamp();

		return await interaction.reply({ embeds: [serverEmbed] });
	},
};
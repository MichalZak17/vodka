const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const Messages = require("./../../Messages.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),

	async execute(interaction) {
		return await interaction.reply(`Pong!`);
	},
};
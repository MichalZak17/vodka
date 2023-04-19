const joke = require("one-liner-joke");
const Messages = require("./../../Messages.json");

const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("joke")
        .setDescription("Get a really unfunny random joke."),

    async execute(interaction) {
        let jokeEmbed = new EmbedBuilder()
            .setDescription(joke.getRandomJoke().body)
            .setColor(Messages.Colors.default)
            .setTimestamp();

        return interaction.reply({ embeds: [jokeEmbed] });
    }
};
const Discord = require("discord.js");
const CONFIG_CHANNELS = require("../Config/Channels.json");

module.exports.run = async (bot, message, args) => {
    if (!CONFIG_CHANNELS.action_channel) {
        message.channel.send("The action_channel is not set in the config file!").then(msg => { setTimeout(() => { msg.delete(); }, 5000) });
        return;
    }
    
    let Suggestion = args.slice(0).join(" ");
    let date = new Date();

    let SuggestionEmbed = new Discord.MessageEmbed()
        .setColor("#6dff00")
        .setTitle("Suggestion")
        .addField("Created by: ", message.author.username)
        .addField("In channel: ", message.channel.name)
        .addField("Suggested at: ", date.toLocaleString())
        .addField("Suggestion: ", Suggestion) 

    message.guild.channels.cache.get(CONFIG_CHANNELS.action_channel).send({embeds: [SuggestionEmbed]}).then(() => {
        message.channel.send("Your suggestion has been sent to the moderation team!").then(msg => { setTimeout(() => { msg.delete(); }, 5000) });
    });

    message.channel.messages.fetch(message.id).then(msg => { setTimeout(() => { msg.delete(); }, 5000) });
}        

module.exports.help = {
    name: "SuggestionCommend",
    command: "suggest",
    type: "command"
}
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    message.channel.messages.fetch(message.id).then(msg => { setTimeout(() => { msg.delete(); }, 5000) });
    message.reply("This command is currently under development!").then(msg => { setTimeout(() => { msg.delete(); }, 5000) });
}

module.exports.help = {
    name: "ClearCommend",
    command: "help",
    type: "command"
}
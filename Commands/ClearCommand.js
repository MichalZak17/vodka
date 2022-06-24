const Discord = require("discord.js");
const config = require("../config.json");
const functions = require("../functions.js");

module.exports.run = async (bot, message, args) => {
    if (!functions.hasRole(message.member, config.Roles.ADMINISTRATION)) { 
        message.reply("You don't have permission to use this command!").then(msg => { setTimeout(() => { msg.delete(); }, 5000) }); 
        return; 
    }

    if (!args[0]) { message.reply("Please specify the number of messages to be deleted!").then(msg => { setTimeout(() => { msg.delete(); }, 5000) }); return; }
    if (args[0] > 99) { message.reply("Please specify a number less than 100!").then(msg => { setTimeout(() => { msg.delete(); }, 5000) }); return; }

    while (args[0] > 0) {
        args[0]
        try { 
            message.channel.bulkDelete(args[0])
        } catch { return; }
    }
}

module.exports.help = {
    name: "ClearCommend",
    command: "clear",
    type: "command"
}
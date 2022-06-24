const Discord = require("discord.js");
const config = require("../config.json");
const functions = require("../functions.js");

module.exports.run = async (bot, message, args) => {
    message.channel.messages.fetch(message.id).then(msg => { setTimeout(() => { msg.delete(); }, 5000) });

    if (!functions.hasRole(message.member, config.Roles.ADMINISTRATION)) { 
        message.reply("You don't have permission to use this command!").then(msg => { setTimeout(() => { msg.delete(); }, 5000) }); 
        return;
    }

    let KickReason = args.slice(0).join(" ");
    let KickUser = (message.mentions.users.first() || message.guild.members.cache.get(args[0]));

    if (!KickUser) { message.reply("Please mention a user to ban!").then(msg => { setTimeout(() => { msg.delete(); }, 5000) }); return; }

    let date = new Date();

    let KickEmbed = new Discord.MessageEmbed()
        .setColor("#E3A452")
        .setTitle("Kick")
        .setDescription(`You have been kicked from **${message.guild.name}** Server!`)
        .addField("Kicked User: ", KickUser.tag)
        .addField("Kicked by: ", message.author.username)
        .addField("Kicked at: ", date.toLocaleString())
        .addField("Reason: ", KickReason)
        .addField("Cancellation", "If you think this is a mistake, please contact the server moderation!")   

    KickUser.send({embeds: [KickEmbed]}).then(() => { setTimeout(() => { message.guild.members.cache.get(KickUser.id).kick(); }, 1000) });
}

module.exports.help = {
    name: "KickSystem",
    command: "kick",
    type: "command"
}

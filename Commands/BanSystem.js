const Discord = require("discord.js");
const config = require("../config.json");
const functions = require("../functions.js");

module.exports.run = async (bot, message, args) => {
    message.channel.messages.fetch(message.id).then(msg => { setTimeout(() => { msg.delete(); }, 5000) });

    if (!functions.hasRole(message.member, config.Roles.ADMINISTRATION)) { 
        message.reply("You don't have permission to use this command!").then(msg => { setTimeout(() => { msg.delete(); }, 5000) }); 
        return;
    }

    let BanReason = args.slice(0).join(" ");
    let BanUser = (message.mentions.users.first() || message.guild.members.cache.get(args[0]));

    if (!BanUser) { message.reply("Please mention a user to ban!").then(msg => { setTimeout(() => { msg.delete(); }, 5000) }); return; }

    let date = new Date();
    

    let BanEmbed = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle("Ban")
        .setDescription(`You have been banned from **${message.guild.name}** Server!`)
        .addField("Banned User: ", BanUser.tag)
        .addField("Banned by: ", message.author.username)
        .addField("Banned at: ", date.toLocaleString())
        .addField("Reason: ", BanReason)
        .addField("Cancellation", "If you think this is a mistake, please contact the server moderation!")        

    try { BanUser.send({embeds: [BanEmbed]}); } catch (err) { console.log(err); }

    message.guild.members.cache.get(BanUser.id).ban();
}

module.exports.help = {
    name: "BanCommend",
    command: "ban",
    type: "command"
}
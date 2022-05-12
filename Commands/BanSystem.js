const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    var a = message.id;
    let errfind;

    if (message.member.roles.has("AdministratorRoleID") || message.member.roles.has("ModeratorRoleID")) {
        let BanReason = args.join(" ").slice(22);
        let BanUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if (!BanUser) { message.channel.send("Unable to find this user."); }
        else { if (BanUser.roles.has("AdministratorRoleID") || BanUser.roles.has("ModeratorRoleID")) { message.channel.send("This person cannot be banned."); }
            else {
                let BanEmbed = new Discord.RichEmbed()
                    .setDescription("Ban")
                    .setColor("#ff0000")
                    .addField("Banned user: ", `${BanUser}`)
                    .addField("Banned by: ", `<@${message.author.id}>`)
                    .addField("Banned on channel: ", message.channel)
                    .addField("Time: ", message.createdAt)
                    .addField("Reason: ", BanReason);

                let IncidentChannel = message.guild.channels.get("IncidentChannelID");
                message.guild.member(BanUser).ban(BanReason).catch(err =>{
                    errfind = err;
                });
                if(!errfind){
                    IncidentChannel.send(BanEmbed);
                }
                else{
                    //an error usually occurs when the bot may not get appropriate permissions
                    //leads to a "Discord API: No permission error", to check that we check for errors
                    IncidentChannel.send("An error occured. This happens when I don't have necessary permissions!!\n\nTip: Bots have complicated permissions. Kick them manually.")
                }
                message.channel.messages.fetch(a).then(msg => msg.delete({ timeout: 1000 }));//this will only delete the first ban message
            }
        }
    }
}

module.exports.help = {
    name: "BanCommend",
    command: "ban",
    type: "command"
}

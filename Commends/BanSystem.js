const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

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
                message.guild.member(BanUser).ban(BanReason);
                IncidentChannel.send(BanEmbed);
                message.delete(1);
            }
        }
    }
}

module.exports.help = {
    name: "BanCommend",
    command: "ban",
    type: "command"
}
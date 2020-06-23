const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    if (message.member.roles.has("AdministratorRoleID") || message.member.roles.has("ModeratorRoleID")) {

        let KickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if (!KickUser) { message.channel.send("Unable to find this user."); }
        let KickReason = args.join(" ").slice(22);
        if (KickUser.roles.has("AdministratorRoleID") || KickUser.roles.has("ModeratorRoleID")) { message.channel.send("This person cannot be banned."); }
        else {
            let KickEmbed = new Discord.RichEmbed()
                .setDescription("Kick")
                .setColor("#ff0000")
                .addField("Kicked user: ", `${KickUser}`)
                .addField("Kicked by: ", `<@${message.author.id}> `)
                .addField("Kicked on channel: ", message.channel)
                .addField("Time: ", message.createdAt)
                .addField("Reason: ", KickReason);

            let KickChannel = message.guild.channels.get("KickChannelID");
            message.guild.member(KickUser).kick(KickReason);
            KickChannel.send(KickEmbed);} }
    else { message.channel.send("You can not do it."); }
}

module.exports.help = {
    name: "KickSystem",
    command: "kick",
    type: "command"
}
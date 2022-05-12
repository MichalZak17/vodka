const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    var a = message.id;
    let ReportedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if (!ReportedUser) { message.channel.send("Unable to find this user."); }
    else {
        let ReportReason = args.join(" ").slice(22);

        let ReportEmbed = new Discord.RichEmbed()
            .setDescription("Report")
            .setColor("ffbe00")
            .addField("Reported user: ", `${ReportedUser}`)
            .addField("Reported by: ", `${message.author}`)
            .addField("Reported on channel: ", message.channel)
            .addField("Time: ", message.createdAt)
            .addField("Reason: ", ReportReason);

        let ReportChannel = message.guild.channels.get("ReportChannelID");
        message.channel.messages.fetch(a).then(msg => msg.delete({ timeout: 1000 }));// deletes only the report text by author and nothing else
        ReportChannel.send(ReportEmbed);
    }
}

module.exports.help = {
    name: "ReportCommend",
    command: "report",
    type: "command"
}

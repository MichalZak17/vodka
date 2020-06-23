const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

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
        message.delete().catch(O_o => { });
        ReportChannel.send(ReportEmbed);
    }
}

module.exports.help = {
    name: "ReportCommend",
    command: "report",
    type: "command"
}
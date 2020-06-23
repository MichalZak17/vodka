const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {

    if (message.member.roles.has("VeryficatedRoleID")) {
        let Suggestion = args.join(" ").slice(22);
        let SuggestionUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        message.delete();

                let SuggestionEmbed = new Discord.RichEmbed()
                    .setDescription("Suggestion")
                    .setColor("#6dff00")
                    .addField("Suggested by: ", `<@${SuggestionUser}>`)
                    .addField("Suggested on channel: ", message.channel)
                    .addField("Time: ", message.createdAt)
                    .addField("Suggestion: ", Suggestion);

        let SuggestionChannel = message.guild.channels.get("SuggestionChannelID");
        SuggestionChannel.send(SuggestionEmbed);
        message.delete(1);
            }
        }

module.exports.help = {
    name: "SuggestionCommend",
    command: "suggest",
    type: "command"
}
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  if (message.channel.id == "ArchivesChannelID" || message.channel.id == "SomeOtherChaannelID") { 
      message.delete(); message.reply("You can not do it."); }
        else { 
            if (message.member.roles.has("AdministratorRoleID") || message.member.roles.has("ModeratorRoleID")) {
                if (!args[0]) { message.member.createDM().then(channel => { channel.send("Invalid number of messages to delete."); }); }
                else {  message.delete(); message.channel.bulkDelete(args[0]).then(() => { message.channel.send(`${args[0]} deleted messages.`).then(msg => msg.delete(2000)); }); } }
            else { message.delete(); message.send("Nie mozesz tego zrobic."); } } 
}
module.exports.help = {
    name: "ClearCommend",
    command: "clear",
    type: "command"
}

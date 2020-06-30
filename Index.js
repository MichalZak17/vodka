const config = require("./Config-Bot.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({ disableEveryone: true });
bot.commands = new Discord.Collection();

{
    fs.readdir("./Commends/", (err, files) => {
        if (err) console.log(err);
        let jsfile = files.filter(f => f.split(".").pop() === "js");
        if (jsfile.length <= 0) { console.log(`[${time().add(2, "hours").format('LTS')}]` + "Couldn't find commands."); }

        jsfile.forEach((f, a) => {
            let props = require(`./Commends/${f}`);
            console.log(`${f} Loaded.`);
            bot.commands.set(props.help.command, props);
        });
    });
}

bot.on("ready", async () => {
    console.log("Server Bot: Online");
    bot.user.setActivity("Server ( ͡° ͜ʖ ͡°)", { type: 'WATCHING' });
});

bot.on("messageReactionAdd", (reaction, user) => {
    reaction.message.guild.members.forEach(member => {
        if (user.id == member.user.id) {            
            if (reaction.emoji.name === "✅") { member.removeRole("UnverifiedRoleID"); member.addRole("VeryficatedRoleID"); }
            if (reaction.emoji.name === "❌") { member.kick();  } 
        }
    });
});

bot.on('guildMemberAdd', member => {
    function WelcomeFunction() {
        member.addRole(member.guild.roles.get("UnverifiedRoleID"));
        member.guild.channels.get("WelcomeChannelID").send("Welcome" + member + " to the official server of the ** SERVER NAME **. Before using the server, please read our regulations,\n " + member.guild.channels.get("RegulationsChannelID") + " and then select ✅ or ❌.").then(async (suggestion) => { suggestion.react(`✅`).then(() => suggestion.react(`❌`)); }); } WelcomeFunction();
});

bot.on("message", async message => {
    if (message.author.bot) { return; }
    if (message.channel.type == "dm") { return; }

    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);


    //        let Embed = new Discord.RichEmbed()
    //            .setDescription("Description")
    //            .setColor("#32c000")
    //            .addField("TEXT­­")
    //            .addField("TEXT");

    //        switch (message.content.toLowerCase()) {
    //            case "commend":
    //            case "/commend":
    //            case "/commend":
    //            case "commend": { message.delete(); message.channel.send(Embed); break; }
    //            default: { break; }
    //        }
    //    }
    //}


    
    
    

    let prefix = config.prefix;
    let cmd = messageArray[0];
    if (cmd.substring(0, prefix.length) != config.prefix) return;
    cmd = cmd.substring(prefix.length, messageArray[0].length).toLowerCase();
    let commandfile = bot.commands.get(cmd);
    if (commandfile) commandfile.run(bot, message, args);       


    switch (message.content.toLowerCase()) { case "commend": { message.member.guild.channels.get("ChannelID").send("Message"); break; } }
                
        switch (cmd) { case "commend": { message.member.guild.channels.get("ChannelID").send("Message");  break; }
            default: { break; } }
        


});

bot.login(config.token);

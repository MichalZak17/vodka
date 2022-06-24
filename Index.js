const Discord = require('discord.js');
const MySQL = require('mysql');

const fs = require('fs');
const functions = require('./functions.js');

const fabric_config = {
    "Settings": {
        "Global": {
            "token": "",
            "prefix": "!",
            "return_dms": true,
            "return_bot": true
        }
    },

    "Channels": {
        "general": "984542381779091557",
        "weather": "",
        "music": "",
        "welcome": "984542381779091557",

        "logs": "",
    },

    "Roles": {
        "ADMINISTRATION": {
            "admin": "984548066675806278",
            "moderator": "984547809070026832"
        },

        "welcome": "",
        "muted": ""
    },
    
    "Messages": {
        "welcome": ["Hello, ${member}!", "Welcome to the server!"],
    },

    "Database": {
        "Host": "127.0.0.1",
        "User": "root",
        "Password": "root",
        "Port": "3306",
        "Database": "mydb"
    }
}

if (!fs.existsSync("./config.json")) { fs.writeFileSync("./config.json", JSON.stringify(fabric_config)); }

const config = require('./config.json');

const client = new Discord.Client({ intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_BANS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_INTEGRATIONS",
    "GUILD_WEBHOOKS",
    "GUILD_INVITES",
    "GUILD_VOICE_STATES",
    "GUILD_PRESENCES",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING",
    "GUILD_SCHEDULED_EVENTS"
] });

// -------------------------------------------------------------------------------------------------------------------

client.commands = new Discord.Collection();

fs.readdir("./Commands/", (err, files) => {
    if (err) return console.error(err);
    let jsFile = files.filter(f => f.split(".").pop() === "js");
    if (jsFile.length <= 0) return console.log("[ERROR] No commands found!");

    jsFile.forEach((f, i) => {
        let props = require(`./Commands/${f}`);
        console.log(`[INFO] Loaded ${f}!`);
        client.commands.set(props.help.command, props);
    });
});

// -------------------------------------------------------------------------------------------------------------------

client.on("guildMemberAdd", (member) => {
    if (!config.Channels.welcome) { return; }
    if (!config.Messages.welcome) { return; }

    let date = new Date();
    
    fs.appendFileSync("./logs/messages.log", `${date.toLocaleString()} | ${member.user.username} has joined the server\n`);

    member.guild.channels.cache.get(config.Channels.welcome).send(functions.random(config.Messages.welcome));

    if (config.Roles.welcome) { member.roles.add(config.Roles.welcome); }
});

// -------------------------------------------------------------------------------------------------------------------

if (!fs.existsSync("./logs")) { fs.mkdirSync("./logs"); }
if (!fs.existsSync("./logs/messages.log")) { fs.writeFileSync("./logs/messages.log", ""); }

// -------------------------------------------------------------------------------------------------------------------

client.on('messageCreate', message => {
    if (config.Settings.Global.return_bots && message.author.bot) { return; }
    if (config.Settings.Global.return_dms && message.channel.type === 'dm') { return; }

    fs.appendFileSync("./logs/messages.log", `${message.createdAt.toLocaleString()} | ${message.author.tag} | ${message.content}\n`);

    let messageArray = message.content.split(' ');
    let arguments = messageArray.slice(1);    

    let prefix = config.Settings.Global.prefix;
    let command = messageArray[0].toLowerCase();
    
    if (command.substring(0, prefix.length) != config.Settings.Global.prefix) { return; }
    command = command.substring(prefix.length, messageArray[0].length).toLowerCase();

    let commandFile = client.commands.get(command);
    
    if (commandFile) { commandFile.run(client, message, arguments); }
});

// -------------------------------------------------------------------------------------------------------------------

client.login(config.Settings.Global.token);
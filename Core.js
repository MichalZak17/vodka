const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const Sentry = require('@sentry/node');
const Messages = require('./Messages.json');

const express = require('express');
const app = express();

require("colors")

const { DatabaseHandler } = require('./Handlers/DatabaseHandler.js');
const { LogHandler } = require('./Handlers/LogHandler.js');

require('dotenv').config({path: './.env'});

// -------------------------------------------- Sentry --------------------------------------------

Sentry.init({ 
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0
});

// -------------------------------------------- Gateway --------------------------------------------

const client = new Discord.Client({    
    intents: [Object.keys(Discord.GatewayIntentBits)],
    partials: [Object.keys(Discord.Partials)]    
});

// -------------------------------------------- Loading commands --------------------------------------------

client.commands = new Discord.Collection();

const foldersPath = path.join(__dirname, 'Commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
        
		if ('data' in command && 'execute' in command) {
            console.log(`[+]`.green + ` Loaded command: ${command.data.name}`.white)
			client.commands.set(command.data.name, command);            
		} else { console.log("[!]".yellow + `The command at ${filePath} is missing a required "data" or "execute" property`.white); }
	}
}

// ------------------------------ Joining the server ------------------------------

client.on('guildCreate', async guild => {
	
	// Check if the server is already in the database. If not, add it.

	const server = await DatabaseHandler.query(`SELECT * FROM servers WHERE id = ${guild.id}`);

	if (server.length === 0) {
		await DatabaseHandler.query(`INSERT INTO servers (id) VALUES (${guild.id})`);
		await DatabaseHandler.log(guild.id, 6, `The bot has been added to the server.`);
	}

	// Check if the server has a configuration. If not, add it.

	const config = await DatabaseHandler.query(`SELECT * FROM configurations WHERE server_id = ${guild.id}`);

	if (config.length === 0) {
		await DatabaseHandler.query(`INSERT INTO configurations (server_id) VALUES (${guild.id})`);
		await DatabaseHandler.log(guild.id, 6, `The server configuration has been created.`);
	}

	// Add all the members to the database.

	const members = await guild.members.fetch();

	members.forEach(async member => {
		const user = await DatabaseHandler.query(`SELECT * FROM users WHERE user_id = ${member.user.id}`);

		if (user.length > 0) { return; }

		await DatabaseHandler.query(`INSERT INTO users (user_id, server_id) VALUES (${member.user.id}, ${guild.id})`);
	});
});

// ------------------------------ User join ------------------------------

client.on('guildMemberAdd', async member => {
	if (member.user.bot) { return; }

	// Check if the user is already in the database. If not, add it.

	const user = await DatabaseHandler.query(`SELECT * FROM users WHERE user_id = ${member.user.id}`);

	if (user.length === 0) {
		await DatabaseHandler.query(`INSERT INTO users (user_id, server_id) VALUES (${member.user.id}, ${member.guild.id})`);
		await DatabaseHandler.log(member.guild.id, 6, `The user ${member.user.tag} has joined the server.`);
	}

	const welcomeEmbed = new Discord.EmbedBuilder()
		.setColor(Messages.Colors.default)
		.setThumbnail(client.user.displayAvatarURL())
		.setTitle("Welcome to the server!")
		.setDescription(`Hello there, it's me **${(client.user.tag).slice(0, -5)}**, your personal Discord entertainer. Think of me as your personal genie, but instead of granting wishes, I'll execute your commands with lightning speed.`)
		.addFields(
			{ name: "\u200B", value: "To get started, just press **/** to see all my commands. All commands are run with a slash such as **/ping** or **/joke**." },
			{ name: "\u200B", value: "Whether you're a gamer or just a plain old human being, I've got you covered. If you're feeling competitive, challenge your friends with **/attack** or try your luck with **/bet**. Who knows, you might just end up with a virtual fortune!" },
			{ name: '\u200B', value: "But wait, there's more! I'm not just about games and gambling. I can also help you stay financially savvy with my nifty currency converter feature. I'm like a financial advisor, but without the pesky fees." },
			{ name: '\u200B', value: "So what are you waiting for? Let's get started. I'm always here to assist you, just like a good wingman. So go ahead and try out my commands. I promise I won't let you down." }
		)
		.setTimestamp()

	try { member.send({ embeds: [welcomeEmbed] }); }
	catch (error) { LogHandler.logException(error); }
});


// -------------------------------------------- Executing commands --------------------------------------------

client.on(Discord.Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) { return; }

	const command = client.commands.get(interaction.commandName);

	if (!command) { return; }

	try { await command.execute(interaction); } 
    catch (error) { 
        console.log("[!]".red + ` An error occured while executing the command ${interaction.commandName}`.red + `: ${error}`.white)
        Sentry.captureException(error); }
});

// -------------------------------------------- Bot ready --------------------------------------------

client.once(Discord.Events.ClientReady, () => {
    console.log(`[+]`.green + " The system has booted up!".white);
});

// -------------------------------------------- Bot login --------------------------------------------

client.login(process.env.TOKEN);

// -------------------------------------------- Express --------------------------------------------

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {

	const users = await DatabaseHandler.query(`SELECT * FROM game_money`);

	const userTags = {};
	
	console.log(`[!]`.yellow + ` Fetching user tags...`.white)
	
	for (const user of users) {
	  try {
		const userTag = await client.users.fetch(`${user.user_id}`);
		userTags[user.user_id] = userTag.tag;
	  } catch (error) {
		userTags[user.user_id] = user.user_id;
		console.log(`[!]`.yellow + ` Failed to fetch user tag`.white + `: ${error}`.red)
	  }
	}	

	console.log(`[+]`.green + ` Fetched user tags`.white)

	res.render('index', { 
		title: 'Home',
		allUsers: userTags,
		allGameProfiles: await DatabaseHandler.query(`SELECT * FROM game_money`)
	});
});


app.listen(3000, () => {
    console.log(`[+]`.green + ` Express server is running on port 3000`.white);
});
# Discord Bot

## Shortcuts

* [About](#About)
* [Instalation](##Instalation)
	* [Prerequisites](##Prerequisites)
	* [Discord Developer Poratal](##Discord-Developer-Portal)
	* [Configuration](##Configuration)
	* [My suggestions](#My-suggestions)	
* [License](##License)
* [Contact](##Contact)

## About
The internet is full of discord bots. Ready for server or documentation to do them by yourself. I decided to create a repository containing a fully developed bot with many additional features. This repository may not be the most extensive, but when designing it, I meant simplicity and accessibility for everyone.

## Instalation
Installation due to the number of things needed to be done will be divided into 3 parts:
* [Prerequisites](##Prerequisites)
* [Configuration](##Configuration)
* [Discord Developer Poratal](##Discord-Developer-Portal)

To make it easier to understand the entire installation process, I will list it in sub-items.

## Prerequisites

At first make sure you have **git clone** installed.

1. Clone the repository:
`$ git clone https://github.com/MichalZak17/Discord-Bot.git`

2.  Install **Node.js** by this [link](https://nodejs.org/dist/v12.18.1/node-v12.18.1-x64.msi).

## Discord Developer Poratal

Before the last thing we will have to do is create our bot on the [Discord Developer Poratal](https://discord.com/developers) platform, to enter this site click on the hyperlink.

To create bot on server:
1. Click on **New Application**.
2. Enter a name for your bot and click **Create**.
3.  Go to **Bot**, click **Add Bot** and confirm.

Congratulations you created your bot.

4.  Then you need to get your bot's key. Do it by clicking on the ** Click to Reveal Key ** and copy it. Next go to your `Config-Bot.json` file and paste this key to file. 
5. Give your bot administrator rights.
6. Go to **OAuth2**
7. Click in "Scopes" on **bot** and copy this link.
8. The last step will be to add the Bot to the server by opening the previously copied link.

## Configuration

Before starting to use the bot, the source code requires  to change some important elements.

1.  To change your token and prefix go to the `Config-Bot.json` file located in the main directory of the project you downloaded. Open it and in place where it says `YourToken`, paste your bot token. If you need to replace `/` with another character, for example `!`.  Remember to save your file.

2.  The second important thing to do is to create a special incident channel to which the bot will send all information to the teamt of its activities. Next copy his ID and paste it in every file located in `Discord-Bot/Commends`.

3. Create a few roles like:
* Administrator
* Moderator
* Owner

We will need them to further configure the bot.

Next enter the ID of the roles you have created in the designated places. For example, in place of `AdministratorRoleID`, paste the ID of the administrator role.

!!! Remember to save all changes !!!

4. I also added a server verification system. To configure it, you will need to create the Veryficated and Unveryficated roles and copy its ID and paste it in the appropriate places in the `Index.js` file

If you did everything correctly, the only thing you have left is to run the bot by cmd.
`$ node Index.js`

If everything started correctly, your bot will be active on the server after a while and the console window will display "Server Bot: Online".

## My suggestions

To easily edit the bot without constantly closing it and starting it, I suggest installing a nodemon so that every time you try to save the bot, the bot will restart.

You can do it by entering the command in the console
`$ npm install -g nodemon`

## Licence
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
E-mail: michal.zak000@gmail.com

Project link: https://github.com/MichalZak17/ToDo


# Discord Bot

* [Instalation](#Instalation)
	* [Packages](##Packages)
	* [Discord Developer Poratal](##Discord-Developer-Portal)
* [Usage](#Usage)
* [License](##License)


# Instalation

* [Prerequisites](##Prerequisites)
* [Configuration](##Configuration)
* [Discord Developer Poratal](##Discord-Developer-Portal)

To make it easier to understand the entire installation process, I will list it in sub-items.

## Packages
  
1. Install [**Node.js**](https://nodejs.org/en/) **v16.6.0 or higher**.
2. Install [**Discord.js**](https://discord.js.org/#/) modules.

## Discord Developer Portal

Setting up virtual bot application on [**Developer Portal**](https://discord.com/developers/applications).

1. Click on **New Application**.
2. Enter a name for your bot and click **Create**.
3. Go to **Bot** bookmark, then click **Add Bot** and confirm.

Congratulations you created your bot.

4. Copy the bot **TOKEN** by clicking Reset Token and paste it into json section in `Index.js` file.
5. Set your bot permission on the server at the bottom of the page.
6. Go to **OAuth2/URL Generator** bookmark.
7. In the first table select **Bot** and copy the bot invitation down below.
8. The last step will be to add the Bot to the server by opening the previously copied link.

# Usage

If you installed and configured everything correctly, you can try to start your bot by executing the following command.

`$ node Index.js`

If everything started correctly, your bot will be active on the server after a while and the console window will display "Server Bot: Online" and the application on your server should run online.

# Licence

Distributed under the MIT License. See `LICENSE` for more information.
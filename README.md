# Group Quotes Discord Bot

<center><img src="img/Group Quotes Logo copy.jpg" width=200></center>

## About

This is a fun bot, meant to store and display quotes or phrases by people that may come up in a Discord server. This is done by saving the quotes in a MongoDB database, and can be fully ran from this repository, given that a MongoDB server is set up on either the hosts machine, MongoDB Atlas, or any other hosting platform. After adding a quote, it is sent to be displayed in the text channel of choice when setting up, and can be listed after searching by author or amongst all of the quotes with the list command.

## Setting Up

Before running the bot, a Discord Bot App should first be created on the [Discord Developer Portal](https://discord.com/developers/applications "Discord Developer Portal"). Under the **OAuth2** settings, ensure that *bot* is checked before inviting the bot to your Discord server. 

### The bot uses the following environment variables:    
### *bot_token*: 
Found under the **bot** on the [Discord Developer Portal](https://discord.com/developers/applications "Discord Developer Portal").  
### *textChannelID*
This is the channel ID of the server you want the quotes to be displayed in once they have been added. This can be obtained by right clicking on a text channel in Discord and selecting *Copy ID* (Developer Mode must be enabled in Discord Settings)
### *uri*
This is the connection string for the MongoDB database and cluster that you are using. For instructions on how to get this, please visit the MongoDB Documentation [for local servers](https://docs.mongodb.com/guides/server/drivers/) or [Atlas](https://docs.mongodb.com/guides/cloud/connectionstring/).  
  
If running locally, this can be configured with a file named *.env* in the project folder's root, or set up on the hosting site ie. Heroku. If using Heroku, be sure to enable the **worker** resource.

## Usage
To use the bot, the following commands are available:  
**Adding a quote:**  
`!gq a [quote]`, where `[quote]` is of the format <"Quotation" - Author>.  
**Listing quotes:**  
`!gq l [author]`, where `[author]` is the name of the quote author you are searching for. If called with no author arguments, all quotes will be listed. Whenever this command is used, the quotes will be listed in groups of 10 via a paginated embeded message that uses reaction emojis for navigation (These messages will delete themselves after 3 minutes)  
*Help:*  
`!gq help`, which shows all of the available commands and how to use them.  
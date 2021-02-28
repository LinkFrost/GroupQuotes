# Group Quotes Discord Bot

<center><img src="img/Group Quotes Logo copy.jpg" width=200></center>

## Setting Up

Before running the bot, a Discord Bot App should first be created on the [Discord Developer Portal](https://discord.com/developers/applications "Discord Developer Portal"). Under the **OAuth2** settings, ensure that *bot* is checked before inviting the bot to your Discord server. 

### The bot uses the following environment variables:    
### *bot_token*: 
Found under the **bot** on the [Discord Developer Portal](https://discord.com/developers/applications "Discord Developer Portal").  
### *textChannelID*
This is the channel ID of the server you want the quotes to be displayed in once they have been added. This can be obtained by right clicking on a text channel in Discord and selecting *Copy ID* (Developer Mode must be enabled in Discord Settings)
### *uri*
This is the connection string for the MongoDB database and cluster that you are using. For instructions on how to get this, please visit the MongoDB Documentation [for local servers](https://docs.mongodb.com/guides/server/drivers/) or [Atlas](https://docs.mongodb.com/guides/cloud/connectionstring/).  

## Usage
To use the bot, the following commands are available:  
**Adding a quote:**  
`!gq a [quote]`, where `[quote]` is of the format <"Quotation" - Author>.  
**Listing quotes:**  
`!gq l [author]`, where `[author]` is the name of the quote author you are searching for.  
*Help:*  
`!gq help`, which shows all of the available commands and how to use them.  
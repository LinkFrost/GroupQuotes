const Discord = require("discord.js");
const config = require("./config.json"); //Added to .gitignore
const bot = new Discord.Client();
const fs = require('fs');
const path = "./quotes.json"; //Added to .gitignore

bot.login(config.bot_token);

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);

    //Checks for the quotes.json file. If it does not exist, it is created before any commands can be processed as soon as the bot logs in.
    if(fs.existsSync(path)) {
        console.log("quotes.json detected.")
    }
    else {
        let quoteJSON = [];

        let quoteString = JSON.stringify(quoteJSON);

        fs.writeFile("quotes.json", quoteString, function(error, result) {
            if(error) {
                console.log("There was an error writing the file quotes.json")
            }
            else {
                console.log("Created quotes.json");
            }
        });
    }
});

bot.on('message', async msg => {
    const botCommands = require("./commands")
    bot.commands = new Discord.Collection();
    Object.keys(botCommands).map(key => bot.commands.set(botCommands[key].name, botCommands[key]));

    const args = msg.content.split(/ +/);
    const command = args.shift().toLowerCase();
    console.info(`Called command: ${command}`);

    if (!bot.commands.has(command)) return;

    try {
        await bot.commands.get(command).execute(msg, args);
    }
    catch (error) {
        console.error(error);
        msg.channel.send('There was an error trying to execute that command! Please check console or contact admin');
    }
});
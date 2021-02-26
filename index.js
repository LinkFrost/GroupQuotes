const Discord = require("discord.js");
const bot = new Discord.Client();
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.uri;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
require("dotenv").config();

bot.login(process.env.bot_token);

bot.on('ready', async () => {
    console.log(`Logged in as ${bot.user.tag}!`);

    client.connect(async function() {
        console.log("Connected to MongoDB");
        client.close();
    });
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
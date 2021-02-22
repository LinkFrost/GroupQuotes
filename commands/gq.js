const Discord = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.uri;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
require("dotenv").config();

module.exports = { 
    name: "!gq",
    description: "The base command for the bot",

    processCommand: (msg, cmd) => {
        const commandList = ["a", "l", "help"];
        const cmdArgs = cmd.split(" ");
    
        if(commandList.includes(cmdArgs[0])) {
            switch(cmdArgs[0]) {
                case "a": 
                    module.exports.addQuote(msg, cmd.substring(cmd.indexOf(" "), cmd.length));
                    break;
                case "l":
                    module.exports.listQuotes(msg);
                    break;
                case "help":
                    module.exports.help(msg);
            }
        } else {
            msg.channel.send("Unknown command. For help, use *!gq help*");
        }
    },

    addQuote: (msg, quote) => {
        if(quote === "a") {
            msg.reply("Please call again with a quotation to add");
        } else {
            const quoteArgs = quote.split(/(["-])/);

            if(quoteArgs[1] === "\"" && quoteArgs[3] === "\"" && quoteArgs[5] === "-" && quoteArgs[6] !== "" && quoteArgs[6][0] === " ") {
                const quotation = quoteArgs[2];
                const author = quoteArgs[6].substring(1);    

                client.connect(async function() {
                    const collection = client.db("gq_bots_chads").collection("quotes");
            
                    console.log("Adding quotation to MongoDB...");
            
                    await collection.insertOne({quote: quotation, author: author}, (err, res) => {
                        if(err) console.log(err);
                        else console.log(`Added quote by ${res.ops[0].author}`);
                    });
            
                    // client.close();
                });

                const embededQuoteMessage = new Discord.MessageEmbed()
                    .setColor('#d78ee4')
                    .setThumbnail('https://i.kym-cdn.com/photos/images/original/000/689/757/270.jpg')
                    .setTitle('Successfully stored your quote!')
                    .setDescription(`"${quotation}" - ${author}`)
                    .setTimestamp()

                msg.reply(embededQuoteMessage);

                msg.client.channels.cache.get(process.env.textChannelID).send(new Discord.MessageEmbed()
                                                                .setColor('#d78ee4')
                                                                .setTitle(`"${quotation}"`)
                                                                .setDescription(`- ${author}`)
                                                                .setTimestamp()
                                                            );
            } else {
                msg.reply("Invalid quote format!");
            }
        }
    },

    listQuotes: (msg) => {
        // if(quotes.length !== 0) {
        //     let embededQuoteMessage = new Discord.MessageEmbed()
        //         .setColor('#d78ee4')
        //         .setThumbnail('https://i.kym-cdn.com/photos/images/original/000/689/757/270.jpg')
        //         .setTitle('Saved Quotations')
        //         .setTimestamp();

        //     quotes.forEach(q => { embededQuoteMessage.addField(`"${q.quote}"`, q.author, false) });

        //     msg.channel.send(embededQuoteMessage);

        //     console.log("Listed all quotes from quotes.json");
        // } else {
        //     msg.reply("There are currently no quotes stored. Please use *!gq a* to add some quotes first");
        //     console.log("Attempted to call list with empty quotes.json");
        // }

        client.connect(async function() {
            const collection = client.db("gq_bots_chads").collection("quotes");
    
            console.log("Listing quotations from MongoDB...");

            let collectionSize = await collection.countDocuments();

            if(collectionSize === 0) {
                msg.reply("There are currently no quotes stored in the database! Please use *!gq a* to add some quotes first!");
            } else {
                msg.reply("This command is still a WIP!");
            }
    
            // client.close();
        });
    },

    help: (msg) => {
        const helpString = new Discord.MessageEmbed()
        .setColor('#d78ee4')
        .setTitle('Group Quotes Bot Commands')
        .setDescription(`*Use !gq [command] [parameter] to use the bot*`)
        .addField('*!gq a [\"Quotation\" - Author]*', 'Adds a quotation to the database.', false)
        .addField('*!gq l [Author]*', 'Lists all the quotations from the specified author. If called with no parameters, all quotations will be listed', false);
        
        msg.channel.send(helpString);
    },

    execute(msg) {
        const prefix = "!";

        if(msg.content[0] === prefix) {
            const args = msg.content.substring(msg.content.indexOf(" ") + 1, msg.content.length);

            if(args === "!gq") {
                msg.channel.send("Missing arguments! For help, use *!gq help*");
            } else {
                this.processCommand(msg, args);
            }
        }
    }
}
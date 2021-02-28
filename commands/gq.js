const Discord = require('discord.js');
const Pagination = require('discord-paginationembed');
const MongoClient = require('mongodb').MongoClient;
const { Embeds } = require('discord-paginationembed');
const uri = process.env.uri;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
require("dotenv").config();

module.exports = { 
    name: "!gq",
    description: "The base command for the bot",

    processCommand: async (msg, cmd) => {
        const commandList = ["a", "l", "help"];
        const cmdArgs = cmd.split(" ");
    
        if(commandList.includes(cmdArgs[0])) {
            switch(cmdArgs[0]) {
                case "a": 
                    module.exports.addQuote(msg, cmd.substring(cmd.indexOf(" "), cmd.length));
                    break;
                case "l":
                    module.exports.listQuotes(msg, cmd.substring(cmd.indexOf(" "), cmd.length));
                    break;
                case "help":
                    module.exports.help(msg);
            }
        } else {
            msg.channel.send("Unknown command. For help, use *!gq help*");
        }
    },

    addQuote: async (msg, quote) => {
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
                    .setTitle('Successfully added your quote!')
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

    listQuotes: async (msg, args) => {
        function splitArrToArr(arr, size) {
            let newArr = [];

            for(let i = 0; i < arr.length; i += size) {
                newArr.push(arr.slice(i, i + size));
            }

            return newArr;
        }

        function createPaginatedList(quoteArr) {
            let embededMessageList = [];
            let pageCounter = 1;

            for(let i = 0; i < quoteArr.length; i++) {
                let embededQuoteMessage = new Discord.MessageEmbed().setTitle(`Quotes - Page ${pageCounter}`).setColor('#d78ee4');

                for(let j = 0; j < quoteArr[i].length; j++) {
                    embededQuoteMessage.addField(`"${quoteArr[i][j].quote}"`, quoteArr[i][j].author, false);
                }

                embededMessageList.push(embededQuoteMessage);
                pageCounter++;
            }

            const embedPage = new Pagination.Embeds()
                .setArray(embededMessageList)
                .setChannel(msg.channel)
                .setPage(1)
                .on('start', (user) => console.log(`${user} started Pagination`))
                .on('finish', (user) => console.log(`Finished! User: ${user.username}`))
                .on('react', (user, emoji) => console.log(`Reacted! User: ${user.username} | Emoji: ${emoji.name} (${emoji.id})`))
                .on('error', console.error)
                .setDeleteOnTimeout(true)
                .setTimeout(180000);

            return embedPage;
        }

        client.connect(async function() {
            console.log("Listing quotations from MongoDB...");

            const collection = client.db("gq_bots_chads").collection("quotes");
            const collectionSize = await collection.countDocuments();

            if(collectionSize === 0) {
                msg.reply("There are currently no quotes stored in the database! Please use *!gq a* to add some quotes first!");
            }
    
            const allQuotes = await collection.find().sort({"_id":1}).toArray().then(quotes => {return quotes});
           
            if(args === "l") {
                const embedPage = createPaginatedList(splitArrToArr(allQuotes, 10));
                await embedPage.build();
            } else {
                const embedPage = createPaginatedList(splitArrToArr(allQuotes.filter(q => args.toLowerCase().substring(1, args.length).split(" ").some(a => q.author.toLowerCase().includes(a))), 10))
                await embedPage.build();
            }
        });
    },

    help: async (msg) => {
        const helpString = new Discord.MessageEmbed()
        .setColor('#d78ee4')
        .setTitle('Group Quotes Bot Commands')
        .setDescription(`*Use !gq [command] [parameter] to use the bot*`)
        .addField('*!gq a [\"Quotation\" - Author]*', 'Adds a quotation to the database.', false)
        .addField('*!gq l [Author]*', 'Lists all the quotations from the specified author. If called with no parameters, all quotations will be listed', false);
        
        msg.channel.send(helpString);
    },

    async execute(msg) {
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
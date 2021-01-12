const fs = require('fs');
const path = "./../quotes.json"; //Added to .gitignore
let quotes = require(path);

module.exports = {
    name: "!quote",
    description: "The base command for the bot",

    processCommand: (msg, cmd) => {
        const commandList = ["add", "list"];
        const cmdArgs = cmd.split(" ");
    
        if(commandList.includes(cmdArgs[0])) {
            switch(cmdArgs[0]) {
                case "add": 
                    module.exports.addQuote(msg, cmd.substring(cmd.indexOf(" "), cmd.length));
                    msg.reply("Stored your quote");
                    break;
                case "list":
                    module.exports.listQuotes(msg);
                    break;
            }
        }
        else {
            msg.channel.send("Unknown command. For help, use *!quote help*");
        }
    },

    addQuote: (msg, quote) => {
        if(quote === "add") {
            msg.reply("Please call again with a quotation to add");
        }
        else {
            const quoteArgs = quote.split(/([",-])/);

            if(quoteArgs[1] === "\"" && quoteArgs[3] === "\"" && quoteArgs[5] === "-") {
                quotes.push({
                    quote: [quoteArgs[1], quoteArgs[2], quoteArgs[3]].join(''), 
                    author: quoteArgs[6]
                });
            }
            else {
                msg.reply("Invalid quote format!");
            }
        }

        fs.writeFileSync("quotes.json", JSON.stringify(quotes, null, "\t"), error => {
            if(error) throw error;
        });
    },

    listQuotes: (msg) => {
        if(quotes.length !== 0) {
            quotes.forEach(q => msg.channel.send(q.quote + " -" + q.author));
        }
        else {
            msg.reply("There are currently no quotes stored. Please use *!quote add* to add some quotes first");
        }
    },

    execute(msg) {
        const prefix = "!";

        if(msg.content[0] === prefix) {
            const args = msg.content.substring(msg.content.indexOf(" ") + 1, msg.content.length);

            if(args === "!quote") {
                msg.channel.send("Missing arguments! For help, use *!quote help*");
            }
            else {
                this.processCommand(msg, args);
            }
        }
    }
}
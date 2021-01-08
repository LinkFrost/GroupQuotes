const fs = require('fs');
const path = "./quotes.json";
const quotes = require("./../quotes")

module.exports = {
    name: "!quote",
    description: "The base command for the bot",

    processCommand: (msg, cmd) => {
        if(cmd.includes("add")) {
            const addArgs = cmd.substring(cmd.indexOf(" "), cmd.length);

            if(addArgs === "add") {
                msg.channel.send("Please call again with a quotation to add")
            } else {
                module.exports.addQuote(msg, addArgs);
                msg.channel.send("Stored your quote");
            } 
        }

        if(cmd.includes("list")) {
            module.exports.listQuotes(msg);
        }
    },

    addQuote: (msg, quote) => {
        let newQuote = {quote: quote};
        quotes.push(newQuote);

        fs.writeFileSync("quotes.json", JSON.stringify(quotes, null, "\t"), error => {
            if(error) throw error;
            console.log("Successfully added quote to quotes.json");
        });
    },

    listQuotes: (msg) => {
        if(quotes.length !== 0) {
            quotes.forEach(q => msg.channel.send(q.quote));
        }
        else {
            msg.channel.send("There are currently no quotes stored. Please use *!quote add* to add some quotes first");
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
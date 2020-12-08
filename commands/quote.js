const fs = require('fs');
const path = "./quotes.json";

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
    },

    addQuote: (msg, quote) => {
        if(fs.existsSync(path)) {
            const quotes = require("./../quotes")
            let newQuote = {quote: quote};
            quotes.push(newQuote);
            fs.writeFileSync("quotes.json", JSON.stringify(quotes, null, 4), err => {
                if(err) throw err;
                console.log("Working");
            });
        }
        else {
            let quoteJSON = [];
            let quoteObj = {};
            quoteObj.quote = quote;
            quoteJSON.push(quoteObj);

            let quoteString = JSON.stringify(quoteJSON);

            fs.writeFile("quotes.json", quoteString, function(error, result) {if(error) {console.log("error")}});
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
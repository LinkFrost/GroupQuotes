module.exports = {
    name: "!test",
    description: "Test command",
    execute(msg) {
        const prefix = "!";
        if(msg.content[0] === prefix) {
            const args = msg.content.substring(msg.content.indexOf(" ") + 1, msg.content.length);
            msg.channel.send(`${args}`);
        }
    }
}
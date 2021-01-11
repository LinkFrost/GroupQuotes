module.exports = {
    name: "!test",
    description: "Test command",
    execute(msg) {
        const prefix = "!";
        if(msg.content[0] === prefix) {
            msg.channel.send("Haha!");
        }
    }
}
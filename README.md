# GroupQuotes

<img style="display: block; margin: 0 auto" src="img/GroupQuotes Logo.png" alt="Logo" width="200"/>
<br>
GroupQuotes is a Discord bot that let's you save and display quotes in your Discord server.

<br>

<button style="display: block; margin: 0 auto; background-color: #734c7a;  border-radius: 25px; padding: 0.4rem 1rem;">
  <a style="color: white; font-size: 1.5rem;" href="https://discord.com/oauth2/authorize?client_id=784990646893150249&permissions=8&scope=bot">Invite GroupQuotes to your server!</a>
</button>

---

## About

This bot was written in TypeScript using the [discordjs](https://discord.js.org/#/) library, alongside MongoDB and Redis as the databases. Quotes are stored in seperate collections per server in the MongoDB database, and Redis is used to store which text channel in the Discord server is set as the gallery channel.

---

## How to run

While this bot is already being hosted and has a global invite link that can be used on any server, you can run an instance yourself.

### Run:

`npm install` and then

`npm run start`

or `ts-node src/index.ts`

### Environment Variables

The following environment variables are used in the bot:

#### **BOT_TOKEN**

The token of the bot from the Discord Developer Portal.

#### **APPLICATION_ID**

The id of the Discord Application for the bot from the Discord Developer Portal.

#### **MONGO_USER** and **MONGO_PASSWORD**

Username and password for the MongoDB instance.

#### **REDIS_USER** and **REDIS_PASSWORD**

Username and password for the Redis instance.

---

## Future Plans and Known Bugs

- Being able to save multiple quotes at once, ie. a small conversation comprised of two to five quotes, is down the roadmap.

- Currently, for listing quotes, the bot uses a [package](https://www.npmjs.com/package/discordjs-button-embed-pagination) for creating paginated embed messages that contains functionality for flipping through pages. This package has an issue where if there is only one page of messages, hitting any of the buttons results in an "Interaction failed" message (it does not seem to crash the bot at least). In the future, this package might be replaced with a fixed, forked version, or an in house solution for paginated embeds.

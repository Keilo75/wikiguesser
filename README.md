# wikiguesser

A discord bot which lets you guess the title of wikipedia articles. TODO: Create link

![Example Image of Bot](./src/assets/example.png)

# Commands

`play` - Start a game.  
`user` - Get information about a user's statistics.  
`about` - Show information about the bot.  
`ping` - Get the bots ping.

# Contributing

If you want to contribute, feel free to simply fork the repository and submit a PR.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (Version 14.0.0 or newer)

## Local Setup

1. [Create a discord bot account](https://discord.com/developers/applications) and copy the token.
2. Clone the repository and run `npm install`.
3. Create a `.env` file in the root directory with the following values:

```
TODO: Document .env
```

## Scripts

These scripts can be run with `npm run <script>`:

- `start`: Starts the bot.
- `dev`: Starts the bot and automatically reloads on file change.
- `lint`: Run ESLint.
- `test`: Run vitest.
- `scripts:register-commands:dev`: Register commands to a specific guild (`CLIENT_ID` and `GUILD_ID` environment variables must be set).
- `scripts:register-commands:prod`: Register commands globally (`CLIENT_ID` environment variable must be set).

# Help

If you're experiencing a bug or you have a suggestion, feel free to create an issue or message me on Discord (Keilo75#2633).

import print from './src/modules/print';
import discord, { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { token, isDev } from './config.json';
import fs from 'fs';

interface Command {
  config: {
    name: string,
    description: string,
    options: any,
  },
  run(interaction: CommandInteraction): void
}

print('status', `Compiling...`);
const client = new discord.Client({
  intents: ['GUILD_MESSAGES', 'GUILDS']
});

// Require all commands
const commandFolders = fs.readdirSync('./commands').filter(file => !file.endsWith('.ts'));

const commands: discord.Collection<string, Command> = new discord.Collection();
for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.ts'));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    commands.set(command.config.name, command);
  }
}

client.on('ready', async () => {
  print('status', `Succesfully logged in as §${client.user?.tag}§.`)
});

client.on('message', async (message) => {
  if (!client.application?.owner) await client.application?.fetch();

  if (message.author.bot) return;
  if (!message.guild) return;

  if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application?.owner?.id) {

    // Add all commands
    const commandsArray: Array<ApplicationCommandData> = []; 
  
    commands.forEach(command => {
      const { config } = command;

      const commandData = {
        name: config.name,
        description: config.description,
        options: config.options,
      }

      commandsArray.push(commandData);
    });
    
    // Set commands
    if (isDev) {
      client.guilds.cache.get(message.guild.id)?.commands.set(commandsArray);
    } else {
      client.application?.commands.set(commandsArray);
      client.guilds.cache.get(message.guild.id)?.commands.set([]);
    }

    message.channel.send(':green_square: **|** Updated commands succesfully.')
  
    print('commands', 'Updated commands succesfully.')
	}
});

client.on('interaction', (interaction) => {
  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName);

  command?.run(interaction);
});

client.on('guildCreate', (guild) => {
  print('guild', `Joined guild ${guild.name}.`);
});
 
client.login(token);
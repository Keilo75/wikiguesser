import print from './src/modules/print';
import discord, { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { token } from './credentials.json';
import fs from 'fs';

interface Command {
  config: {
    name: string,
    description: string
  },
  run(interaction: CommandInteraction, args: Array<string>): void
}

print('status', `Compiling...`);
const client = new discord.Client({
  intents: ['GUILD_MESSAGES', 'GUILDS']
});

// Require all commands
const commandFolders = fs.readdirSync('./commands');

const commands: discord.Collection<string, Command> = new discord.Collection();
for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.ts'));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    commands.set(command.config.name, command);
  }
}

client.on('ready', () => {
  print('status', `Succesfully logged in as §${client.user?.tag}§.`)
});

client.on('message', async (message) => {
  if (!client.application?.owner) await client.application?.fetch();

  if (message.author.bot) return;

  if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application?.owner?.id) {

    // Add all commands
    const commandsArray: Array<ApplicationCommandData> = []; 
  
    commands.forEach(command => {
      const { config } = command;
      
      commandsArray.push({
        name: config.name,
        description: config.description
      });
    });
    
    // Set commands
    client.guilds.cache.get('759083824298066011')?.commands.set(commandsArray);
  
    print('commands', 'Updated commands succesfully.')
	}
});

client.on('interaction', (interaction) => {
  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName);

  command?.run(interaction, []);
});
 
client.login(token);
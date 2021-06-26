import { CommandInteraction, MessageEmbed } from "discord.js"
import { colors } from '../../config.json';
import { getUserCount } from '../../src/db/database'

module.exports = {
  config: {
    name: 'about',
    description: 'Shows information about the bot.'
  },

  run: async (interaction: CommandInteraction) => {
    const embed = new MessageEmbed()
      .setColor(colors.white)
      .setTitle('wikiguesser')
      .setDescription('Guess the title of a wikipedia article!\nUse **/play** to start a game!\n\nGot any suggestions or found bugs? Feel free to message me!')
      .addField('Players', await getUserCount())
      .addField('Made by', 'Keilo75#2633')
      .addField('GitHub', 'https://github.com/Keilo75/wikiguesser')
      .addField('Invite link', '[Click here to invite the bot to your server!](https://discord.com/api/oauth2/authorize?client_id=851499065711263764&permissions=0&scope=bot%20applications.commands)')
    
    interaction.reply({
      embeds: [ embed ]
    });

    
  }
}
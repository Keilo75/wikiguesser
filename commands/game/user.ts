import { CommandInteraction } from "discord.js"

module.exports = {
  config: {
    name: 'user',
    description: 'Get information about a user.',
    options: [{
      name: 'user',
      type: 'USER',
      description: 'Select a user (Leave empty to get your information)'
    }]
  },

  run: async (interaction: CommandInteraction) => {
    await interaction.defer();
    
    let specifiedUser = interaction.options.get('user')?.user;
    if (!specifiedUser) specifiedUser = interaction.user;
    
    interaction.editReply(`:envelope_with_arrow: **|** Retrieving information about **${specifiedUser.tag}**...`);

    // Check if user is a bot
    if (specifiedUser.bot) return interaction.editReply(`:red_square: **|** Cannot retrieve information about bots.`);
  }
}
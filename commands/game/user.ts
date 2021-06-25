import { CommandInteraction, MessageEmbed } from "discord.js"
import { getUser } from "../../src/db/database";
import { colors } from '../../config.json';

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
    let specifiedUser = interaction.options.get('user')?.user;
    if (!specifiedUser) specifiedUser = interaction.user;

    const user = await getUser(specifiedUser.id);
    if (interaction.user.id !== user.userID && user.private) return interaction.reply({
      content: `:red_square: **|** **${specifiedUser.tag}** has set their profile to private.`
    })

    interaction.reply({ 
      ephemeral: user.private,
      content: `:envelope_with_arrow: **|** Retrieving information about **${specifiedUser.tag}**...`
    })

    // Check if user is a bot
    if (specifiedUser.bot) return interaction.editReply({
      content: `:red_square: **|** Cannot retrieve information about bots.`
    });

    

    const embed = new MessageEmbed()
      .setTitle(`Stats - ${specifiedUser.username}`)
      .setThumbnail(specifiedUser.displayAvatarURL())
      .setColor(colors.white)
      .addField('Games played', user.games + "")
      .addField('Guess Statistics', `Correct Guesses: **${user.guesses.correct}**\nWrong Guesses: **${user.guesses.wrong}**\nWin Percentage: **${user.guesses.correctPercentage}**`)
      .addField('Streak Statistics', `Current Streak: **${user.streaks.current}**\nHighest Streak: **${user.streaks.highest}**`);

    interaction.editReply({
      embeds: [ embed ],
    })
  }
}
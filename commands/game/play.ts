import { CommandInteraction, MessageButton, MessageEmbed, MessageComponentInteraction, Message } from "discord.js";
import getResponse from './../../src/requests/requestHandler';
import { colors } from '../../config.json'

module.exports = {
  config: {
    name: 'play',
    description: 'Start a game.'
  },

  run: async (interaction: CommandInteraction) => {
    await interaction.defer();
    
    const guildID = interaction.guildID?.toString();
    const response = await getResponse(guildID);

    const embed = new MessageEmbed()
      .setTitle('Guess the Wikipedia article in 10 seconds.')
      .setColor(colors.white)
      .setDescription(response.text)
      .setFooter(interaction.user.tag, interaction.user.displayAvatarURL());

    // Create buttons
    const buttons = [];
    for (let title of response.list) {
      const button = new MessageButton()
        .setCustomID(response.list.indexOf(title).toString())
        .setStyle('PRIMARY')
        .setLabel(title)

      buttons.push(button);
    }

    await interaction.editReply({ 
      embeds: [embed],
      components: [buttons] 
    });

    // Create collector
    const endEmbed = new MessageEmbed()
      .addField(response.list[response.indexOfAnswer], response.originalText)

    // Create play again button
    const playButton = new MessageButton()
      .setStyle('SUCCESS')
      .setLabel('Play again')
      .setCustomID('no');

    const message = await interaction.fetchReply() as Message;
		const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;

    console.time()
    await message.awaitMessageComponentInteraction(filter, { time: 10000 })
    .then(async i => {
      const clickedButton = parseInt(i.customID);
      if (clickedButton === response.indexOfAnswer) {
        endEmbed.setColor(colors.green);
        endEmbed.setTitle('You guessed correctly!')
      } else {
        endEmbed.setColor(colors.red);
        endEmbed.setTitle('You guessed wrong.')
        endEmbed.setDescription(`Your guess was **${response.list[clickedButton]}**.`)
      }
      endEmbed.setFooter(`${interaction.user.tag} | Click 'Play again' to start a new game. This will expire in 10 seconds.`, interaction.user.displayAvatarURL());

      i.update({
        components: [[ playButton ]],
        embeds: [ endEmbed ]
      });

    })
    .catch(() => {
      endEmbed.setColor(colors.red);
      endEmbed.setTitle('You didn\'t guess.')
        
      interaction.editReply({
        components: [[ playButton ]],
        embeds: [ endEmbed ]
      });
    });




  }
}

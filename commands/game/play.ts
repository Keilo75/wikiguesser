import { CommandInteraction, MessageButton, MessageEmbed, MessageComponentInteraction, Message, TextChannel } from "discord.js";
import getResponse from './../../src/requests/requestHandler';
import { colors } from '../../config.json'

module.exports = {
  config: {
    name: 'play',
    description: 'Start a game.'
  },

  run: async (interaction: CommandInteraction, restarted: boolean, serverID: string, channel: TextChannel) => {
    const answerTime = 20;
    const playAgainTime = 10;
    
    if (!restarted) await interaction.defer();
    
    const guildID = (!restarted) ? interaction.guildID?.toString() : serverID;
    const response = await getResponse(guildID);

    const embed = new MessageEmbed()
      .setTitle(`Guess the Wikipedia article in ${answerTime} seconds.`)
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

    if (!restarted) {
      await interaction.editReply({ 
        embeds: [embed],
        components: [buttons] 
      });
    } else {
      var msg = await channel.send({
        embeds: [embed],
        components: [buttons] 
      })
    }

    // Create collector
    const endEmbed = new MessageEmbed()
      .addField(response.list[response.indexOfAnswer], response.originalText)
      .setFooter(`${interaction.user.tag} | Click 'Play again' to start a new game. This will expire in ${playAgainTime} seconds.`, interaction.user.displayAvatarURL());

    // Create play again button
    const playButton = new MessageButton()
      .setStyle('SUCCESS')
      .setLabel('Play again')
      .setCustomID('no');

    // @ts-ignore
    // msg will never be undefined here
    const message = (!restarted) ? await interaction.fetchReply() as Message : msg;
		const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;

    await message.awaitMessageComponentInteraction(filter, { time: answerTime * 1000 })
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

       i.update({
        components: [[ playButton ]],
        embeds: [ endEmbed ]
      });

    })
    .catch(() => {
      endEmbed.setColor(colors.red);
      endEmbed.setTitle('You didn\'t guess.')
        
      if (!restarted) {
        interaction.editReply({
          components: [[ playButton ]],
          embeds: [ endEmbed ]
        });
      } else {
        msg.edit({
          components: [[ playButton ]],
          embeds: [ endEmbed ]
        });
      }
    });

    endEmbed.setFooter(interaction.user.tag, interaction.user.displayAvatarURL());
    await message.awaitMessageComponentInteraction(filter, { time: playAgainTime * 1000 })
    .then(i => {
      i.update({
        components: [],
        embeds: [ endEmbed ]
      })

      module.exports.run(interaction, true, guildID, interaction.channel);
    })
    .catch(() => {
      if (!restarted) {
        interaction.editReply({
          components: [],
          embeds: [ endEmbed ]
        });
      } else {
        msg.edit({
          components: [],
          embeds: [ endEmbed ]
        });
      }
    });
  }
}

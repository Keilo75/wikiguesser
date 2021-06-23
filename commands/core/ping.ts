import { CommandInteraction } from "discord.js"

module.exports = {
  config: {
    name: 'ping',
    description: 'Returns the bots ping.'
  },

   run: async (interaction: CommandInteraction, args: Array<string>) => {
    await interaction.reply(':chart_with_upwards_trend: **|** Pinging...');

    interaction.editReply(`:chart_with_upwards_trend: **|** My current ping is ${Date.now() - interaction.createdTimestamp}ms.`)
  }
}
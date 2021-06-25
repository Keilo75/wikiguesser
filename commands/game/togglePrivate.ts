import { CommandInteraction } from "discord.js"
import { getUser, setUser } from "../../src/db/database"

module.exports = {
  config: {
    name: 'toggleprivate',
    description: 'Toggle wheter other users can see your stats.'
  },

  run: async (interaction: CommandInteraction) => {
    const user = await getUser(interaction.user.id);
    user.private = !user.private;
    await setUser(user);
    
    const text = (user.private) ? 'Your stats are no longer visible to others.' : 'Your stats are visible to others again.';
    interaction.reply({
      content: `:eye: **|** ${text}`
    })
  }
}
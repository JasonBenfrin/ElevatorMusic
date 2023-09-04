import { SlashCommandBuilder, resolveColor } from "discord.js";
import { CommandConfig } from "../../../structures/interactions/Command.js";

export default new CommandConfig({
  builder: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Info on the song and the bot')
  ,
  async execute(interaction) {
    const author = await interaction.client.users.fetch('758939577511313429')
    interaction.reply({
      embeds: [
        {
          color: resolveColor('#2b2d31'),
          author: {
            name: author.username,
            icon_url: author.displayAvatarURL(),
            url: 'https://github.com/JasonBenfrin'
          },
          description: `
          💽 Track name: **The Elevator Bossa Nova**
          :feather: Composer: **Benjamin Tissot**
          🌐 URL: https://www.bensound.com/royalty-free-music/track/the-elevator-bossa-nova
          `
        }
      ]
    })
  },
})
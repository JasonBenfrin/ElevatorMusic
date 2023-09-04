import { InteractionReplyOptions, SlashCommandBuilder } from "discord.js";
import { CommandConfig } from "../../../structures/interactions/Command.js";
import { getVoiceConnection } from "@discordjs/voice";

export default new CommandConfig({
  builder: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops playing elevator music')
    .setDMPermission(false)
  ,
  execute(interaction) {
    const noConnection: InteractionReplyOptions = {
      content: "Not in a voice channel",
      ephemeral: true
    }
    if (!interaction.guildId) return interaction.reply(noConnection)
    const connection = getVoiceConnection(interaction.guildId)
    if (!connection) return interaction.reply(noConnection)
    connection.destroy()
    interaction.reply({
      content: "Stopped playing",
      ephemeral: true
    })
  },
})
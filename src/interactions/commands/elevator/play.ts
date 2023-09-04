import { ChannelType, SlashCommandBuilder } from "discord.js";
import { CommandConfig } from "../../../structures/interactions/Command.js";
import { joinVoiceChannel } from "@discordjs/voice";

export default new CommandConfig({
  builder: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays elevator music')
    .addChannelOption(o => o
      .setName('channel')
      .setDescription('The channel to play to other than the current one.')
      .addChannelTypes(
        ChannelType.GuildVoice,
        ChannelType.GuildStageVoice
      )
      .setRequired(false)
    )
    .setDMPermission(false)
  ,
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel', false, [ChannelType.GuildVoice, ChannelType.GuildStageVoice]) || (await interaction.guild?.members.fetch(interaction.user.id)!).voice.channel

    if (!channel) return interaction.reply({
      content: 'You must join a channel first',
      ephemeral: true
    })

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guildId,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: true,
      selfMute: false,
    })
    
    connection.subscribe(interaction.client.player!)
    interaction.reply({
      content:  `Started playing elevator music in ${channel}`,
      ephemeral: true
    })
  },
})
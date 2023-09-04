import { GatewayIntentBits } from "discord.js";
import BotClient from "./structures/Client.js";

const client = new BotClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ]
})

client.login(process.env.TOKEN)
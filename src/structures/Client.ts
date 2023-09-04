import { Client, Collection, ClientOptions } from "discord.js";
import BotCommand, { CommandConfig } from "./interactions/Command.js";
import { readdirSync, statSync } from 'fs'
import BotEvent from "./Event.js";
import BotButton from "./interactions/Button.js";
import BotModal from "./interactions/Modal.js";
import { AudioPlayer, AudioPlayerStatus, NoSubscriberBehavior, createAudioPlayer, createAudioResource } from "@discordjs/voice";
import path from "path";

export default class BotClient extends Client {
  commands?: Collection<string, BotCommand<any>>
  buttons?: Collection<string, BotButton>
  modals?: Collection<string, BotModal>
  player?: AudioPlayer

  constructor(options: ClientOptions) {
    super(options)

    this.commands = new Collection()
    this.buttons = new Collection()
    this.modals = new Collection()
    this.player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
      }
    })

    const playResource = () => {
      const resource = createAudioResource(path.resolve('./Elevator-Bossa-Nova.mp3'))
      this.player?.play(resource)
    }
    
    playResource()
    this.player.on(AudioPlayerStatus.Idle, playResource)

    // Command loader
    const commandsDir = './src/interactions/commands/'
    readdirSync(commandsDir).forEach( folderName => {
      const commandFolderPath = commandsDir + folderName
      if (!statSync(commandFolderPath).isDirectory()) return

      readdirSync(commandFolderPath)
        .filter( fileName => fileName.endsWith('.ts'))
        .forEach( async fileName => {
          const commandConfig: CommandConfig<any> = (await import(`../interactions/commands/${folderName}/${fileName}`)).default
          const command = new BotCommand({
            ...commandConfig,
            folder: folderName,
            file: fileName
          })
          this.commands?.set(command.builder.name, command)
        })
    })

    // Events loader
    readdirSync('./src/events')
      .filter(file => file.endsWith('.ts'))
      .forEach( async fileName => {
        const event: BotEvent<any> = (await import(`../events/${fileName}`)).default
        this[event.mode](event.name, (...args) => event.execute(...args))
      })

    // Buttons loader
    readdirSync('./src/interactions/buttons')
      .filter(file => file.endsWith('.ts'))
      .forEach( async fileName => {
        const buttons: BotButton[] = (await import(`../interactions/buttons/${fileName}`)).default
        buttons.forEach(button => {
          this.buttons?.set(button.name, button)
        })
      })

    // Modals loader
    readdirSync('./src/interactions/modals')
      .filter(file => file.endsWith('.ts'))
      .forEach( async fileName => {
        const modals: BotModal[] = (await import(`../interactions/modals/${fileName}`)).default
        modals.forEach(modal => {
          this.modals?.set(modal.name, modal)
        })
      })

    // Uncomment this for debugging purposes
    // this.on('debug', console.log)
  }
}
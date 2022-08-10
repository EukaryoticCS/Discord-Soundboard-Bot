import DiscordJS, { IntentsBitField } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const client = new DiscordJS.Client({
 intents:[
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages
 ]
})

client.on('ready', () => {
  console.log("Good Morning master")
})

client.on("messageContent", (msg) => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
})

client.login(process.env.TOKEN)
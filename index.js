import DiscordJS, { IntentsBitField } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const client = new DiscordJS.Client({
 intents:[
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
 ]
})

client.on('ready', () => {
  console.log("Good Morning master")
})

client.on("messageCreate", msg => {
  if (msg.content === "ping") {
    msg.reply({content: "Yo momma"});
  }
})

client.login(process.env.TOKEN)
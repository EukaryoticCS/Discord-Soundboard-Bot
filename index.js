import DiscordJS, { IntentsBitField, InteractionCollector } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const prefix = '!'
const client = new DiscordJS.Client({
 intents:[
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    InteractionCollector.getEventListeners.
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

client.on("messageCreate", msg => {
  if (msg.content === prefix +"prefixChange"){
    msg.reply({content: "what would you like to change the prefix to?"});
    
  }
})


client.login(process.env.TOKEN)
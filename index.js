import DiscordJS, { IntentsBitField, Message, messageLink, VoiceChannel } from 'discord.js'
import { joinVoiceChannel } from '@discordjs/voice'
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
	//Join vc bit
	const guild = client.guilds.cache.get("1006328808401555527")
	const channel = guild.channels.cache.get("1006328808917438547")
	const connection = joinVoiceChannel({
    	channelId: channel.id,
    	guildId: channel.guild.id,
    	adapterCreator: guild.voiceAdapterCreator,
	//end join vc bit
	})

	client.on("messageCreate", (msg) => {
		if (msg.content === "ping") 
    		msg.reply({content: "Yo momma"})
	})
})

client.login(process.env.TOKEN)
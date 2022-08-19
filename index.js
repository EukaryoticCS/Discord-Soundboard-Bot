import DiscordJS, { IntentsBitField, Message, messageLink, VoiceChannel } from 'discord.js'
import { joinVoiceChannel } from '@discordjs/voice'
import dotenv from 'dotenv'
dotenv.config()






const prefix = "!";
const client = new DiscordJS.Client({
	intents:[
    	IntentsBitField.Flags.Guilds,
    	IntentsBitField.Flags.GuildMessages,
    	IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildMessageReactions,
	]
})

// Set the prefix 
client.on("messageCreate", (message) => {
	// Exit and stop if it's not there
	if (!message.content.startsWith(prefix)) return;

	if (message.content.startsWith(`${prefix}ping`)) {
		message.channel.send("https://en.wikipedia.org/wiki/Pong");
	}
	if(message.content.startsWith(`${prefix}soundboard`)) {
		message.channel.send("1️⃣bruh \n2️⃣boowomp  \n3️⃣wow \n4️⃣anime wow \n5️⃣Mom get the camera");
	}
	if(message.content === "1️⃣bruh \n2️⃣boowomp  \n3️⃣wow \n4️⃣anime wow \n5️⃣Mom get the camera")
	{
		message.react('1️⃣')
	}
});



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
})

	client.on("messageCreate", (msg) => {
		if (msg.content === "goodGame") 
    		msg.reply({content: "https://www.zeldadungeon.net/wiki/Spirit_Tracks_Story :train2:"})
	})

	client.on("messageCreate", (msg) => {
		if (msg.author.id === '642942437299585066' && msg.content === 'gay') {
			msg.reply({content: "frik off wit dat gay stuff"})
			return
		  };
	})



	
client.login(process.env.TOKEN)


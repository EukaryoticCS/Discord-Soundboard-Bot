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
        message.channel.send("1️⃣bruh \n2️⃣boowomp  \n3️⃣wow \n4️⃣anime wow \n5️⃣Mom get the camera").then(sentMessage => {
            sentMessage.react('1️⃣')
			sentMessage.react('2️⃣')
			sentMessage.react('3️⃣')
			sentMessage.react('4️⃣')
			sentMessage.react('5️⃣')
			client.on('messageReactionAdd', (reaction, author) => {
				if(reaction.message.author == "1006684796983971900"){
				//Here you can check the message itself, the author, a tag on the message or in its content, title ...
					if(reaction.message.reactions.cache.get('1️⃣').count == 2){
						message.channel.send("{Bruh sound effect here}")
					}
				}
			})
        });
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


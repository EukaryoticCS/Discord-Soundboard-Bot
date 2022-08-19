import DiscordJS, { IntentsBitField, Message, messageLink, VoiceChannel } from 'discord.js'
import { createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection } from '@discordjs/voice'
import dotenv from 'dotenv'
import play from 'play-dl';
dotenv.config()

const prefix = "!";
const client = new DiscordJS.Client({
	intents:[
    	IntentsBitField.Flags.Guilds,
    	IntentsBitField.Flags.GuildMessages,
    	IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildVoiceStates,
	]
})

async function connectToChannel() {
	const guild = client.guilds.cache.get("1006328808401555527") //Guild/Server ID
	const channel = guild.channels.cache.get("1006328808917438547") //Voice chat channel ID
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: guild.voiceAdapterCreator,
	});
	try {
		return connection;
	} catch (error) {
		connection.destroy();
		throw error;
	}
}

client.on('ready', () =>  {
	console.log("Good Morning Master")

	client.on("messageCreate", async (msg) => {
		if (msg.content === "join") {
			connectToChannel();
		}

		if (msg.content === "leave") {
			(await connectToChannel()).destroy();
		}
			

		if (msg.content === "bruh") {
			//join
			const connection = await connectToChannel();

			//find yt link, create audio file, create player
			const stream = await play.stream("https://www.youtube.com/watch?v=2ZIpFytCSVc", {filter: "audioonly"})
			const player = createAudioPlayer();
			const resource = createAudioResource(stream.stream, {inputType: stream.type});

			//play sound (bruh)
			player.play(resource);
			player.on('error', (error) => console.error(error)); //Just in case
			connection.subscribe(player);
		}

		if (msg.content === prefix + "ping") 
    		msg.reply({content: "https://en.wikipedia.org/wiki/Pong"})

		if (msg.content === "goodGame") 
    		msg.reply({content: "https://www.zeldadungeon.net/wiki/Spirit_Tracks_Story :train2:"})

		if (msg.author.id === '642942437299585066' && msg.content === 'gay') {
			msg.reply({content: "frik off wit dat gay stuff"})
			return
			};
	})

})

// Set the prefix 
client.on("messageCreate", (message) => {
	// Exit and stop if it's not there
	if (!message.content.startsWith(prefix)) return;

	if (message.content.startsWith(`${prefix}ping`)) {
		message.channel.send("pong!");
	} else

	if (message.content.startsWith(`${prefix}yo`)) {
		message.channel.send("momma!");
	}
});

client.login(process.env.TOKEN)

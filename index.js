import DiscordJS, { IntentsBitField, Message, messageLink, VoiceChannel } from 'discord.js'
import { createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection } from '@discordjs/voice'
import dotenv from 'dotenv'
import play from 'play-dl';
dotenv.config()
const prefix = "!"; //Needs to be dynamically changed in the future on a per-server basis
const client = new DiscordJS.Client({
	intents:[
    	IntentsBitField.Flags.Guilds,
    	IntentsBitField.Flags.GuildMessages,
    	IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildVoiceStates,
	]
})

async function connectToChannel() {
	const guild = client.guilds.cache.get("1010406994332627026") //Guild/Server ID
	const channel = guild.channels.cache.get("1010406995083399212") //Voice chat channel ID
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

//Pull commands out to methods or separate files
async function bruh() {
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

	//leave
	//Make the bot leave the vc after sound has played
}

client.on('ready', () => {
	console.log("Good Morning master")
})

client.on("messageCreate", async (message) => { //Make commands not case-sensitive
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
					if(reaction.message.reactions.cache.get('1️⃣').count >= 2){
						console.log("1 pressed!");
						message.channel.send("{Bruh sound effect here}");
						bruh();
					}
				}
			})
        });
    }
	if (message.content.startsWith(`${prefix}join`))
		connectToChannel();

	if (message.content.startsWith(`${prefix}leave`)) //Fix so it doesn't join and then leave if not already in a chat
		(await connectToChannel()).destroy();

	if (message.content.startsWith(`${prefix}bruh`))
		bruh();

	if (message.content.startsWith(`${prefix}goodGame`)) 
		message.reply({content: "https://www.zeldadungeon.net/wiki/Spirit_Tracks_Story :train2:"})

	if (message.author.id === '642942437299585066' && message.content === 'gay') {
		message.reply({content: "frik off wit dat gay stuff"})
		return
		};
});

// Set the prefix 
// client.on("messageCreate", (message) => {
// 	// Exit and stop if it's not there
// 	if (!message.content.startsWith(prefix)) return;

// 	if (message.content.startsWith(`${prefix}ping`)) {
// 		message.channel.send("pong!");
// 	} else

// 	if (message.content.startsWith(`${prefix}yo`)) {
// 		message.channel.send("momma!");
// 	}
// });

client.login(process.env.TOKEN)
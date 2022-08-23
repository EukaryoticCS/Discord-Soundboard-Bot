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

client.on('ready', () =>  {
	console.log("Good Morning Master")
});

async function ping(){
	msg.reply({content: "https://en.wikipedia.org/wiki/Pong"})
}

async function gay(){
	msg.reply({content: "frik off wit dat gay stuff"})
}

async function bestGame(){
	msg.reply({content: "https://www.zeldadungeon.net/wiki/Spirit_Tracks_Story :train2:"})
}

client.on("messageCreate", async (msg) => {
	if(msg.content.startsWith(`${prefix}join`)) {
		connectToChannel();
	}

	if (msg.content.startsWith(`${prefix}leave`)) {
		(await connectToChannel()).destroy();
	}

	if (msg.content.startsWith(`${prefix}bruh`)){
		bruh();
	}
	///https://youtu.be/Ta2CK4ByGsw

	if  (msg.content.startsWith(`${prefix}boowomp`)) {
		//join
		const connection = await connectToChannel();

		//find yt link, create audio file, create player
		const stream = await play.stream("https://youtu.be/Ta2CK4ByGsw", {filter: "audioonly"})
		const player = createAudioPlayer();
		const resource = createAudioResource(stream.stream, {inputType: stream.type});

		//play sound (boowomp)
		player.play(resource);
		player.on('error', (error) => console.error(error)); //Just in case
		connection.subscribe(player);
	}

	if  (msg.content.startsWith(`${prefix}mario Scream`) ){
		//join
		const connection = await connectToChannel();

		//find yt link, create audio file, create player
		const stream = await play.stream("https://www.youtube.com/watch?v=TCW72WQdQ8A", {filter: "audioonly"})
		const player = createAudioPlayer();
		const resource = createAudioResource(stream.stream, {inputType: stream.type});

		//play sound (mario scream)
		player.play(resource);
		player.on('error', (error) => console.error(error)); //Just in case
		connection.subscribe(player);
	}

	if (msg.content.startsWith(`${prefix}play music`) ){
		//join
		const connection = await connectToChannel();

		let str = msg.content;
		let substrings = str.split(' ')[2];///substing is the Url of the video 
		console.log(substrings);

		//find yt link, create audio file, create player
		const stream = await play.stream(substrings, {filter: "audioonly"})
		const player = createAudioPlayer();
		const resource = createAudioResource(stream.stream, {inputType: stream.type});

		//play sound (play youtube music)
		player.play(resource);
		player.on('error', (error) => console.error(error)); //Just in case
		connection.subscribe(player);
	}

	if (msg.content === prefix + "ping") 
		ping()

	if (msg.content === "goodGame") 
		bestGame()

	if (msg.author.id === '642942437299585066' && msg.content === 'gay') {
		gay();
	};

	if(msg.content.startsWith(`${prefix}soundboard`)) {
		msg.channel.send("1️⃣bruh \n2️⃣boowomp  \n3️⃣wow \n4️⃣anime wow \n5️⃣Mom get the camera").then(sentMessage => {
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
			msg.channel.send("{Bruh sound effect here}");
			bruh();
			}
			else if(reaction.message.reactions.cache.get('2️⃣').count >= 2){
				console.log("2 pressed!");
				msg.channel.send("{I've ponged}");
				ping();
			}
			else if(reaction.message.reactions.cache.get('3️⃣').count >= 2){
				console.log("3 pressed!");
				msg.channel.send("{God this is the best Zelda game in the world}");
				bestGame();
			}
		}
		})
	});
}
})

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
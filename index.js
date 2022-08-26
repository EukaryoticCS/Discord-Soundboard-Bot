import DiscordJS, { IntentsBitField, Message, messageLink, VoiceChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
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

/*This is our Bruh Command */
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

async function boowomp() {
	//join
	const connection = await connectToChannel();

	//find yt link, create audio file, create player
	const stream = await play.stream("https://youtu.be/Ta2CK4ByGsw", {filter: "audioonly"})
	const player = createAudioPlayer();
	const resource = createAudioResource(stream.stream, {inputType: stream.type});

	//play sound (bruh)
	player.play(resource);
	player.on('error', (error) => console.error(error)); //Just in case
	connection.subscribe(player);

	//leave
	//Make the bot leave the vc after sound has played
}
async function marioScream() {
	//join
	const connection = await connectToChannel();

	//find yt link, create audio file, create player
	const stream = await play.stream("https://www.youtube.com/watch?v=TCW72WQdQ8A", {filter: "audioonly"})
	const player = createAudioPlayer();
	const resource = createAudioResource(stream.stream, {inputType: stream.type});

	//play sound (bruh)
	player.play(resource);
	player.on('error', (error) => console.error(error)); //Just in case
	connection.subscribe(player);

	//leave
	//Make the bot leave the vc after sound has played
}

/* This is a big messageCreate function for join and leave */
client.on("messageCreate", async (msg) => {
	if(msg.content.startsWith(`${prefix}join`)) {
		connectToChannel();
	}

	if(msg.content.startsWith(`${prefix}leave`)) {
		(await connectToChannel()).destroy();
	}


	if(msg.content.startsWith(`${prefix}bruh`)){
		bruh();
	}
	//Boowomp Sound effect off Youtube https://youtu.be/Ta2CK4ByGsw

	if(msg.content.startsWith(`${prefix}boowomp`)) {
		boowomp();
	}

	if(msg.content.startsWith(`${prefix}mario Scream`) ){
		marioScream();
	}

	if(msg.content.startsWith(`${prefix}play music`) ){
		const connection = await connectToChannel();
    
		let str = msg.content;
		let substrings = str.split(' ')[2];///substing is the Url of the video 
		console.log(substrings);

		//Youtube Link Player
		const stream = await play.stream(substrings, {filter: "audioonly"})
		const player = createAudioPlayer();
		const resource = createAudioResource(stream.stream, {inputType: stream.type});

		//play sound (play youtube music)
		player.play(resource);
		player.on('error', (error) => console.error(error)); //Just in case
		connection.subscribe(player);
	}

	if(msg.content.startsWith(`${prefix}soundboard`)) {
		msg.channel.send(":one: bruh \n:two:boowomp  \n:three:wow \n:four:anime wow \n:five:Mom get the camera").then(sentMessage => {
			sentMessage.react('1️⃣')
		sentMessage.react('2️⃣')
		sentMessage.react('3️⃣')
		sentMessage.react('4️⃣')
		sentMessage.react('5️⃣')
		
		client.on('messageReactionAdd', (reaction) => {
			if(reaction.message.author == "1006684796983971900"){
				//Here you can check the message itself, the author, a tag on the message or in its content, title ...
				if(reaction.message.reactions.cache.get('1️⃣').count >= 2){
				console.log("1 pressed!");
				msg.channel.send("heck yeah");
				bruh();
				}
				else if(reaction.message.reactions.cache.get('2️⃣') && reaction.message.reactions.cache.get('2️⃣').count >= 2){
					console.log('cry')
					msg.channel.send("i cry")
					boowomp();
				}
				else if(reaction.message.reactions.cache.get('3️⃣') && reaction.message.reactions.cache.get('3️⃣').count >= 2){
					console.log('i love jesus')
					msg.channel.send("i love jesus")
					marioScream();
				}
				else if(reaction.message.reactions.cache.get('4️⃣') && reaction.message.reactions.cache.get('4️⃣').count >= 2){
					console.log('Whats up my naga')
					msg.channel.send("Whats up my naga")
				}
				else if(reaction.message.reactions.cache.get('5️⃣') && reaction.message.reactions.cache.get('5️⃣').count >= 2){
					console.log('@Dom#3517 is a bitch')
					msg.channel.send("@Dom#3517 is a bitch")
				}
			}
			})
	});	
}
})
/*end of messageCreate*/
client.login(process.env.TOKEN)
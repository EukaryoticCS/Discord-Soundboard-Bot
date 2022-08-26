import DiscordJS, { IntentsBitField, Message, messageLink, VoiceChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection } from '@discordjs/voice'
import dotenv from 'dotenv'
import play from 'play-dl';
import mongoose from 'mongoose';
dotenv.config()

////////////// Setup stuff for Mongo //////////////////
import testSchema from './test-schema.js';
var server = testSchema
///////////////////////////////////////////////////////

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

async function soundBoard(msg) {
	var soundboardString = "Click a reaction to play the corresponding sound:\n"


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

	//////////Syntax for setting up a new server/updating commands?////////////
	// var test = await new testSchema({
	// 	guildID: "1006328808401555527",
	// 	prefix: prefix,
	// 	commands: [
	// 		{
	// 			commandName: "Bruh",
	// 			relatedEmoji: "pensive",
	// 			soundURL: "https://www.youtube.com/watch?v=2ZIpFytCSVc"
	// 		}, 
	// 		{
	// 			commandName: "Boowomp",
	// 			relatedEmoji: "slight_frown",
	// 			soundURL: "www.youtube.com"
	// 		}
	// ]
	// }).save()
	///////////////////////////////////////////////////////////////////////////

	server.findOne({ prefix: "!" }, function (err, server) {
		if (err) return handleError(err) //Potentially not needed?
		console.log(server.guildID + ' is your guildID');
		for (let i = 0; i < server.commands.length; i++) {
			soundboardString = soundboardString.concat(":", server.commands[i].relatedEmoji, ": " + server.commands[i].commandName, "\n");
		}
		console.log(soundboardString);
		msg.channel.send(soundboardString).then(sentMessage => {
			sentMessage.react("1️⃣")
		}
			) ;
	})
}

client.on('ready', async () =>  {
	console.log("Good Morning Master")

	var connection = await mongoose.connect(process.env.MONGO_URI || '', {
		keepAlive: true
	})

})

/* This is a big messageCreate function for join and leave */
client.on("messageCreate", async (msg) => {
	if(msg.content.toLowerCase().startsWith(`${prefix}join`)) {
		connectToChannel();
	}

	if(msg.content.toLowerCase().startsWith(`${prefix}leave`)) {
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
		
	if(msg.content.toLowerCase().startsWith(`${prefix}mario Scream`) ){
	marioScream();
	}

	if(msg.content.toLowerCase().startsWith(`${prefix}play music`) ){
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
}
})
/*end of messageCreate*/
client.login(process.env.TOKEN)
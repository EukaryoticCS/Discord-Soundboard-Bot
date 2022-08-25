import DiscordJS, { IntentsBitField, Message, messageLink, VoiceChannel } from 'discord.js'
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

async function soundBoard(msg) {
	var soundboardString = "Click a reaction to play the corresponding sound:\n"

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
		//join
		const connection = await connectToChannel();

		//Boowomp youtube link
		const stream = await play.stream("https://youtu.be/Ta2CK4ByGsw", {filter: "audioonly"})
		const player = createAudioPlayer();
		const resource = createAudioResource(stream.stream, {inputType: stream.type});

		//Let's Play boowomp
		player.play(resource);
		player.on('error', (error) => console.error(error)); //Just in case
		connection.subscribe(player);
	}

	if(msg.content.startsWith(`${prefix}mario Scream`) ){
		const connection = await connectToChannel();

		//find yt link, create audio file, create player
		const stream = await play.stream("https://www.youtube.com/watch?v=TCW72WQdQ8A", {filter: "audioonly"})
		const player = createAudioPlayer();
		const resource = createAudioResource(stream.stream, {inputType: stream.type});

		//Mario Scream sound now plays
		player.play(resource);
		player.on('error', (error) => console.error(error)); //Just in case
		connection.subscribe(player);
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
		soundBoard(msg);
	// 	msg.channel.send("1️⃣bruh \n2️⃣boowomp  \n3️⃣wow \n4️⃣anime wow \n5️⃣Mom get the camera").then(sentMessage => {
	// 		sentMessage.react('1️⃣')
	// 	sentMessage.react('2️⃣')
	// 	sentMessage.react('3️⃣')
	// 	sentMessage.react('4️⃣')
	// 	sentMessage.react('5️⃣')
		// client.on('messageReactionAdd', (reaction, author) => {
		// if(reaction.message.author == "1006684796983971900"){ //Makes sure the bot sent the message; reacting with 1️⃣ on another message won't trigger the command
		// 	//Here you can check the message itself, the author, a tag on the message or in its content, title ...
		// 	if(reaction.message.reactions.cache.get('1️⃣').count >= 2){
		// 	console.log("1 pressed!");
		// 	msg.channel.send("{Bruh sound effect here}");
		// 	bruh();
		// 	}
		// 	else if(reaction.message.reactions.cache.get('2️⃣').count >= 2){
		// 		console.log("2 pressed!");
		// 		msg.channel.send("Psych is a banger show");
		// 	}
		// 	else if(reaction.message.reactions.cache.get('3️⃣').count >= 2){
		// 		console.log("3 pressed!");
		// 		msg.channel.send("God I love Spirit Tracks");
		// 	}
		// }
		// })
	// });
}
})
/*end of messageCreate*/
client.login(process.env.TOKEN)
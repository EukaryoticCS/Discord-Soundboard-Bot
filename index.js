import DiscordJS, { IntentsBitField } from 'discord.js'
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice'
import dotenv from 'dotenv'
import play from 'play-dl';
import mongoose from 'mongoose';
import emojione from 'emojione';
dotenv.config();

//We could store the ID in a constant?
const NeumontServerID = "1006328808401555527";
const NeumontVoiceID = "1006328808917438547";

const EukaryoticServerID = "1010406994332627026";
const EukaryoticVoiceID = "1010406995083399212";

////////////// Setup stuff for Mongo //////////////////
import testSchema from './test-schema.js';
var server = testSchema;
///////////////////////////////////////////////////////

const prefix = "!"; //Needs to be dynamically changed in the future on a per-server basis

const client = new DiscordJS.Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildVoiceStates,
	]
})

async function connectToChannel() {
	const guild = client.guilds.cache.get(NeumontServerID) //Guild/Server ID
	const channel = guild.channels.cache.get(NeumontVoiceID) //Voice chat channel ID
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

async function playMusic(URL) {
	const connection = await connectToChannel();

	// let str = msg.content;
	// let substrings = str.split(' ')[2];///substing is the Url of the video 
	// console.log(substrings);

	try {
		//Youtube Link Player
		const stream = await play.stream(URL, { filter: "audioonly" })
		const player = createAudioPlayer();
		const resource = createAudioResource(stream.stream, { inputType: stream.type });

		//play sound (play youtube music)
		player.play(resource);
		player.on('error', (error) => console.error(error)); //Just in case
		connection.subscribe(player);

		player.on(AudioPlayerStatus.Idle, async () => {
			connection.destroy();
		})
	} catch (e) {
		console.log("Error playing sound!")
	}
}

async function createSound(commandName, relatedEmoji, soundURL) {
	console.log("Creating sound");
	if (commandName != "" && relatedEmoji != "" && soundURL != "") {
		await server.updateOne({ guildID: NeumontServerID }, {
			$push: {
				commands: {
					"commandName": commandName,
					"relatedEmoji": relatedEmoji,
					"soundURL": soundURL,
				}
			}
		})
	}
}

async function deleteSound(commandName) {
	await server.updateOne({ guildID: NeumontServerID }, {
		$pull: {"commands": {"commandName": commandName}}
	})
}

async function soundBoard(msg) {
	var soundboardString = "Click a reaction to play the corresponding sound:\n"

	server.findOne({ guildID: NeumontServerID }, function (err, server) {
		if (err) return handleError(err) //Potentially not needed?
		console.log(server.guildID + ' is your guildID');

		for (let i = 0; i < server.commands.length; i++) {
			soundboardString = soundboardString.concat(":", server.commands[i].relatedEmoji, ": " + server.commands[i].commandName, "\n");
		}

		console.log(soundboardString);
		msg.channel.send(soundboardString).then(sentMessage => {
			for (let i = 0; i < server.commands.length; i++) {
				sentMessage.react(emojione.shortnameToUnicode(":" + server.commands[i].relatedEmoji + ":"));
			}
		}
		)

		client.on('messageReactionAdd', (reaction, user) => {
			if (reaction.message.author == "1006684796983971900" && user.id != "1006684796983971900") {
				//Here you can check the message itself, the author, a tag on the message or in its content, title ...
				for (let i = 0; i < server.commands.length; i++) {
					if (reaction.message.reactions.cache.get(emojione.shortnameToUnicode(":" + server.commands[i].relatedEmoji + ":")) &&
						reaction.message.reactions.cache.get(emojione.shortnameToUnicode(":" + server.commands[i].relatedEmoji + ":")).count >= 2) {
						console.log("Button pressed!");
						msg.channel.send("Button pressed!");
						playMusic(server.commands[i].soundURL);
					}
				}
			}
		})
	});
}


////////////Unused commands////////////
async function bruh() {
	playMusic("https://www.youtube.com/watch?v=2ZIpFytCSVc");
}

async function boowomp() {
	playMusic("https://youtu.be/Ta2CK4ByGsw");
}

async function marioScream() {
	playMusic("https://www.youtube.com/watch?v=TCW72WQdQ8A");
}
////////////////////////////////////////

client.on('ready', async () => {
	console.log("Good Morning Master")

	var connection = await mongoose.connect(process.env.MONGO_URI || '', {
		keepAlive: true
	})

	// ////////Syntax for setting up a new server/updating commands?////////////
	// var test = await new testSchema({
	// 	guildID: NeumontServerID,
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
	// 			soundURL: "https://youtu.be/FHQC6BsW9AY"
	// 		},
	// 		{
	// 			commandName: "Rickroll", 
	// 			relatedEmoji: "smiling_imp",
	// 			soundURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
	// 		},
	// ]
	// }).save()
	// /////////////////////////////////////////////////////////////////////////
})

/* This is a big messageCreate function for join and leave */
client.on("messageCreate", async (msg) => {
	if (msg.content.toLowerCase().startsWith(`${prefix}help`)) { //Help command -- shows possible commands and syntax
		server.find({ guildID: NeumontServerID }, prefix);

		msg.channel.send
		("Commands: \n\n" +
		"\`help\`: Sends this message :nerd:\n\n" +
		"\`join\`: Joins the voice call of the user that sent it. :ear:\n" +
		"\`leave\`: Leaves the voice call. :wave:\n\n" +
		"\`soundboard\`: Sends the soundboard message, which you can react to to play the corresponding sound. :musical_note:\n" + 
		"\`createsound <commandName> <relatedEmoji> <YoutubeURL>\`: Creates a custom sound to the soundboard. Takes in name, any base emoji, and a playable Youtube URL. :notepad_spiral:\n" +
		"\`deletesound <commandName>\`: Deletes the sound from the soundboard that matches the given command name. :x:\n\n" +
		"Your prefix is: \"" + prefix + "\""
		)
	}
	
	else if (msg.content.toLowerCase().startsWith(`${prefix}join`)) { //Join command -- connects bot to voice chat
		connectToChannel();
	}

	else if (msg.content.toLowerCase().startsWith(`${prefix}leave`)) { //Leave command -- makes bot leave voice chat
		//Check first if bot is in a voice chat?
		(await connectToChannel()).destroy();
	}

	else if (msg.content.toLowerCase().startsWith(`${prefix}soundboard`)) { //Soundboard command -- sends message with reactions to play sounds
		soundBoard(msg);
	}

	if (msg.content.toLowerCase().startsWith(`${prefix}play music`)) {
		playMusic("https://youtu.be/Ta2CK4ByGsw")
	}

	if (msg.content.toLowerCase().startsWith(`${prefix}createsound`)) {
		let str = msg.content;
		let commandName = str.split(' ',4)[1];
		let relatedEmoji = str.split(' ',4)[2].replace(":","");
		let soundURL = str.split(' ',4)[3];

		createSound(commandName, relatedEmoji, soundURL);
		console.log("createSound");
		console.log(relatedEmoji);

	}
	
	else if (msg.content.toLowerCase().startsWith(`${prefix}deletesound`)) { //Deletesound command -- allows a user to remove a custom sound
		var commandName = "Vine boom";
		deleteSound(commandName);
	}

	// //////////Unused commands////////////
	// if (msg.content.toLowerCase().startsWith(`${prefix}bruh`)) { //Bruh sound
	// 	bruh();
	// }
	// //Boowomp Sound effect off Youtube https://youtu.be/Ta2CK4ByGsw
	
	// if (msg.content.toLowerCase().startsWith(`${prefix}boowomp`)) { //Boowomp sound
	// 	boowomp();
	// }
	
	// if (msg.content.toLowerCase().startsWith(`${prefix}mario Scream`)) { //Mario scream sound
	// 	marioScream();
	// }
	// else if (msg.content.toLowerCase().startsWith(`${prefix}play music`)) { //Play music command -- unlisted command that plays a Rickroll
	// 	playMusic("https://youtu.be/Ta2CK4ByGsw")
	// }
	////////////////////////////////////////
})
/*end of messageCreate*/
client.login(process.env.TOKEN)
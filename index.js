import DiscordJS, { IntentsBitField, VoiceChannel } from 'discord.js'
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection } from '@discordjs/voice'
import dotenv from 'dotenv'
import play from 'play-dl';
import mongoose from 'mongoose';
import emojione from 'emojione';
dotenv.config();

//We could store the ID in a constant?
const NeumontServerID = "1006328808401555527";

const EukaryoticServerID = "1010406994332627026";

////////////// Setup stuff for Mongo //////////////////
import testSchema from './test-schema.js';
var server = testSchema;
///////////////////////////////////////////////////////

const client = new DiscordJS.Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildVoiceStates,
	]
})

async function connectToChannel(userID) {
	const guild = client.guilds.cache.get(NeumontServerID) //Guild/Server ID

	try {
		const user = await guild.members.fetch(userID)
		const channel = guild.channels.cache.get(user.voice.channel.id) //Voice chat channel ID

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
	} catch {
		return;
	}
}

async function playMusic(URL, userID) {
	const connection = await connectToChannel(userID);

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

async function changePrefix(prefix) {
	await server.updateOne({ guildID: NeumontServerID }, {
		"prefix": prefix
	})
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
			soundboardString = soundboardString.concat(server.commands[i].relatedEmoji, " " + server.commands[i].commandName, "\n");
		}

		console.log(soundboardString);
		msg.channel.send(soundboardString).then(sentMessage => {
			for (let i = 0; i < server.commands.length; i++) {
				sentMessage.react(server.commands[i].relatedEmoji);
			}
		}
		)

		client.on('messageReactionAdd', (reaction, user) => {
			if (reaction.message.author == "1006684796983971900" && user.id != "1006684796983971900") {
				//Here you can check the message itself, the author, a tag on the message or in its content, title ...
				for (let i = 0; i < server.commands.length; i++) {
					if (reaction.message.reactions.cache.get(server.commands[i].relatedEmoji) &&
						reaction.message.reactions.cache.get(server.commands[i].relatedEmoji).count >= 2) {
						console.log("Button pressed!");
						msg.channel.send("Button pressed!");
						playMusic(server.commands[i].soundURL, user.id);
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
	let query = await server.findOne({ guildID: NeumontServerID }, 'prefix').exec();
	let prefix = query.get("prefix");
	if (msg.content.toLowerCase().startsWith(`${prefix}help`)) { //Help command -- shows possible commands and syntax

		msg.channel.send
		("Commands: \n\n" +

		"----- MISC COMMANDS -----\n" +
		`\`${prefix}help\`: Sends this message :nerd:\n` +
		`\`${prefix}changeprefix <newPrefix>\`: Allows you to change the server's prefix for this bot :exclamation:\n\n` +

		"----- VOICE CHAT COMMANDS -----\n" +
		`\`${prefix}join\`: Joins the voice call of the user that sent it. :ear:\n` +
		`\`${prefix}leave\`: Leaves the voice call. :wave:\n\n` +

		"----- SOUNDBOARD COMMANDS -----\n" +
		`\`${prefix}soundboard\`: Sends the soundboard message, which you can react to to play the corresponding sound. :musical_note:\n` + 
		`\`${prefix}createsound <commandName> <relatedEmoji> <YoutubeURL>\`: Creates a custom sound to the soundboard. Takes in name, any base emoji, and a playable Youtube URL. :notepad_spiral:\n` +
		`\`${prefix}deletesound <commandName>\`: Deletes the sound from the soundboard that matches the given command name. :x:\n\n` +
		
		"----- EXAMPLES -----\n" +
		`${prefix}changeprefix %\n` +
		`${prefix}createsound Rickroll :smiling_imp: <https://www.youtube.com/watch?v=dQw4w9WgXcQ>\n` +
		`${prefix}deletesound Rickroll\n\n` +
		
		"Your prefix is: \"" + prefix + "\""
		
		)
	}
	
	else if (msg.content.toLowerCase().startsWith(`${prefix}join`)) { //Join command -- connects bot to voice chat
		connectToChannel(msg.author.id);
	}

	else if (msg.content.toLowerCase().startsWith(`${prefix}leave`)) { //Leave command -- makes bot leave voice chat
		//Check first if bot is in a voice chat?
		if (msg.member.voice.channel) {
			(await connectToChannel(msg.author.id)).destroy();
		}
	}

	else if (msg.content.toLowerCase().startsWith(`${prefix}changeprefix`)) {
		let str = msg.content;
		let newPrefix = str.split(' ',2)[1];
		changePrefix(newPrefix);
		msg.channel.send("Prefix changed! Your new prefix is: " + newPrefix);
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
		let relatedEmoji = str.split(' ',4)[2];
		let soundURL = str.split(' ',4)[3];

		createSound(commandName, relatedEmoji, soundURL);

	}
	
	else if (msg.content.toLowerCase().startsWith(`${prefix}deletesound`)) { //Deletesound command -- allows a user to remove a custom sound
		let str = msg.content;
		let commandName = str.split(' ',2)[1];
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
import DiscordJS, { IntentsBitField, VoiceChannel } from 'discord.js'
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection } from '@discordjs/voice'
import dotenv from 'dotenv'
import play from 'play-dl';
import mongoose from 'mongoose';
dotenv.config();

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

async function connectToChannel(userID, currentServerID) {
	const guild = client.guilds.cache.get(currentServerID) //Guild/Server ID

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
		console.log("Error!");
		return;
	}
}

async function playMusic(URL, userID, currentServerID) {
	const connection = await connectToChannel(userID, currentServerID);

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
	} catch {
		console.log("Error playing sound!")
	}
}

async function changePrefix(prefix, currentServerID) {
	await server.updateOne({ guildID: currentServerID }, {
		"prefix": prefix
	})
}

async function createSound(commandName, relatedEmoji, soundURL, currentServerID) {
	console.log("Creating sound");
	if (commandName != "" && relatedEmoji != "" && soundURL != "") {
		await server.updateOne({ guildID: currentServerID }, {
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

async function deleteSound(commandName, currentServerID) {
	await server.updateOne({ guildID: currentServerID }, {
		$pull: { "commands": { "commandName": commandName } }
	})
}

async function soundBoard(msg, currentServerID) {
	var soundboardString = "Click a reaction to play the corresponding sound:\n"

	server.findOne({ guildID: currentServerID }, function (err, server) {
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
						// console.log("Button pressed!");
						// msg.channel.send("Button pressed!");
						playMusic(server.commands[i].soundURL, user.id, currentServerID);
					}
				}
			}
		})
	});
}

client.on('ready', async () => {
	console.log("Good Morning Master")

	var connection = await mongoose.connect(process.env.MONGO_URI || '', {
		keepAlive: true
	})
})

client.on('guildCreate', async guild => { //Sets up new servers with 3 commands: Bruh, Boowomp, and Rickroll
	var test = await new testSchema({
		guildID: guild.id,
		prefix: "!",
		commands: [
			{
				commandName: "Bruh",
				relatedEmoji: "pensive",
				soundURL: "https://www.youtube.com/watch?v=2ZIpFytCSVc"
			}, 
			{
				commandName: "Boowomp",
				relatedEmoji: "slight_frown",
				soundURL: "https://youtu.be/FHQC6BsW9AY"
			},
			{
				commandName: "Rickroll", 
				relatedEmoji: "smiling_imp",
				soundURL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
			},
	]
	}).save()
})

client.on("guildDelete", async guild => { //Removes data from the database if a server leaves
	server.findOneAndDelete({"guildID": guild.id})
})

/* This is a big messageCreate function for join and leave */
client.on("messageCreate", async (msg) => {
	let currentServerID = msg.guild.id;
	let query = await server.findOne({ guildID: currentServerID }, 'prefix').exec();
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
		connectToChannel(msg.author.id, currentServerID);
	}

	else if (msg.content.toLowerCase().startsWith(`${prefix}leave`)) { //Leave command -- makes bot leave voice chat
		//Check first if bot is in a voice chat?
		if (msg.member.voice.channel) {
			(await connectToChannel(msg.author.id, currentServerID)).destroy();
		}
	}

	else if (msg.content.toLowerCase().startsWith(`${prefix}changeprefix`)) { //Change prefix command -- allows user to change command prefix
		let str = msg.content;
		let newPrefix = str.split(' ', 2)[1];
		changePrefix(newPrefix, currentServerID);
		msg.channel.send("Prefix changed! Your new prefix is: " + newPrefix);
	}

	else if (msg.content.toLowerCase().startsWith(`${prefix}soundboard`)) { //Soundboard command -- sends message with reactions to play sounds
		soundBoard(msg, currentServerID);
	}

	else if (msg.content.toLowerCase().startsWith(`${prefix}createsound`)) { //Create sound command -- allows user to add a custom sound to the soundboard
		let str = msg.content;
		let commandName = str.split(' ', 4)[1];
		let relatedEmoji = str.split(' ', 4)[2];
		let soundURL = str.split(' ', 4)[3];

		createSound(commandName, relatedEmoji, soundURL, currentServerID);
	}

	else if (msg.content.toLowerCase().startsWith(`${prefix}deletesound`)) { //Deletesound command -- allows a user to remove a custom sound
		let str = msg.content;
		let commandName = str.split(' ', 2)[1];
		deleteSound(commandName, currentServerID);
	}

})
/*end of messageCreate*/
client.login(process.env.TOKEN)
import DiscordJS from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const client = new DiscordJS.Client({
    intents:[
    ]

})
client.on('ready',()=>{
    console.log('bot ready')
})

client.on('messageCreate', (message)=>{

    if(message.content === 'ping'){
        message.reply({
            content: 'pong',
        })
    }
})

client.login(process.env.TOKEN)


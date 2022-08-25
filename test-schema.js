import mongoose from "mongoose";

const schema = new mongoose.Schema({
    guildID: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true
    },
    commands: [
        {
        commandName: {
            type: String,
            required: true
        },
        relatedEmoji: {
            type: String,
            required: true
        },
        soundURL: {
            type: String,
            required: true
        }
    }
]
})

export default mongoose.model('testing', schema, 'testing');
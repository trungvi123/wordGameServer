import mongoose from "mongoose";


const wordSchema = mongoose.Schema({
    word : {
        type: String,
        require:true,
        unique:true
    },
    author : {
        type: String,
        default : 'Ẩn danh'
    },
    authorNote : {
        type: String,
        default: null
    }
})

export const wordModel = mongoose.model('wordSchema_wordGame',wordSchema)
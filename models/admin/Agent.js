const mongoose = require("mongoose")

const agentSchema = new mongoose.Schema({
    agent_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile_number:{
        type:String,
    },
    agent_code:{
        type:String
        
    }
},{timestamps:true})

module.exports = mongoose.model("Agent",agentSchema)
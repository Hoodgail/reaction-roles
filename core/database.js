const mongoose = require("mongoose");

module.exports = mongoose.model("reactionroles",
    mongoose.Schema({
        object_id: String,
        channel_id: String, 
        emoji_id: String, 
        role_id: String       
    })
)
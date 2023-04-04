import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    to: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },

});

const messageModel = mongoose.model("messages", messageSchema);

export default messageModel;
import messageModel from "../models/messages.model.js";

export default class MessageManager{
    constructor(){
        console.log("Working with messages using database");
    }

    
    getAll = async () => {
        const messages = await messageModel.find().lean();

        return messages;
    };

    create = async (message) => {
        const result = await messageModel.create(message);

        return result;
    };
}
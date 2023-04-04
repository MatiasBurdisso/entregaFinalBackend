import { Router, json } from "express";
import { MessageManager } from "../dao/index.js";

const messagesRouter  = Router ();
const messageManager = new MessageManager();



messagesRouter.get("/", async (req, res) => {
    const messages = await messageManager.getAll();
    res.send(messages);
});

messagesRouter.post("/", async (req, res) => {
    const {to, from, content, date } = req.body;

    
    if(!to || !from || !content || !date ) {
        return res
            .status(400)
            .send({ status: "error", payload: "Missing parameters" });
    }

    const result = await messageManager.create({
        to,
        from,
        content,
        date,
        messages: [],
    });

    res.status(201).send({ status: "ok", payload: result});
});
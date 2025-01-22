import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import 'dotenv/config';
import mongoose from "mongoose";
import UserChats from "./models/userChats.js";
import Chat from "./models/chat.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node' 

const port = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))

const connect = async () => {
    try{
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB")
    }catch(err){
        console.logg(err)
    }
}

app.use(express.json())

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
})


app.get("/api/upload", (req, res)=>{
    const result = imagekit.getAuthenticationParameters();
    res.send(result)
});

// app.get("/api/test", ClerkExpressRequireAuth(), (req, res) => {
//     const userId = req.auth.userId;
//     console.log(userId)
//     res.send("Sucess!")
// })

app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
    const {text} = req.body;
    const userId = req.auth.userId

    console.log(text)
    try {
        //CREATE A NEW CHAT
        const newChat = new Chat ({
            userId: userId,
            history: [{role: "user", parts: [{text}]}],
        });

        const savedChat = await newChat.save();

        //CHECK IF USERCHAT EXISTS
        const userChats = await UserChats.find({userId: userId});

        //IF NOT EXIST CREATE NEW AND APPEND CHAT TO CHATS ARRAY
        if (!userChats.length) {
            const newUserChats = new UserChats ({
                userId: userId,
                chats: [
                    {
                        _id: savedChat.id,
                        title: text.substring(0, 40),
                    }
                ]
            })
            await newUserChats.save()
        } else {
            await UserChats.updateOne({userId: userId},{
                $push:{
                    chats:{
                        _id: savedChat._id,
                        title: text.substring(0, 40),
                    },
                },
            })
            res.status(201).send(newChat._id);
        }
    }  catch(err) {
        console.log(err)
        res.status(500).send("Error creating chat!")
    }
});

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    try {
        const userChats = await UserChats.find({ userId })
        
        res.status(200).send(userChats[0].chats);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching userchats!");
    }
});


app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    try {
        const chat = await Chat.findOne({ _id:req.params.id, userId })
        
        res.status(200).send(chat);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching chat!");
    }
})


app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    const {question, answer, img} = req.body;

    const newItems = [
        ...(question 
        ? [{role: "user", parts: [{text: question}], ...(img && { img })}]
        : []), 
        {role: "model", parts: [{text: answer}]},
    ];

    try {
        const updatedChat = await Chat.updateOne(
            {_id: req.params.id, userId}, 
            {
            $push: {
                history: {
                    $each: newItems,
                }
            }
        }); 
        res.status(200).send(updatedChat);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding conversation");
    }

})

app.delete("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    try {
        // Delete the chat
        await Chat.deleteOne({ _id: req.params.id, userId });
        
        // Remove the chat from UserChats
        await UserChats.updateOne(
            { userId },
            { $pull: { chats: { _id: req.params.id } } }
        );
        
        res.status(200).send("Chat deleted successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting chat");
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(401).send("Unauthenticated");
});

app.listen(port, () =>{
    connect()
    console.log("Server running on 3000");
});
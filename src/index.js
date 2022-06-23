import express from "express";
import fs from 'fs';
import jwt from "jsonwebtoken";
import {isEmail} from "./utils/isEmail.js"

const app = express();
app.use(express.json());

let database = JSON.parse(fs.readFileSync("database.json","utf-8"));


app.post("/login",(req,res)=>{
    const {email,password} = req.body;
    if(!email||!password){
        res.status(400).send("Email or password required!!");
        return;
    }
    const user = database.users.find((user)=>user.email == email)
    if(!user){
        res.status(400).send("No user found");
        return;
    }
    if(user.password !== password){
        res.status(400).send("invalid password");
        return;
    }
    const token = jwt.sign({id: user.id},'secret');
    return res.status(200).json({
        user:{
            id:user.id,
            email:user.email
        },
        token,
    });

})
app.post("/signup",(req,res)=>{
    const {email,password} = req.body;
    if(!email||!password){
        res.status(400).send("Email or password required!!");
        return;
    }
    if(!isEmail(email)){
        res.status(400).send("Email invalid");
        return;
    }
    if(database.users.find((user)=>user.email == email)){
        res.status(400).send("Email already taken");
        return;
    }
    database.users.push({
        id: database.users.length,
        password,
        email,
    })

    fs.writeFileSync("database.json",JSON.stringify(database,null,2));
    res.status(200).send("usuario criado");
})

app.post("/upload",(req,res)=>{

    const {token} = req.body;
    const {id} = jwt.verify(token,"secret")

    if(!token||!id){
        res.status(400).send("invalid or non existing token, unauthorized");
        return;
    }
    const {title,artist,url} = req.body;
    if(!title||!artist||!url){
        res.status(400).send("you must inform the artist,title and url of a music");
        return;
    }
    database.music.push({
        id: database.music.length,
        title,
        artist,
        url,
    })
    fs.writeFileSync("database.json",JSON.stringify(database,null,2));
    res.status(200).send("musica adicionada");
})

app.post("/album/append",(req,res)=>{
    const {token} = req.body;
    const {id} = jwt.verify(token,"secret")
    if(!token||!id){
        res.status(400).send("invalid or non existing token, unauthorized");
        return;
    }
    const {musicId,albumId} = req.body
    if(!musicId||!albumId){
        res.status(400).send("you must inform the music and album ID's");
        return;
    }
    const music = database.music.find((music)=> music.id == musicId) 
    const album = database.album.find((album)=> album.id == albumId)
    if(!music||!album){
        res.status(400).send("music and/or album not found")
        return;
    }
    album.music.push(parseInt(musicId));
    fs.writeFileSync("database.json",JSON.stringify(database,null,2));
    res.status(200).send(`musica adicionada ao album ${album.title}`);
})


app.post("/album/create",(req,res)=>{
    const token = req.headers.authorization.replace("bearer ","");
    const {id} = jwt.verify(token,"secret")
    if(!token||!id){
        res.status(400).send("invalid or non existing token, unauthorized");
        return;
    }
    const {title,artist} = req.body;
    if(!title||!artist){
        res.status(400).send("you must inform the artist,title of an album");
        return;
    }
    database.album.push({
        id: database.album.length,
        title,
        artist,
        music:[]
    })
    fs.writeFileSync("database.json",JSON.stringify(database,null,2));
    res.status(200).send("album adicionado");
})
app.get("/album/:albumId",(req,res)=>{
    const token = req.headers.authorization.replace("bearer ","");
    const {id} = jwt.verify(token,"secret")
    if(!token||!id){
        res.status(400).send("invalid or non existing token, unauthorized");
        return;
    }
    const {albumId} = req.params;
    const album = database.album.find((album)=> album.id == albumId)
    if(!album){
        res.status(400).send("no album found");
        return;
    }
    const musics = database.music.filter((music)=>{return album.music.includes(music.id)})
    res.status(200).json(musics)
})






app.listen(4000,()=>{
    console.log("serivdor rodando")
})
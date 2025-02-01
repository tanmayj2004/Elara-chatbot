const express= require("express");
const app= express();
const path= require("path");
require('dotenv').config();




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
 
const API_KEY = process.env.API_KEY;
const port= 8080;
app.get("/users", (req, res) => {
    res.render("index", {
        title: "Elara - Welcome to AI World",
        apiKey: API_KEY,
        suggestions: [
            { text: "Help me plan a game night with my 5 best friends for under $100.", icon: "draw" },
            { text: "What are the best tips to improve my public speaking skills?", icon: "lightbulb" },
            { text: "Can you help me find the latest news on Web Development?", icon: "explore" },
            { text: "Write JavaScript code to sum all elements in an array.", icon: "code" }
        ],
        messages: [
            { type: "outgoing", avatar: "gemini.svg", text: "Hello there!" },
            { type: "incoming", avatar: "user2.jpg", text: "How can I assist you today?" }
        ]
    });
});


app.listen(port, ()=>{
    console.log("port is listening");
})
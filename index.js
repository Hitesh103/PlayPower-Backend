import express from "express";
import bodyParser from "body-parser";
import { connectDb } from "./config/db_connection.js";
import apiRoutes from './router/index.js';
import dotenv from "dotenv";
dotenv.config();

const app = express();

// console.log("zzzz",process.env)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.listen(8000, async () => {
    console.log("Server Started");
    connectDb();
});

app.use("/api", apiRoutes);

app.get("/", (req, res)=>{
    res.send("<h1>Namaste From Server 🙏</h1>");
})

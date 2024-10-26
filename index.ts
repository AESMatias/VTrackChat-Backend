import express, { Request, Response } from "express";
import { router } from "./source/routes/userRoutes";
require('dotenv').config();
import cookieParser from 'cookie-parser'

// const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.user(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", router);

app.get("/", (req, res) => {
    res.json({ message: "Welcome!" });
});



app.listen(3000, () => console.log(`The server is running on port ${PORT}`));
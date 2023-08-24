import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from 'cors';
import bodyParser from "body-parser";
import mongoose from "mongoose";


import userRouter from './routes/users.js';
import postRouter from './routes/posts.js';
import commentRouter from './routes/comments.js';
import notifRouter from './routes/notifications.js';


import auth from './helpers/auth.js'
import errorHandler from './helpers/errorHandler.js'

dotenv.config({path:'.env'});

const app = express();
const mongoString = process.env.DATABASE_URL;
const namaDB = process.env.DBNAME;
const api = process.env.API_URL;

app.use(bodyParser.json());

app.listen(3001,() => {
    console.log(`Server Berjalan di ${3001}`)
});

mongoose.connect(mongoString,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: namaDB
})
    .then (()=>console.log('Database Terhubung'))
    .catch(err => console.log(err));



app.use(cors());
app.options('*',cors());
app.use(morgan('tiny'));
// app.use(auth());
// app.use(errorHandler);
app.use(`${api}/user`,userRouter);
app.use(`${api}/post`,postRouter);
app.use(`${api}/comment`,commentRouter);
app.use(`${api}/notification`,notifRouter);

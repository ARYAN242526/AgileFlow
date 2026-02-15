import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectToDB from './db/db.js';

dotenv.config();

connectToDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))


app.listen(PORT , () => {
    console.log(`Server is listening on port : ${PORT}`);    
})
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectToDB from './db/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js'
import sprintRoutes from './routes/sprint.routes.js';

dotenv.config();

connectToDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

// routes declaration
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use('/api/v1/projects' , projectRoutes);
app.use('/api/v1/sprints', sprintRoutes);


app.listen(PORT , () => {
    console.log(`Server is listening on port : ${PORT}`);    
})
import 'dotenv/config';
import express from 'express';
import './config/connection.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

const port = process.env.PORT || 3000;

//need to add netlify and localhost url
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes, taskRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) =>{
    res.send('Hello World!')
})

app.listen(port, () =>{
    console.log(`Server is listening on port: http://localhost:${port}`);
})


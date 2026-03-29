import 'dotenv/config';
import express from 'express';
import './config/connection.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js'

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (req, res) =>{
    res.send('Hello World!')
})

app.listen(port, () =>{
    console.log(`Server is listening on port: http://localhost:${port}`);
})


import 'dotenv/config';
import express from 'express';
import './config/connection.js'

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) =>{
    res.send('Hello World!')
})

app.listen(port, () =>{
    console.log(`Server is listening on port: http://localhost:${port}`);
})


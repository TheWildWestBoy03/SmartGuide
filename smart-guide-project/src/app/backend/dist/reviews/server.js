import express from 'express';
import monumentRoutes from './routes/MonumentRoutes.js';
import cors from 'cors';
const app = express();
const port = 4100;
const corsOptions = {
    origin: 'http://localhost:4200',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(monumentRoutes);
app.listen(port, () => console.log("Monument information handling service works!"));

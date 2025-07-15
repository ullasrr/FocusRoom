import { config } from 'dotenv';
config();


import { fileURLToPath } from 'url';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors'
import express,{json} from 'express';
import http from 'http';
import { Server } from 'socket.io';
import setupSocket from './socket/index.js';

import dataRoutes from './routes/leftSidebarRoutes.js';
import calendarRoutes from './routes/CalendarRoutes.js'
import notesRoutes from './routes/notesRoutes.js'
import themesRoutes from './routes/themesRoutes.js'
import studygptRoutes from './routes/StudyGPTRoutes.js';
import roomRoutes from './models/RoomModel.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server,{cors:{origin:'*'}});
setupSocket(io);
const PORT = process.env.PORT;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());

//Routes

app.use('/',dataRoutes);
app.use('/api/notes',notesRoutes);
app.use('/themes', express.static(path.join(__dirname, 'public/themes')));
app.use('/api/themes',themesRoutes);
app.use('/api', calendarRoutes); 
app.use('/api',studygptRoutes)
app.use('/api/room', roomRoutes);








//MongoDB connection

mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => console.log("✅ Connected to MongoDB from backend"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

//start server

app.listen(PORT, () => {
    try {
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Error starting the server:', error);
    }
});
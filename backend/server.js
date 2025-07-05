import dataRoutes from './routes/leftSidebarRoutes.js';
import notesRoutes from './routes/notesRoutes.js'
import mongoose from 'mongoose';
import cors from 'cors'
import express,{json} from 'express';;
import { config } from 'dotenv';
config();
const app = express();
const PORT = process.env.PORT;
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use('/',dataRoutes);

mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => console.log("✅ Connected to MongoDB from backend"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.use('/api/notes',notesRoutes);

app.listen(PORT, () => {
    try {
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Error starting the server:', error);
    }
});
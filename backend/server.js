import dataRoutes from './routes/leftSidebarRoutes.js';
import express,{json} from 'express';;
import { config } from 'dotenv';
config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/',dataRoutes);


app.listen(PORT, () => {
    try {
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Error starting the server:', error);
    }
});
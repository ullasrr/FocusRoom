const express = require('express');
const cors = require("cors");
const { json } = require('body-parser');
const dotenv = require('dotenv')
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const dataRoutes = require('./routes/leftSidebarRoutes.js');

app.use(cors());
app.use(express.json());
app.use('/',dataRoutes);

const mockData = {
  "initialTime": 299,
  "notes": "Write your notes here from backend", 
    "sidebar": {
        "links": [
  { "icon": "Clock", "label": "Timer" },
  { "icon": "StickyNote", "label": "Notes" },
  { "icon": "Music", "label": "Sounds" },
  { "icon": "Palette", "label": "Themes" },
  { "icon": "ListChecks", "label": "To do" },
  { "icon": "Users", "label": "Create custom room" },
  { "icon": "Flame", "label": "Streak" },
  { "icon": "Quote", "label": "Enable study quotes" },
  { "icon": "Sparkles", "label": "Study GPT" }
]

    }
};

app.get('/',(req,res)=>{
    res.status(200).json(mockData);
})

app.listen(PORT, () => {
    try {
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Error starting the server:', error);
    }
});
import getThemes from '../models/themesModel.js';

export const fetchThemes=(req,res)=>{
    try {
        const themes = getThemes();
        console.log(themes)
        res.json(themes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load themes' });
    }
}



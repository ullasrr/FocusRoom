import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename= fileURLToPath(import.meta.url);
const __dirname= path.dirname(__filename)

const getThemes= ()=>{
    const themesDir= path.join(__dirname,'../public/themes');
    const files = fs.readdirSync(themesDir);

    const themeUrls = files.map(file=> `/themes/${file}`)
    console.log(themeUrls)
    return themeUrls;
}

export default getThemes;
import express from 'express'
const router = express.Router();
import { handleStudyGPT } from '../controllers/StudyGPTController.js';

router.post('/studyGPT',handleStudyGPT);

export default router;
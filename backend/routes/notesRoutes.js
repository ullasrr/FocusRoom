import express from 'express';
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/notesController.js';

const router = express.Router();

router.get('/', getNotes);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;

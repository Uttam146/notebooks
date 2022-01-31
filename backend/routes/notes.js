const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

//Route 1:-Get All the Notes using: GET "api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})
//Route 2:-Add a new Notes using: POST "api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('descrition', 'Descrition must be at least 5 character').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, descrition, tag } = req.body;
        const errors = validationResult(req);
        if (!errors) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, descrition, tag, user: req.user.id
        });
        const savenote = await note.save();
        res.json(savenote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})
//Route 3:-Update an existing Note using: PUT "api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
    const { title, descrition, tag } = req.body;
    //Create a newnote object
    const newnote = {};
    if (title) { newnote.title = title }
    if (descrition) { newnote.descrition = descrition }
    if (tag) { newnote.tag = tag }

    //Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
        res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
        res.status(401).send("Not Allowed");
    }
      note = await Note.findByIdAndUpdate(req.params.id,{$set: newnote},{new:true})  
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

})
//Route 4:-Delete an existing Note using: Delete "api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
    //Find the note to be delete and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
        res.status(404).send("Not Found");
    }
    //Allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
        res.status(401).send("Not Allowed");
    }
      note = await Note.findByIdAndDelete(req.params.id);
        res.json({"Success":"Note has been deleted",note: note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

})
module.exports = router

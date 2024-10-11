const express = require("express");
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const router = express.Router();

//Route 1: Get all the notes : Get  "/api/notes/fetchallnotes". Does not require auth
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

//Route 2: Get all the notes : Get  "/api/notes/addnote". Does not require auth
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "enter a valid name").isLength({ min: 3 }),
    body("description", "Description must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // if there are error then return bad request and errors.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//Route 3: Update an existing note Using : Put  "/api/notes/updatenote". Does not require auth
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // create a new note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    // Find the note be updated  and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not found");
    }
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("not allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//Route 3: Update an existing note Using : Put  "/api/notes/updatenote". Does not require auth
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    
    // Find the note be updated  and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not found");
    }
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("not allowed");
    }

    note = await Note.findByIdAndDelete(
      req.params.id
    );
    res.json({ "Scucess": "Note has been deleted", note: note  });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;

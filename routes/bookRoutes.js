const router = require('express').Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Book = require("../models/bookModel");
const {authenticateToken} = require('../helpers/authHelper');

router.post("/add-book", authenticateToken, async(req, res) => {
    try {
        const {id} = req.headers;
        const user = await User.findById(id);
        if(user.role !== "admin"){
            return res.status(400).json({
                success: false,
                message: "You don't have access to perform admin work"
            })
        }
        const book = new Book({
        url: req.body.url,
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        desc: req.body.desc,
        language: req.body.language,
       });
       await book.save();
       res.status(200).json({
        success: true,
        message: "Book added successfully"
       });
    } catch (error) {
       res.status(500).json({
        success: false,
        message: "Internal server error"
       })
    }
})

router.put("/update-book", authenticateToken, async(req, res) => {
    try {
       const { bookid } = req.headers;
       await Book.findByIdAndUpdate(bookid, {
        url: req.body.url,
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        desc: req.body.desc,
        language: req.body.language,
       });

       return res.status(200).json({
        success: true,
        message: "Book updated successfully"
       });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred"
        })
    }
})

router.delete("/delete-book", authenticateToken, async(req, res) => {
    try {
        const {bookid} = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({
            success: true,
            message: "Book deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred"
        });
    }
})

module.exports = router;
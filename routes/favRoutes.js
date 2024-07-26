const router = require("express").Router();
const User = require("../models/userModel");
const {authenticateToken} = require("../helpers/authHelper");

router.put("/add-book-to-favourite", authenticateToken, async(req, res) => {
    try {
       const {bookid, id} = req.headers;
       const userData = await User.findById(id);
       const isBookFavourite = userData.favourites.includes(bookid);
       if(isBookFavourite){
        return res.json({
            success: false,
            message: "Book is already in favourites"
        })
       }
       await User.findByIdAndUpdate(id,{$push: {favourites: bookid}});
       return res.status(200).json({
        success: true,
        message: "Book added to favourites"
       });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
})

router.put("/remove-book-from-favourite", authenticateToken, async(req, res) => {
    try {
       const {bookid, id} = req.headers;
       const userData = await User.findById(id);
       const isBookFavourite = userData.favourites.includes(bookid);
       if(isBookFavourite){
        await User.findByIdAndUpdate(id,{$pull: {favourites: bookid}});
       }
       
       return res.status(200).json({
        success: true,
        message: "Book removed from favourites"
       });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
})

router.get("/get-favourite-books", authenticateToken, async(req, res) => {
    try {
        const {id} = req.headers;
        const userData = await User.findById(id).populate("favourites");
        const favouriteBooks = userData.favourites;
        return res.json({
            status: "success",
            data: favouriteBooks,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred"
        });
    }
});

module.exports = router;
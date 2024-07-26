const router = require("express").Router();
const User = require("../models/userModel");
const {authenticateToken} = require("../helpers/authHelper");

router.put("/add-to-cart", authenticateToken, async(req, res) => {
    try {
        const {bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isInCart = userData.cart.includes(bookid);
        if(isInCart){
            return res.json({
                success: false,
                message: "Book is already in cart",
            });
        }
        await User.findByIdAndUpdate(id, {
            $push: {cart: bookid},
        });
        return res.json({
            success: true,
            message: "Book added to cart",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred"
        });
    }
});

router.put("/remove-from-cart/:bookid", authenticateToken, async(req, res) => {
    try {
        const {bookid} = req.params;
        const {id} = req.headers;
        await User.findByIdAndUpdate(id, {
            $pull: {cart: bookid},
        });
        return res.status(200).json({
            success: true,
            message: "Book removed from the cart"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred"
        });
    }
});

router.get("/get-user-cart", authenticateToken, async(req, res)=>{
    try {
        const {id} = req.headers;
        const userData = await User.findById(id).populate("cart");
        const cart = userData.cart.reverse();

        return res.json({
            status: "success",
            data: cart
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred"
        });
    }
})

module.exports = router;
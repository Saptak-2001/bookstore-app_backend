const router = require('express').Router();
const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Book = require("../models/bookModel");
const {authenticateToken} = require('../helpers/authHelper');

router.post("/sign-up", async(req, res) => {
    try {
      const {username, email, phone, password, address} = req.body;
      
      if(username.length < 4){
        return res.status(400).json({
            message: "username length should be greater than 3"
        })
      }

      const existingEmail = await User.findOne({email: email});
      if(existingEmail){
        return res.status(400).json({
            success: false,
            message: "email already exists"
        });
      }

      const existingUser = await User.findOne({username: username});
      if(existingUser){
        return res.status(400).json({
            success: false,
            message: "username already exists"
        });
      }

      if(password.length <= 5){
        return res.status(400).json({
            success: false,
            message: "password length should be greater than 5"
        })
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username: username,
        email: email,
        phone: phone,
        password: hashPassword,
        address: address
      });
      await newUser.save();
      return res.status(200).json({success: true, message: "Signup successfully"});
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

router.post("/sign-in", async(req, res) => {
  try {
    const {email, password} = req.body;

    const existingUser = await User.findOne({ email });
    if(!existingUser){
      res.status(400).json({
        success: false,
        message: "Invalid credentials"
      })
    }
    await bcrypt.compare(password, existingUser.password, (err, data) => {
      if(data){
        const authClaims = [
          {name: existingUser.username},
          {role: existingUser.role},
        ];
        const token = jwt.sign({authClaims}, "bookStore225", {expiresIn: "24h"});
        res.status(200).json({
          id: existingUser._id,
          role: existingUser.role,
          token: token
        });
      } else{
        res.status(400).json({
          success: false,
          message: "Invalid Credentials"
        })
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
  })
  }
})

router.get("/get-user-info", authenticateToken, async(req, res) => {

  try {
    const {id} = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
  })
  }
})

router.put("/update-address", authenticateToken, async(req, res) => {
  try {
    const {id} = req.headers;
    const {address} = req.body;
    await User.findByIdAndUpdate(id, {address: address});
    return res.status(200).json({
      success: true,
      message: "Address updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
  })
  }
})

router.get("/get-all-books", async (req, res) => {
  try {
      const books = await Book.find().sort({createdAt: -1});
      return res.json({
          status: "success",
          data: books,
      });
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: "An error occurred"
      });
  }
});

router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({createdAt: -1}).limit(4);
    return res.json({
      status: "success",
      data: books,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred"
    });
  }
});

router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const book = await Book.findById(id);
    return res.json({
      status: "success",
      data: book,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred"
    });
  }
})

module.exports = router;
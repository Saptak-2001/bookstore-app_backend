const express = require('express');
require('dotenv').config();
require('./conn/conn');
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const favRoutes = require("./routes/favRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(cors());

app.use(express.json());

const port = process.env.PORT || 2000;

app.use("/api/auth", authRoutes);
app.use("/api/admin", bookRoutes);
app.use("/api/user", favRoutes);
app.use("/api/user", cartRoutes);
app.use("/api/user", orderRoutes);

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
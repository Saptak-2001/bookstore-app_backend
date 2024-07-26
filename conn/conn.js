const mongoose = require('mongoose');

const connectDB = async () => {
    try {
       await mongoose.connect(`${process.env.MONGO_URL}`);
       console.log("Connected to Database successfully");
    } catch (error) {
        console.log("Error in MongoDb connection");
    }
}

connectDB();
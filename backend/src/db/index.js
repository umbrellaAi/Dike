import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(
            `☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host} [${connectionInstance.connection.db.s.namespace.db}]`
        );
    } catch (error) {
        console.log("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;

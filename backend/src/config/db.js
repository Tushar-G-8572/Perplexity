import mongoose from "mongoose";

export async function connectToDb() {
    try{

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

    }catch(err){

    }
}
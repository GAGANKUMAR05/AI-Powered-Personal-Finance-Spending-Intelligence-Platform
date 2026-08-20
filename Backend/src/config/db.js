import mongoose from "mongoose";


async function connectToDb()
{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("connected to database")
    }catch(err)
    {
        console.log("Database connection falid :",err)
        process.exit(1);
    }
}

export default connectToDb
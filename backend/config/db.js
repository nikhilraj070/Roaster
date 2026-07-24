import mongoose from "mongoose"

export const connectDb =async ()=>{
    try {
        if (!process.env.DB_URL) {
            throw new Error("DB_URL is not defined");
        }
        const connection = await mongoose.connect(process.env.DB_URL)

    } catch (error) {
        console.log(error);
        throw error;
    }
}
  
import mongoose from 'mongoose'

const roastSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    input:{
        type:String,
        required:true,
    },
    weapon:{
        type:String,
         enum: [
        "friendly",
        "savage",
        "brutal",
        "genz",
        "corporate",
        "coding",
        "satire",
        "shakespeare",
        "gamer",
        "study",
        "Sarcastic",
      ],
      default:"friendly",

    },
    roast:{
      type:String,
      required:true,
    },
        isFavorite: {
      type: Boolean,
      default: false,
    },
     intensity: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
      language: {
      type: String,
      enum: ["english", "hinglish", "hindi"],
      default: "english",
    }
},{timestamps:true})

const Roast = mongoose.model('roast',roastSchema);
export default Roast

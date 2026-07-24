import Roast from "../models/roast.model.js";
import { generateRoast } from "../services/gemini.service.js";
import { roastPrompt } from "../prompt/prompt.js";

export const createRoast = async (req, res) => {
  try {
    const { input, weapon, intensity, language } = req.body;

    const prompt = roastPrompt({
      input,
      weapon,
      intensity,
      language,
    });

  
    const roast = await generateRoast(prompt);
    const roastDoc = await Roast.create({
      userId: req.user._id,
      input,
      weapon,
      intensity,
      language,
      roast,
    });

    return res.status(201).json({
      success: true,
      message: "Roast generated successfully.",
      roast: roastDoc,
    });
  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to generate roast.",
    });
  }
};


export const getHistory = async (req, res) => {
  try {
    const history = await Roast.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      history,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch history.",
    });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Roast.find({
      userId: req.user._id,
      isFavorite: true,
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      favorites,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch favorites.",
    });
  }
};

export const updateFavorite = async (req, res) => {
  try {
    const { isFavorite } = req.body;

    const roast = await Roast.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      {
        isFavorite: Boolean(isFavorite),
      },
      {
        returnDocument: "after",
      }
    );

    if (!roast) {
      return res.status(404).json({
        success: false,
        message: "Roast not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: roast.isFavorite
        ? "Roast saved to favorites."
        : "Roast removed from favorites.",
      roast,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update favorite.",
    });
  }
};


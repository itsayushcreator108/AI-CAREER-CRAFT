import Portfolio from "../model/Portfolio.js";

// Create / Save Portfolio
export const createPortfolio = async (req, res) => {
  try {
    // Destructure all fields from form-data body
    const {
      name,
      title,
      email,
      phone,
      location,
      about,
      skills,
      projects,
      education,
      experience,
      github,
      linkedin,
      website,
    } = req.body;

    // Get userId from frontend formData
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ success: false, error: "UserId is required." });
    }

    // Create new portfolio document
    const newPortfolio = new Portfolio({
      userId,
      name,
      title,
      email,
      phone,
      location,
      bio: about,
      skills,
      projects,
      education,
      experience,
      socialLinks: { github, linkedin, website },
      resume: req.file ? req.file.path : null, // store resume file path if uploaded
    });

    await newPortfolio.save();

    res.status(201).json({
      success: true,
      message: "Portfolio saved successfully!",
      data: newPortfolio,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Failed to save portfolio.",
    });
  }
};

// Get All Portfolios of a User
export const getUserPortfolios = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, error: "UserId is required." });
    }

    const portfolios = await Portfolio.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: portfolios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch portfolios." });
  }
};

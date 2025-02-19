import Support from "../models/support-model.js";
import validator from "validator";

const supportController = {};

supportController.contactForm = async (req, res) => {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).send("All fields are required.");
    }
    if (!validator.isEmail(email)) {
        return res.status(400).send("Invalid email format.");
    }

    const newSupportEntry = new Support({
        type: "contact-form",
        name,
        email,
        message,
    });

    try {
        await newSupportEntry.save();
        res.status(200).send("Your contact form has been submitted!");
    } catch (error) {
        res.status(500).json({ message: "Error saving contact form", error: error.message });
    }
};

supportController.faq = async (req, res) => {
    const { question } = req.body;

    // Validate input
    if (!question) {
        return res.status(400).send("FAQ question is required.");
    }

    const newFaqEntry = new Support({
        type: "faq",
        question,
    });

    try {
        await newFaqEntry.save();
        res.status(200).send("Your FAQ question has been submitted!");
    } catch (error) {
        res.status(500).json({ message: "Error saving FAQ question", error: error.message });
    }
};

// Fetch all queries (for admin)
supportController.allQueries = async (req, res) => {
    try {
        const allQueries = await Support.find({});
        res.status(200).json(allQueries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching support data", error: error.message });
    }
};

// Fetch only FAQs (for public display)
supportController.getFaqs = async (req, res) => {
    try {
        const faqs = await Support.find({ type: "faq" });
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching FAQs", error: error.message });
    }
};

export default supportController;

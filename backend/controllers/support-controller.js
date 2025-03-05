import Support from "../models/support-model.js";
import validator from "validator";
import sendEmail from "../utils/emailUtils.js";

const supportController = {};

supportController.contactForm = async (req, res) => {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({message:"All fields are required."});
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json("Invalid email format.");
    }

    const newSupportEntry = new Support({
        employeeId:req.currentUser.id,
        name,
        email,
        message,
        responseMessage:""
    });

    try {
        await newSupportEntry.save();
        res.status(200).json({message:"Your contact form has been submitted!"});
    } catch (error) {
        res.status(500).json({ message: "Error saving contact form", error: error.message });
    }
};


// Fetch all queries (for admin)
supportController.allQueries = async (req, res) => {
    try {
        const unansweredQueries = await Support.find({ responseMessage: "" });
        const answeredQueries = await Support.find({ responseMessage: { $ne: "" } });

        res.status(200).json({ unansweredQueries, answeredQueries });
    } catch (error) {
        res.status(500).json({ message: "Error fetching support data", error: error.message });
    }
};

supportController.respondToQuery = async (req, res) => {
    const { queryId } = req.params;
    const { responseMessage } = req.body;

    if (!responseMessage) {
        return res.status(400).send("Response message is required.");
    }

    try {
        const query = await Support.findById(queryId);
        if (!query) {
            return res.status(404).send("Query not found.");
        }

        query.responseMessage = responseMessage;
        query.responseTime = new Date();

        await sendEmail({
            to: query.email,
            subject: "Support Query Response",
            text: `Hello ${query.name},\n\nYour support query has been answered:\n\n${query.responseMessage}\n\nRegards,\nSupport Team`
        });

        await query.save();
        res.status(200).send("Response submitted successfully.");
    } catch (error) {
        res.status(500).json({ message: "Error responding to query", error: error.message });
    }
};


supportController.getMyQueries = async (req, res) => {
    try {
        const employeeId = req.currentUser.id; // Assuming you have authentication middleware setting req.user

        const myQueries = await Support.find({ employeeId }).sort({ submittedAt: -1 });

        res.status(200).json(myQueries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching your queries", error: error.message });
    }
};

export default supportController;

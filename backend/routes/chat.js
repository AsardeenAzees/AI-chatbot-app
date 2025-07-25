const express = require("express");
const router = express.Router();
const getAIRespose = require("../services/aiService");

router.post("/", async (req, res) => {
    const { message } = req.body;
    
    try {
        const response = await getAIRespose(message);
        res.json({ response });

    } catch (error) {
        res.status(500).json({ error: "Error fetching AI response"})
    }
    
});

module.exports = router;
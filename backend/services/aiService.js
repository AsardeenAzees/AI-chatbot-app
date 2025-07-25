//we use grminiai
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAIResponse(message) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([message]);
    const response = await result.response;
    const text = response.text();

    return text || "No response received.";
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw new Error("Failed to get response from Gemini API.");
  }
}

module.exports = getAIResponse;

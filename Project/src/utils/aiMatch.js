const axios = require("axios");

const matchDocuments = async (documentText, storedDocuments) => {
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        console.error("Error: Google Gemini API key is missing.");
        return [];
    }

    const input = `Find the most similar document from the following dataset:\n\n${storedDocuments.join("\n\n")}\n\nDocument to match:\n${documentText}`;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                contents: [
                    { role: "user", parts: [{ text: input }] }
                ]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        console.log("Gemini API Response:", response.data);

        // Extract response properly
        return response.data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("\n") || "No match found";

    } catch (err) {
        console.error("Gemini API Error:", err.response?.data || err.message);
        return [];
    }
};

module.exports = matchDocuments;
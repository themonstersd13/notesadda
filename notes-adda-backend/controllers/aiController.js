const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.askGemini = async (req, res) => {
    try {
        const { query } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Act as an educational assistant for engineering students. Answer this query concisely: ${query}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ answer: text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "AI Error", error: err.message });
    }
};

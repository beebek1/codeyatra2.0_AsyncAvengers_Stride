import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export async function askGemini(name, question) {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // gemini-pro is deprecated

//     const prompt = `
//   You are a helpful assistant.
//   User name: ${name}
//   Question: ${question}
//   `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;

//     return response.text();
// }

export const askGeminiToMakeTaskAccordingToCarrer = async (req, res) => {
    try {
        const { careerName } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite", // free or lowest‑cost tier
        });

        const prompt = `
Create a career roadmap for ${careerName}.

Return ONLY valid JSON in this format:
Only give main main tasks, up to task5, for each level. Do not give any other text or explanation.
set timeline for each tasks in each level such that all courses must be completed in 6 months. Timeline should be in weeks and should be realistic for a beginner to complete the task.

{
  "levels": [
    {
      "name": "beginner",
      "tasks": ["task1", "task2", "task3", "task4", "task5"],
      "timeline" : [time required for each task to learn]
    },
    {
      "name": "intermediate",
      "tasks": ["task1", "task2", "task3", "task4", "task5"],
      "timeline" : [time required for each task to learn]
    },
    {
      "name": "advanced",
      "tasks": ["task1", "task2", "task3", "task4", "task5"],
      "timeline" : [time required for each task to learn]
    }
  ]
}

No explanation. Only JSON.
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.json({
            success: true,
            roadmap: text,
        });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
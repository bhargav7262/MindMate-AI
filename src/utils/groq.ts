import axios from "axios";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = "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"; // Replace this

export async function getGroqReply(prompt: string) {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama3-70b-8192", // or mixtral-8x7b-32768, gemma-7b-it
        messages: [
          {
            role: "system",
            content: "You are a helpful mental health assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: unknown) {
    console.error("Groq API error:", error);
    return "⚠️ Error generating AI response.";
  }
}

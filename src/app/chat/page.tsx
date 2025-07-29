"use client";
import { useState } from "react";
import { getGroqReply } from "@/utils/groq";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! How can I support your mental health today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const aiReply = await getGroqReply(input);

    setMessages([...newMessages, { role: "assistant", content: aiReply }]);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">AIMed++ Chat</h2>
      <div className="border rounded-md p-3 h-96 overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block px-3 py-2 rounded ${
                msg.role === "user" ? "bg-blue-200" : "bg-green-100"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <div className="italic text-gray-500">AI is typing...</div>}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

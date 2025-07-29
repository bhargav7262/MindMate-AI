"use client";

import { useState, useEffect } from "react";
import { getGroqReply } from "@/utils/groq";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@clerk/nextjs";

export default function JournalPage() {
  const { user } = useUser();
  const [entry, setEntry] = useState("");
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState<{ content: string; created_at: string }[]>([]);
  const [showTimeline, setShowTimeline] = useState(false);
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("journal_entries")
        .select("content, created_at")
        .eq("user_id", user.id.toString()) // 👈 FIXED here
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching entries:", error.message, error);
        setMessage("❌ Failed to load journal entries. Please try again.");
      } else {
        setEntries(data || []);
      }
    };

    fetchEntries();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!entry.trim()) {
      setMessage("📝 Please write something before submitting.");
      return;
    }

    setMessage("🧠 Analyzing your entry with AI...");
    setAiReply("");
    setLoading(true);

    try {
      const feedback = await getGroqReply(`Give feedback on this journal entry: ${entry}`);
      setAiReply(feedback);

      const { error } = await supabase.from("journal_entries").insert([
        {
          user_id: user?.id.toString(), // 👈 FIXED here
          content: entry,
          ai_feedback: feedback,
        },
      ]);

      if (error) throw error;

      setMessage("✅ Journal analyzed and saved!");
      setEntries((prev) => [{ content: entry, created_at: new Date().toISOString() }, ...prev]);
      setEntry("");
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Failed to save journal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-[#0a0a0a] dark:to-[#1a1a1a] p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#121212] shadow-2xl rounded-3xl p-10 space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">🗓️ Daily Journal</h1>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300">
          Reflect on your day, thoughts, or feelings. Write your journal entry below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            rows={6}
            className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-[#1e1e1e] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write about your day..."
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Submit Journal"}
          </button>

          {message && (
            <p
              className={`text-center text-sm ${
                message.startsWith("❌") ? "text-red-500" : "text-green-600 dark:text-green-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        {aiReply && (
          <div className="mt-4 p-4 bg-yellow-100 dark:bg-[#2a2a00] text-gray-800 dark:text-yellow-300 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">🤖 AI Feedback:</h3>
            <p>{aiReply}</p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => setShowTimeline((prev) => !prev)}
            className="mt-4 px-6 py-2 bg-gray-800 dark:bg-gray-200 dark:text-black text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition"
          >
            {showTimeline ? "Hide Timeline" : "View Past Entries"}
          </button>
        </div>

        {showTimeline && (
          <div className="mt-6 space-y-4">
            <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">🕰️ Journal Timeline</h2>
            {entries.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">No entries yet. Start writing!</p>
            ) : (
              <ul className="space-y-3">
                {entries.map((e, idx) => (
                  <li
                    key={idx}
                    className="bg-gray-100 dark:bg-[#1c1c1c] p-4 rounded-lg text-gray-800 dark:text-gray-200"
                  >
                    <div className="font-semibold text-sm text-gray-600 dark:text-gray-400">
                      {new Date(e.created_at).toLocaleString()}
                    </div>
                    <div>{e.content}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

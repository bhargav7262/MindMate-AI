"use client";

import { useEffect, useState } from "react";

interface Entry {
  mood: string;
  note?: string;
}

export default function JournalTimeline() {
  const [weeklyData, setWeeklyData] = useState<Record<string, Entry | null>>({});

  useEffect(() => {
    const data = localStorage.getItem("journalData");
    const parsed = data ? JSON.parse(data) : {};

    const days: Record<string, Entry | null> = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      days[key] = parsed[key] || null;
    }

    setWeeklyData(days);
  }, []);

  return (
    <div className="mt-8 p-4 border rounded-xl shadow max-w-xl">
      <h2 className="text-xl font-semibold mb-4">🗓️ Weekly Mood Timeline</h2>

      <ul className="space-y-3">
        {Object.entries(weeklyData).map(([date, entry]) => (
          <li key={date} className="p-3 border rounded dark:bg-gray-900">
            <div className="font-semibold">{date}</div>
            {entry ? (
              <>
                <div className="text-2xl">{entry.mood}</div>
                {entry.note && (
                  <div className="text-sm text-gray-700 dark:text-gray-300 mt-1 italic">
                    &quot;{entry.note}&quot;
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-500">No entry</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


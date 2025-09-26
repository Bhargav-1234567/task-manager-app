"use client";
import { useState } from "react";
import useAppStore from "@/store/useAppStore";
import { toast } from "sonner";

export default function TaskForm({ projectId, col }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const { addTask, loadProjects } = useAppStore();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await addTask({
      projectId,
      title: title.trim(),
      status: "Todo",
      dueDate: dueDate || null,
    });
    await loadProjects();
    toast("Task Created!");
    setLoading(false);
    setTitle("");
    setDueDate("");
  }

  return (
    <form onSubmit={onSubmit} className="mb-4">
      <div
        className={`flex ${col ? " flex-col" : "flex-row sm:flex-row"}  gap-3`}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          className="flex-1 border text-sm h-[35px] border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border border-gray-300 text-sm h-[35px] rounded px-3 py-2 focus:outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={!title.trim() || loading}
          className="bg-blue-500 text-white text-sm h-[35px] px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </div>
    </form>
  );
}

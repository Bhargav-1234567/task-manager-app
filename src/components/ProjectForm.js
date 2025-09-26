"use client";
import { useState } from "react";
import useAppStore from "@/store/useAppStore";
import { toast } from "sonner";

export default function ProjectForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { addProject } = useAppStore();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name.trim()) return;

    await addProject({
      name: name.trim(),
      description: description.trim(),
    });
    toast("Project Created!");
    setLoading(false);
    setName("");
    setDescription("");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-gray-200 rounded-lg p-4  "
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Create New Project
      </h2>

      <div className="flex flex-col lg:flex-row gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          required
        />

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project description"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={!name.trim() || loading}
          className="bg-green-500 cursor-pointer text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </div>
    </form>
  );
}

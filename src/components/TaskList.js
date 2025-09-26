"use client";
import { useEffect, useState } from "react";
import useAppStore from "@/store/useAppStore";
import { toast } from "sonner";

const STATUS_COLORS = {
  Todo: "bg-gray-100 text-gray-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Done: "bg-green-100 text-green-800",
};

export default function TaskList({ projectId }) {
  const { tasksByProject, loadTasks, updateTask, deleteTask, setTasks } =
    useAppStore();
  const tasks = tasksByProject[projectId] || [];
  const [loadingState, setLoadingState] = useState({
    updateLoading: false,
    deleteLoading: false,
  });
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  useEffect(() => {
    loadTasks(projectId);
  }, [projectId, loadTasks]);

  const handleStatusChange = async (task, newStatus) => {
    const prevStatus = task.status;
    setTasks(projectId, task.id, { status: newStatus });

    try {
      await updateTask({ ...task, status: newStatus });
    } catch (err) {
      console.error("Update failed, rolling back", err);
      setTasks(projectId, task.id, { status: prevStatus });
    }
  };

  const handleDelete = async (taskId) => {
    setDeletingTaskId(taskId);

    // Optimistic remove

    try {
      await deleteTask(projectId, taskId);
      toast("Task Deleted Successfully!");
    } catch (err) {
      // Reload from server if failed (simpler rollback for delete)
      await loadTasks(projectId);
    } finally {
      setDeletingTaskId(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        No tasks yet. Add a task above.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white"
        >
          <div className="flex-1">
            <div className="font-medium text-gray-800 line-clamp-3">
              {t.title}
            </div>
            {t.dueDate && (
              <div className="text-sm text-gray-500">
                Due: {new Date(t.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 ml-4">
            <select
              value={t.status}
              onChange={(e) => handleStatusChange(t, e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {Object.keys(STATUS_COLORS).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                STATUS_COLORS[t.status]
              }`}
            >
              {t.status}
            </span>

            <button
              onClick={() => handleDelete(t.id)}
              disabled={deletingTaskId === t.id}
              className={`text-sm font-medium cursor-pointer ${
                deletingTaskId === t.id
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-600 hover:text-red-800"
              }`}
            >
              {deletingTaskId === t.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

import React from "react";
import { useEffect, useState } from "react";
import useAppStore from "@/store/useAppStore";
import { toast } from "sonner";
import Link from "next/link";

const STATUS_COLORS = {
  Todo: "bg-gray-100 text-gray-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Done: "bg-green-100 text-green-800",
};

const TaskItem = ({ task, projectId }) => {
  const [taskData, setTaskData] = useState(task);
  useEffect(() => {
    setTaskData(task);
  }, [task]);
  const { loadTasks, updateTask, deleteTask, loadProjects } = useAppStore();
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const handleStatusChange = async (taskData, newStatus) => {
    const prevStatus = taskData.status;
    setTaskData({ ...taskData, status: newStatus });
    try {
      await updateTask({ ...taskData, status: newStatus });
      await loadProjects();
    } catch (err) {
      console.error("Update failed, rolling back", err);
      setTaskData(taskData);
    }
  };

  const handleDelete = async (taskId) => {
    setDeletingTaskId(taskId);

    try {
      await deleteTask(projectId, taskId);
      await loadProjects();
      toast("Task Deleted Successfully!");
    } catch (err) {
      await loadTasks(projectId);
    } finally {
      setDeletingTaskId(null);
    }
  };
  return (
    <div
      key={taskData.id}
      className="flex flex-col items-start gap-3 justify-between p-3 border border-gray-200 rounded-lg bg-white"
    >
      <div className="flex-1">
        <div className="font-medium text-gray-800 line-clamp-3">
          {taskData.title}
        </div>
        {taskData.dueDate && (
          <div className="text-sm text-gray-500">
            Due: {new Date(taskData.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 ">
        <select
          value={taskData.status}
          onChange={(e) => handleStatusChange(taskData, e.target.value)}
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
            STATUS_COLORS[taskData.status]
          }`}
        >
          {taskData.status}
        </span>

        <button
          onClick={() => handleDelete(taskData.id)}
          disabled={deletingTaskId === taskData.id}
          className={`text-sm font-medium cursor-pointer ${
            deletingTaskId === taskData.id
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-600 hover:text-red-800"
          }`}
        >
          {deletingTaskId === taskData.id ? "Deleting" : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default TaskItem;

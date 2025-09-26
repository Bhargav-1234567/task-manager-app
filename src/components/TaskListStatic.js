"use client";

import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";

export default function TaskListStatic({ projectId, tasks }) {
  return (
    <div className="space-y-2">
      <TaskForm projectId={projectId} col />
      {tasks.map((task) => (
        <TaskItem task={task} projectId={projectId} key={task.id} />
      ))}
    </div>
  );
}

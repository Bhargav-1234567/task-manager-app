"use client";
import { useEffect, useRef, useState } from "react";
import useAppStore from "@/store/useAppStore";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import Link from "next/link";
import TaskListStatic from "./TaskListStatic";

const ProjectSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm"
        key={index}
      >
        {/* Header skeleton */}
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="flex space-x-2 flex-shrink-0">
            <div className="h-8 bg-gray-200 rounded-lg w-16 animate-pulse"></div>
          </div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
        </div>

        {/* Footer skeleton */}
        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function ProjectList() {
  const { projects, loadProjects, deleteProject, loading } = useAppStore();
  const loadedRef = useRef(false);
  useEffect(() => {
    loadProjects();
    setTimeout(() => {
      loadedRef.current = true;
    }, 2000);
  }, [loadProjects]);

  if (loading.projects && !loadedRef.current) {
    return <ProjectSkeleton />;
  }
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 text-lg">
        No projects found. Create your first project above.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
      {projects.map((p) => (
        <div
          className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
          key={p.id}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800 truncate flex-1 mr-3 line-clamp-3">
              {p.name}
            </h3>
            <div className="flex space-x-2 flex-shrink-0">
              <button
                disabled={loading?.deleteProject}
                onClick={() => deleteProject(p.id)}
                className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 line-clamp-3">
            {p.description}
          </p>

          {p.tasks.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-sm">
              No Tasks found!
            </div>
          )}

          <TaskListStatic projectId={p.id} tasks={p.tasks} />
        </div>
      ))}
    </div>
  );
}

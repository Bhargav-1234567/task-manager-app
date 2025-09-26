import { create } from "zustand";

const useAppStore = create((set, get) => ({
  user: null,
  projects: [],
  tasksByProject: {},

  loading: {
    user: false,
    projects: false,
    tasks: {},
    addProject: false,
    addTask: false,
    updateTask: false,
    deleteTask: false,
    deleteProject: false,
  },

  setLoading: (key, value, projectId = null) =>
    set((s) => {
      if (key === "tasks" && projectId) {
        return {
          loading: {
            ...s.loading,
            tasks: { ...s.loading.tasks, [projectId]: value },
          },
        };
      }
      return { loading: { ...s.loading, [key]: value } };
    }),

  setUser: (user) => set({ user }),

  loadUser: async () => {
    get().setLoading("user", true);
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user });
      } else {
        set({ user: null });
      }
    } finally {
      get().setLoading("user", false);
    }
  },

  loadProjects: async () => {
    get().setLoading("projects", true);
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      set({ projects: data.projects });
    } finally {
      get().setLoading("projects", false);
    }
  },

  addProject: async (payload) => {
    get().setLoading("addProject", true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (res.ok) get().loadProjects();
    } finally {
      get().setLoading("addProject", false);
    }
  },

  deleteProject: async (id) => {
    get().setLoading("deleteProject", true);
    try {
      const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) get().loadProjects();
    } finally {
      get().setLoading("deleteProject", false);
    }
  },

  loadTasks: async (projectId) => {
    get().setLoading("tasks", true, projectId);
    try {
      const url = `/api/tasks?projectId=${encodeURIComponent(projectId)}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      set((s) => ({
        tasksByProject: { ...s.tasksByProject, [projectId]: data.tasks },
      }));
    } finally {
      get().setLoading("tasks", false, projectId);
    }
  },

  addTask: async (task) => {
    get().setLoading("addTask", true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(task),
      });
      if (res.ok) get().loadTasks(task.projectId);
    } finally {
      get().setLoading("addTask", false);
    }
  },

  updateTask: async (task) => {
    get().setLoading("updateTask", true);
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        body: JSON.stringify(task),
      });
      if (res.ok) get().loadTasks(task.projectId);
    } finally {
      get().setLoading("updateTask", false);
    }
  },

  deleteTask: async (projectId, id) => {
    get().setLoading("deleteTask", true);
    try {
      const res = await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) get().loadTasks(projectId);
    } finally {
      get().setLoading("deleteTask", false);
    }
  },

  setTasks: (projectId, taskId, updates) =>
    set((s) => {
      const current = s.tasksByProject[projectId] || [];
      return {
        tasksByProject: {
          ...s.tasksByProject,
          [projectId]: current.map((t) =>
            t.id === taskId ? { ...t, ...updates } : t
          ),
        },
      };
    }),
}));

export default useAppStore;

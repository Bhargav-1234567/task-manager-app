import { requireUser } from "@/lib/auth-helpers";
import { projectsCol, tasksCol } from "@/lib/firestore";

export async function GET() {
  try {
    const user = await requireUser();

    // Step 1: Fetch projects for the user
    const snap = await projectsCol()
      .where("ownerId", "==", user.uid)
      .orderBy("createdAt", "desc")
      .get();

    const projects = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (projects.length === 0) {
      return new Response(JSON.stringify({ projects: [] }), { status: 200 });
    }

    const projectIds = projects.map((p) => p.id);

    const tasksSnap = await tasksCol()
      .where("projectId", "in", projectIds.slice(0, 30))
      .get();

    const tasks = tasksSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const projectsWithTasks = projects.map((project) => ({
      ...project,
      tasks: tasks.filter((t) => t.projectId === project.id),
    }));

    return new Response(JSON.stringify({ projects: projectsWithTasks }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: err.message === "UNAUTHENTICATED" ? 401 : 500,
    });
  }
}

export async function POST(request) {
  try {
    const user = await requireUser();
    const { name, description } = await request.json();
    const doc = await projectsCol().add({
      name,
      description: description || "",
      ownerId: user.uid,
      createdAt: Date.now(),
    });
    return new Response(JSON.stringify({ id: doc.id }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: err.message === "UNAUTHENTICATED" ? 401 : 500,
    });
  }
}

export async function DELETE(request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id)
      return new Response(JSON.stringify({ message: "id required" }), {
        status: 400,
      });

    const ref = projectsCol().doc(id);
    const snap = await ref.get();
    if (!snap.exists)
      return new Response(JSON.stringify({ message: "Project not found" }), {
        status: 404,
      });
    if (snap.data().ownerId !== user.uid)
      return new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });

    await ref.delete();
    return new Response(null, { status: 204 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: err.message === "UNAUTHENTICATED" ? 401 : 500,
    });
  }
}

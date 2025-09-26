import { tasksCol } from "@/lib/firestore";
import { requireUser } from "@/lib/auth-helpers";

export async function GET(request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    if (!projectId)
      return new Response(JSON.stringify({ message: "projectId required" }), {
        status: 400,
      });

    const snap = await tasksCol()
      .where("ownerId", "==", user.uid)
      .where("projectId", "==", projectId)
      .orderBy("createdAt", "desc")
      .get();
    const tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return new Response(JSON.stringify({ tasks }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: err.message === "UNAUTHENTICATED" ? 401 : 500,
    });
  }
}

export async function POST(request) {
  try {
    const user = await requireUser();
    const {
      projectId,
      title,
      status = "Todo",
      dueDate = null,
    } = await request.json();
    if (!projectId || !title)
      return new Response(
        JSON.stringify({ message: "projectId & title required" }),
        { status: 400 }
      );

    const doc = await tasksCol().add({
      projectId,
      title,
      status,
      dueDate,
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

export async function PUT(request) {
  try {
    const user = await requireUser();
    const { id, ...rest } = await request.json();
    if (!id)
      return new Response(JSON.stringify({ message: "id required" }), {
        status: 400,
      });

    // ensure ownership
    const ref = tasksCol().doc(id);
    const snap = await ref.get();
    if (!snap.exists)
      return new Response(JSON.stringify({ message: "Task not found" }), {
        status: 404,
      });
    if (snap.data().ownerId !== user.uid)
      return new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });

    await ref.update({ ...rest });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
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

    const ref = tasksCol().doc(id);
    const snap = await ref.get();
    if (!snap.exists)
      return new Response(JSON.stringify({ message: "Task not found" }), {
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

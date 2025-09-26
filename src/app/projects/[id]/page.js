import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { getCurrentUserFromSession } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }) => {
  await requireUser();

  let projectId = await params;

  return (
    <div>
      <TaskForm projectId={projectId.id} />
      <TaskList projectId={projectId.id} />
    </div>
  );
};
async function requireUser() {
  const user = await getCurrentUserFromSession();

  if (!user) {
    redirect("/login");
  }

  return user;
}
export default page;

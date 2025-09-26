import { redirect } from "next/navigation";
import ProjectList from "@/components/ProjectList";
import ProjectForm from "@/components/ProjectForm";
import { getCurrentUserFromSession } from "@/lib/auth-helpers";

export default async function DashboardPage() {
  const user = await requireUser();
  return (
    <div>
      <h2 className="mb-4">Welcome, {user.displayName}</h2>
      <ProjectForm />
      <ProjectList />
    </div>
  );
}

async function requireUser() {
  const user = await getCurrentUserFromSession();

  if (!user) {
    redirect("/login");
  }

  return user;
}

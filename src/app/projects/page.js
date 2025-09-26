import ProjectList from "@/components/ProjectList";
import { getCurrentUserFromSession } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  await requireUser();
  return (
    <div>
      <h2 className="font-bold text-xl">Projects</h2>
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

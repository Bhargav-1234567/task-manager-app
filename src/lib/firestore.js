import { db } from "@/lib/firebaseAdmin";


export const projectsCol = () => db.collection("projects");
export const tasksCol = () => db.collection("tasks");
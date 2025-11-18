import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  redirect("/dashboard");
}

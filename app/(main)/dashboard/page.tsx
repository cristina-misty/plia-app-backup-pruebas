import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  return (
    <>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      </div>
    </>
  );
}

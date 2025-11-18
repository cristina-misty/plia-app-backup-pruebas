import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface SectionLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export async function SectionLayout({
  children,
  title: sectionTitle,
}: SectionLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{sectionTitle}</h1>
      {children}
    </div>
  );
}

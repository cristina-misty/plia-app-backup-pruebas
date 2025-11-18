import { MainLayout } from "@/components/layouts/main/MainLayout";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}

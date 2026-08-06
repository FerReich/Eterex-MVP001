import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const nombre = session.user.name ?? "Usuario";
  const rol = (session.user as { rol?: string }).rol ?? "PLANIFICADOR";

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <Sidebar nombre={nombre} rol={rol} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

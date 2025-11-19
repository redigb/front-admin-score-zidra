import { Header } from "@/components/my_components/header";
import { SidebarEvaluador } from "@/components/my_components/sidebars/sidebar-evaluador";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-950">
      {/* Sidebar fijo */}
      <SidebarEvaluador />
      {/* Contenedor principal */}
      <div className="flex flex-col flex-1">
        {/* Header fijo */}
        <Header />
        {/* Contenido scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  );
}

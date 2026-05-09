import { AdminSidebar } from "@/components/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0 min-h-screen">
        <main className="flex-1 p-6 md:p-8 pt-16 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}

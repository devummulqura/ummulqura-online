import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-foreground font-sans">
      {children}
      <Toaster richColors position="top-right" />
    </div>
  );
}

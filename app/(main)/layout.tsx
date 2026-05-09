import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import connectToDatabase from "@/lib/db";
import Notification from "@/models/Notification";
import { NotificationTicker } from "@/components/NotificationTicker";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectToDatabase();
  
  const notifications = await Notification.find({ isActive: true })
    .sort({ isPinned: -1, createdAt: -1 })
    .lean();
    
  const serializedNotifications = JSON.parse(JSON.stringify(notifications));

  return (
    <>
      <div className="fixed top-0 w-full z-50 flex flex-col">
        <NotificationTicker notifications={serializedNotifications} />
        <Navbar />
      </div>
      <main className="flex-grow pt-24">
        {children}
      </main>
      <Footer />
    </>
  );
}

"use client";

import { AlertTriangle, Info, CheckCircle2, XCircle, Pin } from "lucide-react";
import { INotification } from "@/lib/types";

export function NotificationTicker({ notifications }: { notifications: INotification[] }) {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="bg-primary/5 dark:bg-primary/10 border-b border-border overflow-hidden flex items-center relative z-50 text-sm">
      <div className="bg-primary text-primary-foreground font-semibold px-4 py-2 shrink-0 z-10 hidden sm:block relative after:absolute after:top-0 after:-right-3 after:border-t-[18px] after:border-b-[18px] after:border-l-[12px] after:border-transparent after:border-l-primary shadow-sm">
        Announcements
      </div>
      <div className="flex-1 overflow-hidden relative">
        {/* We use two sets of the same notifications to create a seamless infinite scroll loop */}
        <div className="animate-marquee whitespace-nowrap py-2 flex items-center gap-12 w-max hover:[animation-play-state:paused]">
          {[...notifications, ...notifications].map((note, index) => (
            <div key={`${note._id}-${index}`} className="flex items-center gap-2">
              {note.isPinned ? (
                <Pin className="w-3.5 h-3.5 text-orange-500 fill-current shrink-0" />
              ) : note.type === 'info' ? (
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              ) : note.type === 'warning' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
              ) : note.type === 'success' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : note.type === 'error' ? (
                <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
              ) : null}
              
              <span className="font-semibold text-foreground">{note.title}:</span>
              <span className="text-muted-foreground pr-8">{note.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

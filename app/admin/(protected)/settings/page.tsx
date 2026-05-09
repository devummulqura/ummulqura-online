"use client";

import { useState, useEffect } from "react";
import { Loader2, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsManagement() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Simulate fetching admin settings
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Password update functionality requires backend implementation");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage institute profile, visuals, and admin account.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-8"
        >
          <div>
            <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2 mb-2">
              <User className="w-6 h-6 text-primary" /> Admin Profile
            </h2>
            <p className="text-muted-foreground text-sm">Update your admin credentials and security settings.</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Admin Email</label>
              <Input 
                value="admin@ummul.edu"
                disabled
                className="bg-gray-50 dark:bg-zinc-950 border-border text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">Contact superadmin to change your primary email.</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-6 pt-6 border-t border-border">
            <h3 className="text-lg font-bold font-heading text-foreground flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" /> Change Password
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Current Password</label>
                <Input type="password" placeholder="••••••••" className="bg-gray-50 dark:bg-zinc-950 border-border" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">New Password</label>
                <Input type="password" placeholder="••••••••" className="bg-gray-50 dark:bg-zinc-950 border-border" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Confirm New Password</label>
                <Input type="password" placeholder="••••••••" className="bg-gray-50 dark:bg-zinc-950 border-border" />
              </div>
            </div>

            <Button type="submit" variant="default" className="bg-zinc-900 dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-gray-200 rounded-xl">
              Update Password
            </Button>
          </form>
        </motion.div>
      )}
    </div>
  );
}

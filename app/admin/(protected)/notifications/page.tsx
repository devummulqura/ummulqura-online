"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Edit, Trash2, Pin, CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INotification } from "@/lib/types";

export default function NotificationsManagement() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    message: "",
    type: "info",
    isPinned: false,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenDialog = (item?: INotification) => {
    if (item) {
      setFormData({
        _id: item._id,
        title: item.title,
        message: item.message,
        type: item.type,
        isPinned: item.isPinned,
        isActive: item.isActive,
      });
    } else {
      setFormData({
        _id: "",
        title: "",
        message: "",
        type: "info",
        isPinned: false,
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.error("Title and message are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = formData._id ? `/api/notifications?id=${formData._id}` : "/api/notifications";
      const method = formData._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Notification ${formData._id ? 'updated' : 'created'} successfully`);
        setIsDialogOpen(false);
        fetchNotifications();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to save notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/notifications?id=${itemToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Notification deleted");
        setNotifications(notifications.filter(i => i._id !== itemToDelete));
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to delete notification");
    } finally {
      setIsSubmitting(false);
      setItemToDelete(null);
    }
  };

  const togglePinStatus = async (id: string, currentPinStatus: boolean) => {
    try {
      const res = await fetch(`/api/notifications?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !currentPinStatus }),
      });
      if (res.ok) fetchNotifications();
    } catch {
      toast.error("Failed to update pin status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">Manage scrolling alerts and announcements.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="rounded-xl bg-primary hover:bg-primary/90 text-white shadow-sm">
          <Plus className="w-5 h-5 mr-2" />
          Add Announcement
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-zinc-950/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium w-16">Pin</th>
                <th className="px-6 py-4 font-medium">Message</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                    <p className="text-muted-foreground">Loading notifications...</p>
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No active notifications.
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {notifications.map((item) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={item._id} 
                      className={`border-b border-border/50 hover:bg-gray-50/80 dark:hover:bg-zinc-800/30 transition-colors group ${item.isPinned ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => togglePinStatus(item._id, item.isPinned)}
                          className={`p-2 rounded-full transition-colors ${item.isPinned ? 'text-orange-500 bg-orange-50 dark:bg-orange-950/30' : 'text-muted-foreground hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
                        >
                          <Pin className={`w-4 h-4 ${item.isPinned ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground mb-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 max-w-md">{item.message}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase flex items-center w-max gap-1.5 ${
                          item.type === 'info' ? 'bg-blue-100 text-blue-700' :
                          item.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                          item.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.type === 'info' && <Info className="w-3.5 h-3.5" />}
                          {item.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5" />}
                          {item.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {item.type === 'error' && <XCircle className="w-3.5 h-3.5" />}
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.isActive ? (
                          <span className="text-emerald-600 text-xs font-semibold">Active</span>
                        ) : (
                          <span className="text-muted-foreground text-xs font-semibold">Inactive</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" onClick={() => handleOpenDialog(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-500" onClick={() => setItemToDelete(item._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-950 border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-foreground">
              {formData._id ? 'Edit Notification' : 'Create Notification'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Title *</label>
              <Input 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Short announcement title"
                className="bg-gray-50 dark:bg-zinc-900 border-border"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-1.5 block">Message *</label>
              <Textarea 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Full announcement text..."
                className="bg-gray-50 dark:bg-zinc-900 border-border resize-none h-24"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-1.5 block">Notification Type</label>
              <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val || "info"})}>
                <SelectTrigger className="bg-gray-50 dark:bg-zinc-900 border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info (Blue)</SelectItem>
                  <SelectItem value="success">Success (Green)</SelectItem>
                  <SelectItem value="warning">Warning (Yellow)</SelectItem>
                  <SelectItem value="error">Error (Red)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-6 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="pinned" 
                  checked={formData.isPinned}
                  onCheckedChange={(c) => setFormData({...formData, isPinned: !!c})}
                />
                <label htmlFor="pinned" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center">
                  <Pin className="w-3.5 h-3.5 mr-1" /> Pin to top
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="active" 
                  checked={formData.isActive}
                  onCheckedChange={(c) => setFormData({...formData, isActive: !!c})}
                />
                <label htmlFor="active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                  Active (Visible)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {formData._id ? 'Save Changes' : 'Publish Notification'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent className="rounded-2xl border-border bg-white dark:bg-zinc-950">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this notification? It will no longer appear on the website ticker.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl border-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, Plus, Edit, Trash2, Image as ImageIcon, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
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
import { INews } from "@/lib/types";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false, loading: () => <div className="h-40 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded-md" /> });
import "react-quill-new/dist/quill.snow.css";

export default function NewsManagement() {
  const [newsList, setNewsList] = useState<INews[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    subtitle: "",
    category: "",
    summary: "",
    content: "",
    tags: "",
    isPublished: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    try {
      const res = await fetch("/api/news?all=true");
      const data = await res.json();
      if (data.success) {
        setNewsList(data.data);
      }
    } catch {
      toast.error("Failed to load news articles");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenDialog = (news?: INews) => {
    if (news) {
      setFormData({
        _id: news._id,
        title: news.title,
        subtitle: news.subtitle || "",
        category: news.category || "",
        summary: news.summary || "",
        content: news.content,
        tags: news.tags ? news.tags.join(", ") : "",
        isPublished: news.isPublished,
      });
      setImagePreview(news.imageUrl || "");
    } else {
      setFormData({
        _id: "",
        title: "",
        subtitle: "",
        category: "",
        summary: "",
        content: "",
        tags: "",
        isPublished: true,
      });
      setImagePreview("");
    }
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Title and content are required");
      return;
    }

    setIsSubmitting(true);
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("subtitle", formData.subtitle);
    submitData.append("category", formData.category);
    submitData.append("summary", formData.summary);
    submitData.append("content", formData.content);
    submitData.append("tags", formData.tags);
    submitData.append("isPublished", String(formData.isPublished));

    if (imageFile) {
      submitData.append("image", imageFile);
    }

    try {
      const url = formData._id ? `/api/news?id=${formData._id}` : "/api/news";
      const method = formData._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: submitData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`News ${formData._id ? 'updated' : 'created'} successfully`);
        setIsDialogOpen(false);
        fetchNews();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to save news article");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!newsToDelete) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/news?id=${newsToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("News article deleted");
        setNewsList(newsList.filter(n => n._id !== newsToDelete));
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to delete news");
    } finally {
      setIsSubmitting(false);
      setNewsToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">News & Events</h1>
          <p className="text-muted-foreground mt-1">Manage articles, events, and announcements.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="rounded-xl bg-primary hover:bg-primary/90 text-white shadow-sm">
          <Plus className="w-5 h-5 mr-2" />
          Add Article
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
                <th className="px-6 py-4 font-medium">Article</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                    <p className="text-muted-foreground">Loading articles...</p>
                  </td>
                </tr>
              ) : newsList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No news articles found. Create one to get started.
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {newsList.map((news) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={news._id}
                      className="border-b border-border/50 hover:bg-gray-50/80 dark:hover:bg-zinc-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-foreground flex items-center gap-4">
                        {news.imageUrl ? (
                          <img src={news.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="truncate max-w-[250px] lg:max-w-[400px]">
                          <p className="font-semibold text-sm truncate">{news.title}</p>
                          <p className="text-xs text-muted-foreground truncate font-normal mt-0.5">{news.summary || news.subtitle || "No summary"}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-zinc-800 rounded-md text-xs font-medium text-muted-foreground">
                          {news.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs font-medium">
                        {format(new Date(news.date || news.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        {news.isPublished ? (
                          <span className="flex items-center text-emerald-600 dark:text-emerald-500 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Published
                          </span>
                        ) : (
                          <span className="flex items-center text-yellow-600 dark:text-yellow-500 text-xs font-semibold">
                            <XCircle className="w-3.5 h-3.5 mr-1" /> Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" onClick={() => handleOpenDialog(news)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-500" onClick={() => setNewsToDelete(news._id)}>
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
      1
      {/* Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="min-w-[80vw] bg-white dark:bg-zinc-950 border-border rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-foreground">
              {formData._id ? 'Edit Article' : 'Create Article'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Article title"
                    className="bg-white dark:bg-zinc-900 border-border"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Subtitle</label>
                  <Input
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Brief subtitle"
                    className="bg-white dark:bg-zinc-900 border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Content *</label>
                  <div className="bg-white dark:bg-zinc-900 rounded-md overflow-hidden border border-border">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(val) => setFormData({ ...formData, content: val })}
                      className="min-h-[250px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Summary / Excerpt</label>
                  <Textarea
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Short summary for the preview card"
                    className="bg-white dark:bg-zinc-900 border-border resize-none h-20"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Featured Image</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-4 text-center bg-gray-50 dark:bg-zinc-900/50 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors relative cursor-pointer group">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {imagePreview ? (
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-xs font-semibold">Click to replace</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-foreground font-medium">Upload Image</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Events, Academics"
                    className="bg-white dark:bg-zinc-900 border-border"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Tags</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Comma separated tags"
                    className="bg-white dark:bg-zinc-900 border-border"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Example: ramadan, fasting, prayer</p>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-border">
                  <Checkbox
                    id="publish"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublished: !!checked })}
                  />
                  <label htmlFor="publish" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    Publish immediately
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {formData._id ? 'Save Changes' : 'Publish Article'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!newsToDelete} onOpenChange={(open) => !open && setNewsToDelete(null)}>
        <AlertDialogContent className="rounded-2xl border-border bg-white dark:bg-zinc-950">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
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

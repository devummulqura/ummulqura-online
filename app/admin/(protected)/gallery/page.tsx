"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Loader2, Plus, Edit, Trash2, Image as ImageIcon, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
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

export default function GalleryManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  // Form State
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    description: "",
    category: "",
    eventName: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      toast.error("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setFormData({
        _id: item._id,
        title: item.title,
        description: item.description || "",
        category: item.category || "",
        eventName: item.eventName || "",
      });
      setImagePreview(item.imageUrl || "");
    } else {
      setFormData({
        _id: "",
        title: "",
        description: "",
        category: "",
        eventName: "",
      });
      setImagePreview("");
    }
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      setImageFile(acceptedFiles[0]);
      setImagePreview(URL.createObjectURL(acceptedFiles[0]));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }
    if (!formData._id && !imageFile) {
      toast.error("Image is required for new entries");
      return;
    }

    setIsSubmitting(true);
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("category", formData.category);
    submitData.append("eventName", formData.eventName);

    if (imageFile) {
      submitData.append("image", imageFile);
    }

    try {
      const url = formData._id ? `/api/gallery?id=${formData._id}` : "/api/gallery";
      const method = formData._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: submitData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Image ${formData._id ? 'updated' : 'uploaded'} successfully`);
        setIsDialogOpen(false);
        fetchGallery();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save gallery item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/gallery?id=${itemToDelete}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Image deleted");
        setItems(items.filter(i => i._id !== itemToDelete));
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete image");
    } finally {
      setIsSubmitting(false);
      setItemToDelete(null);
    }
  };

  const categories = ["All", ...Array.from(new Set(items.map(item => item.category || 'Events')))];
  const filteredItems = filterCategory === "All" ? items : items.filter(item => (item.category || 'Events') === filterCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Gallery</h1>
          <p className="text-muted-foreground mt-1">Manage images and event photos.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white dark:bg-zinc-900 border-border text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Button onClick={() => handleOpenDialog()} className="rounded-xl bg-primary hover:bg-primary/90 text-white shadow-sm">
            <Plus className="w-5 h-5 mr-2" />
            Upload Image
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading gallery...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm">
          <ImageIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No images found.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item._id}
                className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-border"
              >
                <div className="w-full overflow-hidden relative group rounded-xl">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">

                    {/* Text */}
                    <div className="mb-3">
                      <p className="text-white font-semibold truncate">
                        {item.title}
                      </p>
                      <p className="text-emerald-400 text-xs font-medium truncate">
                        {item.category}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1 rounded-lg bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md"
                        onClick={() => handleOpenDialog(item)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 rounded-lg backdrop-blur-md"
                        onClick={() => setItemToDelete(item._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="min-w-[50vw] bg-white dark:bg-zinc-950 border-border rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-foreground">
              {formData._id ? 'Edit Image Details' : 'Upload Image'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[300px]
                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-zinc-900/50'}
                  `}
                >
                  <input {...getInputProps()} />
                  {imagePreview ? (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden group/img shadow-md">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-sm font-semibold">Change Image</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="text-sm font-medium text-foreground">Drag & drop or click to upload</p>
                      <p className="text-xs text-muted-foreground mt-2">Supports JPG, PNG, WEBP</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Image Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Short descriptive title"
                    className="bg-gray-50 dark:bg-zinc-900 border-border"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Campus, Event, Sports"
                    className="bg-gray-50 dark:bg-zinc-900 border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Event Name</label>
                  <Input
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    placeholder="If associated with an event"
                    className="bg-gray-50 dark:bg-zinc-900 border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description or caption"
                    className="bg-gray-50 dark:bg-zinc-900 border-border resize-none h-20"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {formData._id ? 'Save Changes' : 'Upload Image'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent className="rounded-2xl border-border bg-white dark:bg-zinc-950">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? It will be removed from the public gallery permanently.
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

"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, Search, Eye, Trash2, Download, RefreshCw, LayoutGrid, List, Phone, Home, MapPin, Building2, User, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { IBadriyyaMajlis } from "@/lib/types";

export default function BadriyyaMajlisAdminPage() {
  const [registrations, setRegistrations] = useState<IBadriyyaMajlis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedEntry, setSelectedEntry] = useState<IBadriyyaMajlis | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/badriyya-majlis");
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Failed to fetch registrations", error);
      toast.error("Failed to load Badriyya Majlis registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleDelete = async () => {
    if (!entryToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/badriyya-majlis?id=${entryToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Registration deleted successfully");
        setRegistrations(registrations.filter((r) => r._id !== entryToDelete));
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to delete registration");
    } finally {
      setIsDeleting(false);
      setEntryToDelete(null);
    }
  };

  const handleDownloadPhoto = async (photoUrl: string | undefined, name: string) => {
    if (!photoUrl) {
      toast.error("No photo available for this participant");
      return;
    }
    const toastId = toast.loading(`Downloading photo for ${name}...`);
    try {
      const response = await fetch(photoUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileExt = photoUrl.split('.').pop()?.split('?')[0] || 'jpg';
      const cleanName = name.replace(/[^a-zA-Z0-9_\-]/g, '_');
      link.download = `${cleanName}_photo.${fileExt}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Photo downloaded for ${name}`, { id: toastId });
    } catch (err) {
      console.error("Download failed", err);
      window.open(photoUrl, "_blank");
      toast.dismiss(toastId);
    }
  };

  const handleExportCSV = () => {
    if (registrations.length === 0) {
      toast.error("No registrations to export");
      return;
    }

    const csvData = registrations.map((r, index) => ({
      "#": index + 1,
      "Name (പേര്)": r.name,
      "Mobile Phone (മൊബൈൽ നമ്പർ)": r.phone,
      "Age (വയസ്സ്)": r.age,
      "House Name (വീട്ടു പേര്)": r.houseName,
      "Mahallu (മഹല്ല്)": r.mahallu,
      "District (ജില്ല)": r.district,
      "Photo URL": r.photoUrl || "N/A",
      "Registration Date": format(new Date(r.createdAt), "yyyy-MM-dd HH:mm:ss"),
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `badriyya_majlis_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported registrations to CSV");
  };

  const filteredRegistrations = registrations.filter((entry) => {
    const term = searchTerm.toLowerCase();
    return (
      entry.name.toLowerCase().includes(term) ||
      entry.phone.toLowerCase().includes(term) ||
      entry.houseName.toLowerCase().includes(term) ||
      entry.mahallu.toLowerCase().includes(term) ||
      entry.district.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold font-heading text-foreground">Badriyya Majlis</h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
              {registrations.length} Registered
            </span>
          </div>
          <p className="text-muted-foreground mt-1">
            Manage participants and view submitted details for Badriyya Majlis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white dark:bg-zinc-900 border-border rounded-xl"
            />
          </div>

          {/* View switch */}
          <div className="flex items-center bg-white dark:bg-zinc-900 border border-border rounded-xl p-1">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          {/* Refresh */}
          <Button
            variant="outline"
            size="icon"
            onClick={fetchRegistrations}
            className="rounded-xl bg-white dark:bg-zinc-900 border-border"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>

          {/* Export CSV */}
          <Button
            onClick={handleExportCSV}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-16 text-center border border-border">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-3" />
          <p className="text-muted-foreground font-medium">Loading Badriyya Majlis registrations...</p>
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-16 text-center border border-border">
          <p className="text-muted-foreground">No registrations found matching your criteria.</p>
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-zinc-950/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Photo</th>
                  <th className="px-6 py-4 font-medium">Participant Name</th>
                  <th className="px-6 py-4 font-medium">Mobile Phone</th>
                  <th className="px-6 py-4 font-medium">Age</th>
                  <th className="px-6 py-4 font-medium">Mahallu / District</th>
                  <th className="px-6 py-4 font-medium">Registration Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredRegistrations.map((entry) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      key={entry._id}
                      className="border-b border-border/50 hover:bg-gray-50/80 dark:hover:bg-zinc-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        {entry.photoUrl ? (
                          <img
                            src={entry.photoUrl}
                            alt={entry.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20 bg-gray-100 dark:bg-zinc-800 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setSelectedEntry(entry)}
                          />
                        ) : (
                          <div
                            onClick={() => setSelectedEntry(entry)}
                            className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center justify-center text-sm cursor-pointer"
                          >
                            {entry.name.charAt(0)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        <div>{entry.name}</div>
                        <div className="text-xs text-muted-foreground font-normal">{entry.houseName}</div>
                      </td>
                      <td className="px-6 py-4 text-foreground font-medium">
                        {entry.phone}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {entry.age} yrs
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{entry.mahallu}</div>
                        <div className="text-xs text-muted-foreground">{entry.district}</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {format(new Date(entry.createdAt), "MMM dd, yyyy · hh:mm a")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Details"
                            className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/50"
                            onClick={() => setSelectedEntry(entry)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {entry.photoUrl && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Download Photo"
                              className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                              onClick={() => handleDownloadPhoto(entry.photoUrl, entry.name)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Record"
                            className="h-8 w-8 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50"
                            onClick={() => setEntryToDelete(entry._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        /* Grid View */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredRegistrations.map((entry) => (
            <motion.div
              layout
              key={entry._id}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-border shadow-sm hover:border-emerald-500/50 transition-all group flex flex-col items-center text-center relative"
            >
              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3 ring-4 ring-emerald-500/20 shadow-md bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                {entry.photoUrl ? (
                  <img
                    src={entry.photoUrl}
                    alt={entry.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-3xl font-bold text-emerald-600">{entry.name.charAt(0)}</span>
                )}
              </div>

              <h3 className="font-bold text-foreground text-base line-clamp-1">{entry.name}</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{entry.phone}</p>

              <div className="text-xs text-muted-foreground mt-2 space-y-0.5">
                <p>മഹല്ല്: {entry.mahallu}</p>
                <p>ജില്ല: {entry.district}</p>
              </div>

              <div className="flex items-center gap-1.5 mt-4 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl text-xs hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/50 border-border"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <Eye className="w-3.5 h-3.5 mr-1" /> View
                </Button>

                {entry.photoUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs text-emerald-600 border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                    onClick={() => handleDownloadPhoto(entry.photoUrl, entry.name)}
                    title="Download Photo"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> Photo
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 border-border"
                  onClick={() => setEntryToDelete(entry._id)}
                  title="Delete Record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Participant Details Preview Modal */}
      <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
        <DialogContent className="max-w-lg w-[92vw] sm:w-full bg-white dark:bg-zinc-950 border-border rounded-3xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader className="pb-3 border-b border-border/60 pr-8">
            <DialogTitle className="text-xl font-bold font-heading text-foreground">
              Participant Details
            </DialogTitle>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-5 pt-1 w-full overflow-hidden">
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 bg-gradient-to-br from-emerald-50/60 via-gray-50 to-teal-50/40 dark:from-emerald-950/40 dark:via-zinc-900 dark:to-zinc-900 p-4 sm:p-5 rounded-2xl border border-emerald-500/20 shadow-xs w-full overflow-hidden">
                {selectedEntry.photoUrl ? (
                  <div className="relative group shrink-0">
                    <img
                      src={selectedEntry.photoUrl}
                      alt={selectedEntry.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-3 ring-emerald-500/30 shadow-md bg-white dark:bg-zinc-800"
                    />
                    <button
                      onClick={() => handleDownloadPhoto(selectedEntry.photoUrl, selectedEntry.name)}
                      className="absolute bottom-1.5 right-1.5 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg transition-transform hover:scale-105"
                      title="Download Photo"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold text-4xl flex items-center justify-center shadow-md shrink-0">
                    {selectedEntry.name.charAt(0)}
                  </div>
                )}

                <div className="flex-1 space-y-1.5 text-center sm:text-left min-w-0 w-full overflow-hidden">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                    Badriyya Majlis Member
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading break-words">
                    {selectedEntry.name}
                  </h2>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 break-words">
                    {selectedEntry.phone}
                  </p>
                  <p className="text-[11px] text-muted-foreground pt-0.5">
                    Registered: {format(new Date(selectedEntry.createdAt), "MMM dd, yyyy · hh:mm a")}
                  </p>
                </div>
              </div>

              {/* 6 Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full overflow-hidden">
                {/* 1. Name */}
                <div className="bg-gray-50 dark:bg-zinc-900 p-3.5 rounded-2xl border border-border/80 flex items-start gap-3 w-full min-w-0 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider truncate">പേര് / Full Name</p>
                    <p className="text-sm font-bold text-foreground mt-0.5 break-words">{selectedEntry.name}</p>
                  </div>
                </div>

                {/* 2. Phone */}
                <div className="bg-gray-50 dark:bg-zinc-900 p-3.5 rounded-2xl border border-border/80 flex items-start gap-3 w-full min-w-0 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider truncate">മൊബൈൽ നമ്പർ / Phone</p>
                    <p className="text-sm font-bold text-foreground mt-0.5 break-words">{selectedEntry.phone}</p>
                  </div>
                </div>

                {/* 3. Age */}
                <div className="bg-gray-50 dark:bg-zinc-900 p-3.5 rounded-2xl border border-border/80 flex items-start gap-3 w-full min-w-0 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider truncate">വയസ്സ് / Age</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{selectedEntry.age} years</p>
                  </div>
                </div>

                {/* 4. House Name */}
                <div className="bg-gray-50 dark:bg-zinc-900 p-3.5 rounded-2xl border border-border/80 flex items-start gap-3 w-full min-w-0 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Home className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider truncate">വീട്ടു പേര് / House Name</p>
                    <p className="text-sm font-bold text-foreground mt-0.5 break-words">{selectedEntry.houseName}</p>
                  </div>
                </div>

                {/* 5. Mahallu */}
                <div className="bg-gray-50 dark:bg-zinc-900 p-3.5 rounded-2xl border border-border/80 flex items-start gap-3 w-full min-w-0 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider truncate">മഹല്ല് / Mahallu</p>
                    <p className="text-sm font-bold text-foreground mt-0.5 break-words">{selectedEntry.mahallu}</p>
                  </div>
                </div>

                {/* 6. District */}
                <div className="bg-gray-50 dark:bg-zinc-900 p-3.5 rounded-2xl border border-border/80 flex items-start gap-3 w-full min-w-0 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider truncate">ജില്ല / District</p>
                    <p className="text-sm font-bold text-foreground mt-0.5 break-words">{selectedEntry.district}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 w-full border-t border-border/60">
                {selectedEntry.photoUrl ? (
                  <>
                    <Button
                      onClick={() => handleDownloadPhoto(selectedEntry.photoUrl, selectedEntry.name)}
                      className="flex-1 h-11 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                    >
                      <Download className="w-4 h-4 mr-1.5" /> Download Photo
                    </Button>
                    <a
                      href={selectedEntry.photoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full h-11 rounded-xl text-xs sm:text-sm font-semibold border-border">
                        <ExternalLink className="w-4 h-4 mr-1.5" /> Open Full Image
                      </Button>
                    </a>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground italic text-center w-full py-2">
                    No photo uploaded for this participant
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!entryToDelete} onOpenChange={(open) => !open && setEntryToDelete(null)}>
        <AlertDialogContent className="rounded-2xl border-border bg-white dark:bg-zinc-950">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Registration?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this participant record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl border-none"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Record"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

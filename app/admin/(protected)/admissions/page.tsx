"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, Search, Eye, Trash2, Download, Filter } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IStudent } from "@/lib/types";

export default function AdmissionsPage() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchAdmissions() {
      try {
        const res = await fetch("/api/admission");
        const data = await res.json();
        if (data.success) {
          setStudents(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch admissions", error);
        toast.error("Failed to load admissions");
      } finally {
        setLoading(false);
      }
    }
    fetchAdmissions();
  }, []);

  const handleDelete = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admission?id=${studentToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Application deleted successfully");
        setStudents(students.filter(s => s._id !== studentToDelete));
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to delete application");
    } finally {
      setIsDeleting(false);
      setStudentToDelete(null);
    }
  };

  const handleExportCSV = () => {
    const csvData = students.map(s => ({
      'Student Name': s.studentName,
      'Parent Name': s.parentName,
      'Email': s.email,
      'Phone': s.phone,
      'Course': s.course,
      'Gender': s.gender,
      'DOB': format(new Date(s.dob), 'yyyy-MM-dd'),
      'Address': s.address,
      'Status': s.status || 'Pending',
      'Applied Date': format(new Date(s.createdAt), 'yyyy-MM-dd HH:mm:ss')
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `admissions_${format(new Date(), 'yyyyMMdd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported to CSV");
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.phone.includes(searchTerm);
    const matchesFilter = filterStatus === "All" || (student.status || 'Pending') === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Admissions</h1>
          <p className="text-muted-foreground mt-1">Manage, review, and export student applications.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white dark:bg-zinc-900 border-border rounded-xl"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" className="w-full sm:w-auto rounded-xl bg-white dark:bg-zinc-900 border-border">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  {filterStatus}
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              <DropdownMenuItem onClick={() => setFilterStatus("All")}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Pending")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Approved")}>Approved</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Rejected")}>Rejected</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleExportCSV} variant="default" className="w-full sm:w-auto rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
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
                <th className="px-6 py-4 font-medium">Student Name</th>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Date Applied</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                    <p className="text-muted-foreground">Loading applications...</p>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredStudents.map((student) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      key={student._id} 
                      className="border-b border-border/50 hover:bg-gray-50/80 dark:hover:bg-zinc-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                        {student.photoUrl ? (
                          <img src={student.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover bg-gray-100" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {student.studentName.charAt(0)}
                          </div>
                        )}
                        {student.studentName}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{student.course}</td>
                      <td className="px-6 py-4 text-muted-foreground">{format(new Date(student.createdAt), 'MMM dd, yyyy')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                          (student.status || 'Pending') === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500' :
                          student.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500'
                        }`}>
                          {student.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" onClick={() => setSelectedStudent(student)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-500" onClick={() => setStudentToDelete(student._id)}>
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

      {/* Preview Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-zinc-950 border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading text-foreground">Application Preview</DialogTitle>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-6 mt-2">
              <div className="flex flex-col md:flex-row items-start gap-6 bg-gray-50 dark:bg-zinc-900 p-6 rounded-xl border border-border">
                {selectedStudent.photoUrl ? (
                  <img src={selectedStudent.photoUrl} alt="Student" className="w-32 h-32 rounded-xl object-cover shadow-sm ring-1 ring-border" />
                ) : (
                  <div className="w-32 h-32 rounded-xl bg-gray-100 dark:bg-zinc-800 ring-1 ring-border flex items-center justify-center text-muted-foreground text-xs text-center font-medium">
                    No Photo Provided
                  </div>
                )}
                
                <div className="flex-1 grid grid-cols-2 gap-y-4 gap-x-6 w-full">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Student Name</p>
                    <p className="font-medium text-foreground mt-1">{selectedStudent.studentName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Course Applied</p>
                    <p className="font-medium text-foreground mt-1">{selectedStudent.course}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Date of Birth</p>
                    <p className="font-medium text-foreground mt-1">{format(new Date(selectedStudent.dob), 'MMMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Gender</p>
                    <p className="font-medium text-foreground mt-1">{selectedStudent.gender}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-5 gap-x-6 border-t border-border pt-6">
                 <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Parent / Guardian</p>
                    <p className="font-medium text-foreground mt-1">{selectedStudent.parentName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Contact Phone</p>
                    <p className="font-medium text-foreground mt-1">{selectedStudent.phone}</p>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Email Address</p>
                    <p className="font-medium text-foreground mt-1">{selectedStudent.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Residential Address</p>
                    <p className="font-medium text-foreground mt-1 leading-relaxed">{selectedStudent.address}</p>
                  </div>
                  {selectedStudent.notes && (
                    <div className="col-span-2 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                      <p className="text-xs text-yellow-800 dark:text-yellow-600 uppercase tracking-wider font-semibold">Additional Notes</p>
                      <p className="text-sm mt-1 text-yellow-900 dark:text-yellow-500/80 leading-relaxed">{selectedStudent.notes}</p>
                    </div>
                  )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!studentToDelete} onOpenChange={(open) => !open && setStudentToDelete(null)}>
        <AlertDialogContent className="rounded-2xl border-border bg-white dark:bg-zinc-950">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student&apos;s admission application and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl border-none"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Application"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

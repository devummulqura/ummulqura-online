"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, UploadCloud, User, Phone, Home, MapPin, Hash, Building2, X, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, "പേര് നൽകുക (Please enter name)."),
  phone: z.string().min(10, "സാധുവായ മൊബൈൽ നമ്പർ നൽകുക (Valid phone number required)."),
  age: z.string().min(1, "വയസ്സ് നൽകുക (Age required).").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "സാധുവായ വയസ്സ് നൽകുക."),
  houseName: z.string().min(2, "വീട്ടു പേര് നൽകുക (House name required)."),
  mahallu: z.string().min(2, "മഹല്ല് നൽകുക (Mahallu required)."),
  district: z.string().min(1, "ജില്ല നൽകുക (District required)."),
});

export default function BadriyyaMajlisPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      age: "",
      houseName: "",
      mahallu: "",
      district: "",
    },
  });

  const handlePhotoSelect = (file: File | null) => {
    if (!file) {
      setPhoto(null);
      setPhotoPreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("ഇമേജ് ഫയൽ തിരഞ്ഞെടുക്കുക", { description: "Please upload an image file (JPG, PNG, WebP)." });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("ഫയൽ വലുപ്പം കൂടുതലാണ്", { description: "Maximum image file size is 10MB." });
      return;
    }

    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone", values.phone);
      formData.append("age", values.age);
      formData.append("houseName", values.houseName);
      formData.append("mahallu", values.mahallu);
      formData.append("district", values.district);
      
      if (photo) {
        formData.append("photo", photo);
      }

      const response = await fetch("/api/badriyya-majlis", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit registration");
      }

      toast.success("രജിസ്ട്രേഷൻ വിജയകരമായി പൂർത്തിയായി!", {
        description: `ബദ്‌രിയ്യ മജ്‌ലിസിലേക്ക് സ്വാഗതം, ${values.name}!`,
      });

      form.reset();
      setPhoto(null);
      setPhotoPreview(null);
    } catch (err) {
      const error = err as { message?: string };
      toast.error("രജിസ്ട്രേഷൻ പരാജയപ്പെട്ടു", {
        description: error.message || "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 lg:py-20 max-w-3xl">
      {/* Compact Banner Header (Website Matched Color) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 px-6 py-4 sm:px-8 sm:py-5 text-center shadow-xl border border-emerald-500/30 mb-6"
      >
        {/* Glow Effects */}
        <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-emerald-500/25 blur-2xl pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 h-36 w-36 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-0.5 sm:space-y-1">
          <p className="text-emerald-100 font-bold text-base sm:text-xl md:text-2xl tracking-wide drop-shadow-md">
            ഉമ്മുൽ ഖുറ പടിഞ്ഞാറത്തറ - വയനാട്
          </p>
          <h1 className="text-amber-300 font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight leading-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] font-heading">
            ബദ്‌രിയ്യത് മജ്‌ലിസ്
          </h1>
          <p className="text-emerald-50/90 font-medium text-xs sm:text-base md:text-lg tracking-wide pt-0.5">
            സ്ഥിരം അംഗമാവാൻ ഉള്ള മെമ്പർഷിപ്പ് ഫോം
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-white dark:bg-zinc-900/90 shadow-2xl rounded-3xl p-6 sm:p-10 border border-border/80 backdrop-blur-xl relative overflow-hidden"
      >
        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative">

            {/* Field 1: Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground">
                    പേര് / Full Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="പൂർണ്ണമായ പേര് നൽകുക"
                        {...field}
                        className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-950/70 border-border text-base focus-visible:ring-emerald-500"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grid for Phone and Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Field 2: Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">
                      മൊബൈൽ നമ്പർ / Mobile Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="tel"
                          placeholder="10 അക്ക മൊബൈൽ നമ്പർ"
                          {...field}
                          className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-950/70 border-border text-base focus-visible:ring-emerald-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Field 3: Age */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">
                      വയസ്സ് / Age <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Hash className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="വയസ്സ് നൽകുക"
                          {...field}
                          className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-950/70 border-border text-base focus-visible:ring-emerald-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Field 4: House Name */}
            <FormField
              control={form.control}
              name="houseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground">
                    വീട്ടു പേര് / House Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Home className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="വീട്ടു പേര് നൽകുക"
                        {...field}
                        className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-950/70 border-border text-base focus-visible:ring-emerald-500"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grid for Mahallu and District */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Field 5: Mahallu */}
              <FormField
                control={form.control}
                name="mahallu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">
                      മഹല്ല് / Mahallu <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="മഹല്ലിന്റെ പേര്"
                          {...field}
                          className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-950/70 border-border text-base focus-visible:ring-emerald-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Field 6: District */}
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">
                      ജില്ല / District <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="ജില്ല നൽകുക"
                          {...field}
                          className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-950/70 border-border text-base focus-visible:ring-emerald-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Field 7: Photo Upload Area (MOVED TO LAST) */}
            <div className="space-y-3 pt-2">
              <label className="text-sm font-semibold text-foreground flex items-center justify-between">
                <span>ഫോട്ടോ / Photo <span className="text-muted-foreground font-normal">(Optional)</span></span>
                <span className="text-xs text-muted-foreground">JPG, PNG, WebP (Max 10MB)</span>
              </label>

              {photoPreview ? (
                <div className="relative flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-zinc-950/50 rounded-2xl border border-emerald-500/30">
                  <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-lg ring-4 ring-emerald-500/20 mb-3">
                    <img
                      src={photoPreview}
                      alt="Selected preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs font-medium text-foreground truncate max-w-[240px] mb-2">
                    {photo?.name}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePhotoSelect(null)}
                    className="rounded-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900/30"
                  >
                    <X className="w-3.5 h-3.5 mr-1" /> Remove Photo
                  </Button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handlePhotoSelect(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer transition-all duration-200 rounded-2xl border-2 border-dashed p-6 text-center flex flex-col items-center justify-center gap-2 ${
                    isDragOver
                      ? "border-emerald-500 bg-emerald-500/10 scale-[1.01]"
                      : "border-border hover:border-emerald-500/50 hover:bg-gray-50 dark:hover:bg-zinc-950/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhotoSelect(e.target.files?.[0] || null)}
                  />
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക / Upload Photo
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Click to upload profile photo
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 text-base font-semibold rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  രജിസ്റ്റർ ചെയ്യുന്നു...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  രജിസ്റ്റർ ചെയ്യുക / Register
                </>
              )}
            </Button>

          </form>
        </Form>
      </motion.div>
    </div>
  );
}

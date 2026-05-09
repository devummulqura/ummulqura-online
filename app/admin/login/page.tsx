"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  rememberMe: z.boolean().default(false).optional(),
});

export default function AdminLogin() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to login");
      }

      toast.success("Login Successful");
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error("Login Failed", { description: error.message });
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute inset-0 bg-islamic-pattern opacity-[0.03] dark:opacity-10"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[100px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/20 blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-card bg-white/80 dark:bg-zinc-900/80 p-8 rounded-3xl shadow-2xl border border-white/40 dark:border-white/10 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-700 text-white rounded-2xl flex items-center justify-center font-heading font-bold text-3xl mx-auto mb-5 shadow-lg shadow-primary/30">
              U
            </div>
            <h1 className="text-3xl font-bold font-heading text-foreground mb-1">Admin Portal</h1>
            <p className="text-muted-foreground text-sm">Secure access to Ummul Institute CMS</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="Admin Email" 
                          type="email"
                          {...field} 
                          className="pl-11 h-12 bg-white/60 dark:bg-black/50 border-gray-200 dark:border-zinc-800 focus-visible:ring-primary/50 rounded-xl" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="ml-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="Password" 
                          type={showPassword ? "text" : "password"}
                          {...field} 
                          className="pl-11 pr-11 h-12 bg-white/60 dark:bg-black/50 border-gray-200 dark:border-zinc-800 focus-visible:ring-primary/50 rounded-xl" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="ml-1" />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between mt-2">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground cursor-pointer">
                          Remember me
                        </label>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Link href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-md rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white shadow-md shadow-primary/20 transition-all mt-6" 
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}

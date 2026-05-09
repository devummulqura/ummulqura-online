"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80 max-w-2xl mx-auto"
          >
            Have questions? We're here to help. Reach out to us through any of the following channels.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-border"
            >
              <h2 className="text-2xl font-bold font-heading mb-8">Get in Touch</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Address</h3>
                    <p className="text-muted-foreground">{siteConfig.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Phone</h3>
                    <p className="text-muted-foreground">{siteConfig.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Email</h3>
                    <p className="text-muted-foreground">{siteConfig.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Working Hours</h3>
                    <p className="text-muted-foreground">Mon - Fri: 8:00 AM - 4:00 PM</p>
                    <p className="text-muted-foreground">Saturday: 9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-border h-full"
            >
              <h2 className="text-2xl font-bold font-heading mb-8">Send us a Message</h2>
              
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Name</label>
                  <Input placeholder="John Doe" className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email Address</label>
                  <Input type="email" placeholder="john@example.com" className="bg-muted/50" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold">Subject</label>
                  <Input placeholder="Inquiry about Admission" className="bg-muted/50" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold">Message</label>
                  <Textarea placeholder="How can we help you?" className="bg-muted/50 h-40 resize-none" />
                </div>
                <div className="md:col-span-2 pt-4">
                  <Button className="w-full md:w-auto px-12 h-14 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                    <Send className="w-5 h-5 mr-2" /> Send Message
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

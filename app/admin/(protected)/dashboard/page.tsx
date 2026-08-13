"use client";

import { useState, useEffect } from "react";
import { Users, Newspaper, Image as ImageIcon, BellRing, Calendar as CalendarIcon, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import Link from "next/link";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";

const data = [
  { name: 'Jan', admissions: 40 },
  { name: 'Feb', admissions: 30 },
  { name: 'Mar', admissions: 45 },
  { name: 'Apr', admissions: 50 },
  { name: 'May', admissions: 65 },
  { name: 'Jun', admissions: 85 },
  { name: 'Jul', admissions: 120 },
];

const activities = [
  { id: 1, type: "admission", title: "New Admission Received", desc: "Ahmad Abdullah applied for Islamic Studies.", time: "10 minutes ago" },
  { id: 2, type: "news", title: "News Published", desc: "Annual Convocation 2026 published by Admin.", time: "2 hours ago" },
  { id: 3, type: "gallery", title: "Gallery Updated", desc: "5 new images added to 'Ramadan Events'.", time: "5 hours ago" },
  { id: 4, type: "notification", title: "Notification Pinned", desc: "Admission deadline extended.", time: "1 day ago" },
];

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { title: "Total Admissions", value: "256", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12%" },
    { title: "News Articles", value: "48", icon: Newspaper, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+3%" },
    { title: "Gallery Images", value: "189", icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-500/10", trend: "+24%" },
    { title: "Notifications", value: "12", icon: BellRing, color: "text-orange-500", bg: "bg-orange-500/10", trend: "-2%" },
  ];

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back, here&apos;s what&apos;s happening at Ummul Institute.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl shadow-sm border border-border">
          <CalendarIcon className="w-4 h-4" />
          {format(new Date(), 'MMMM d, yyyy')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-border flex items-center justify-between group hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold font-heading text-foreground mt-1">{stat.value}</h3>
              </div>
            </div>
            <div className={`text-xs font-semibold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {stat.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-heading text-foreground">Admissions Overview</h2>
            <select className="bg-gray-50 dark:bg-zinc-950 border border-border text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option>Last 7 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full min-w-0 min-h-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-zinc-800" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} className="text-muted-foreground" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#10b981', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="admissions" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAdmissions)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Quick Actions & Activities */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-border"
          >
            <h2 className="text-xl font-bold font-heading text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/news">
                <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center gap-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all">
                  <Newspaper className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-medium">Add News</span>
                </Button>
              </Link>
              <Link href="/admin/gallery">
                <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center gap-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all">
                  <ImageIcon className="w-5 h-5 text-purple-500" />
                  <span className="text-xs font-medium">Upload Image</span>
                </Button>
              </Link>
              <Link href="/admin/notifications">
                <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center gap-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all">
                  <BellRing className="w-5 h-5 text-orange-500" />
                  <span className="text-xs font-medium">Notify</span>
                </Button>
              </Link>
              <Link href="/admin/admissions">
                <Button variant="outline" className="w-full h-auto py-3 flex flex-col items-center gap-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-medium">Review</span>
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-heading text-foreground">Recent Activity</h2>
              <button className="text-xs text-primary font-medium flex items-center hover:underline">
                View all <ArrowUpRight className="w-3 h-3 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="mt-1">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                      activity.type === 'admission' ? 'bg-blue-500' :
                      activity.type === 'news' ? 'bg-emerald-500' :
                      activity.type === 'gallery' ? 'bg-purple-500' : 'bg-orange-500'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.desc}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1 font-medium">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

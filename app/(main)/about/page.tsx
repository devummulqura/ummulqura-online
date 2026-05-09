"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen pt-10">
      {/* Hero Section */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6"
          >
            About Ummul Institute
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
          >
            A legacy of excellence in Islamic education, nurturing the leaders of tomorrow with knowledge, wisdom, and character.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&q=80" 
                alt="Our History" 
                className="rounded-3xl shadow-xl w-full h-[400px] object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary">Our History</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Established over 15 years ago, Ummul Islamic Institute began with a simple vision: to provide a sanctuary of learning where traditional Islamic sciences meet modern educational needs. What started as a small madrasa has now grown into a premier institution recognized for its academic rigor and spiritual nurturing.
              </p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Throughout the years, thousands of students have walked through our doors, memorized the Holy Quran, and acquired deep understanding of Deen, going on to serve communities worldwide.
              </p>
            </motion.div>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-10 rounded-3xl"
            >
              <h3 className="text-2xl font-bold font-heading text-primary mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be a globally recognized center of excellence for Islamic learning that produces well-rounded scholars, professionals, and leaders who positively impact society while upholding the values of Islam.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card p-10 rounded-3xl"
            >
              <h3 className="text-2xl font-bold font-heading text-primary mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To impart authentic Islamic knowledge based on the Quran and Sunnah, fostering spiritual growth, intellectual development, and moral excellence in every student in a nurturing and modern environment.
              </p>
            </motion.div>
          </div>

          {/* Values */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary mb-6">Core Values</h2>
            <p className="text-muted-foreground text-lg mb-10">We believe in education that transforms the heart and mind.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {[
                "Taqwa (God-consciousness)",
                "Ikhlas (Sincerity)",
                "Adab (Excellent Manners)",
                "Ilm (Beneficial Knowledge)",
                "Hikmah (Wisdom)",
                "Ummah (Community Spirit)"
              ].map((value, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <CheckCircle2 className="text-accent w-6 h-6 shrink-0" />
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Award, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/15 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/image1.jpeg")' }}
        />

        <div className="container mx-auto px-4 relative z-20 text-center text-white mt-16  rounded-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight"
          >
            <div className="mt-10">
              <span className="text-accent mt-10">Ummul Qura</span>
            </div>

            <div className="-mt-4 md:-mt-6">
              <span className=" text-2xl md:text-5xl  ">The Strength of Education</span>
            </div>          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-white/90"
          >
            Empowering the next generation with authentic Islamic knowledge and modern academic excellence. Nurturing minds, building character.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/admission">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto h-14 px-8 text-lg rounded-full">
                Apply for Admission
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-transparent">
                Explore Institute
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Decorative pattern bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
          <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.85,116.4,200.5,108.73,243.64,104.38,284.14,84.14,321.39,56.44Z" className="fill-background"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background relative z-30 -mt-20">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
            {[
              { icon: Users, label: "Students", value: "1,200+" },
              { icon: BookOpen, label: "Courses", value: "25+" },
              { icon: Award, label: "Awards", value: "50+" },
              { icon: Calendar, label: "Years Exp", value: "15+" },
            ].map((stat, index) => (
              <div key={index} className="text-center px-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold font-heading text-foreground mb-1">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 rounded-3xl transform rotate-3 z-0"></div>
                <img
                  src="/image2.jpeg"
                  className="rounded-3xl shadow-2xl relative z-10 w-full h-[500px] object-cover"
                />
                <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-2xl z-20">
                  <p className="text-4xl font-bold text-primary font-heading mb-1">10+</p>
                  <p className="text-sm font-medium text-muted-foreground">Years of Excellence</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 space-y-6"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground font-semibold text-sm mb-2">
                About Our Institute
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground leading-tight">
                Nurturing Character Through <span className="text-primary">Islamic Values</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ummul Islamic Institute is dedicated to providing a comprehensive education that seamlessly blends authentic Islamic teachings with modern academic excellence. Our mission is to raise a generation of confident, knowledgeable, and morally upright individuals.
              </p>

              <ul className="space-y-4 pt-4">
                {[
                  "Comprehensive Hifz and Alim programs",
                  "Modern science and technology curriculum",
                  "Dedicated and qualified teaching staff",
                  "State-of-the-art facilities and library"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                    </div>
                    <span className="font-medium text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6">
                <Link href="/about">
                  <Button className="rounded-full px-8 h-12 group">
                    Read More About Us
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0"></div>
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-white/90">
              Admissions are now open for the upcoming academic year. Join us in shaping a bright future.
            </p>
            <Link href="/admission">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-10 text-lg rounded-full shadow-xl">
                Apply Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

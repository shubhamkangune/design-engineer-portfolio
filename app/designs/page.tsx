"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import PracticeCard from "@/components/PracticeCard";

interface Design {
  _id?: string;
  id: string;
  title: string;
  description: string;
  software: string[];
  image: string;
  category: string;
  details?: string;
}

interface PracticeModel {
  _id?: string;
  id: string;
  name: string;
  image: string;
  viewer?: string;
  download?: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function Designs() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [practiceModels, setPracticeModels] = useState<PracticeModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [designsRes, practiceRes] = await Promise.all([
          fetch("/api/designs"),
          fetch("/api/practice-models"),
        ]);
        const designsData = await designsRes.json();
        const practiceData = await practiceRes.json();
        setDesigns(Array.isArray(designsData) ? designsData : []);
        setPracticeModels(Array.isArray(practiceData) ? practiceData : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setDesigns([]);
        setPracticeModels([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-secondary/30 relative">
        <div className="container px-4 md:px-6 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary mb-6 tracking-tighter">
              DESIGN WORK
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A comprehensive showcase of mechanical design projects and CAD
              work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Designs Grid */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container px-4 md:px-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : designs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No designs found.</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {designs.map((design) => (
                <motion.div
                  key={design.id}
                  variants={fadeInUp}
                  data-testid={`design-card-${design.id}`}
                >
                  <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                    {/* Design Image */}
                    <div className="h-56 overflow-hidden relative bg-secondary">
                      <img
                        src={design.image}
                        alt={design.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="font-medium">
                          {design.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Card Header */}
                    <CardHeader>
                      <CardTitle className="font-heading font-bold text-xl line-clamp-2">
                        {design.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {design.description}
                      </CardDescription>
                    </CardHeader>

                    {/* Software Tags */}
                    <div className="px-6 pb-2 flex flex-wrap gap-2">
                      {design.software.map((tool, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>

                    {/* Card Content */}
                    <CardContent className="flex-grow">
                      {design.details && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {design.details}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Practice CAD Models */}
              {practiceModels.map((model) => (
                <motion.div
                  key={model.id}
                  variants={fadeInUp}
                  data-testid={`practice-card-${model.id}`}
                >
                  <PracticeCard model={model} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Add More Designs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <p className="text-muted-foreground text-lg">
              More designs coming soon. Check back for updates on new projects
              and portfolio expansions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border text-center text-muted-foreground text-sm">
        <div className="container">
          <p>© 2025 Shubham Kangune. All rights reserved.</p>
          <p className="mt-2">Designed & Developed by Shubham Kangune.</p>
        </div>
      </footer>
    </div>
  );
}

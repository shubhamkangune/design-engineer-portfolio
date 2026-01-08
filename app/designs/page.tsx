"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import useSWR from "swr";
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
  tools?: string[];
  order?: number;
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
      staggerChildren: 0.1,
    },
  },
};

// Increased batch sizes for faster perceived loading
const INITIAL_COUNT = 50; // Show more items initially
const LOAD_INCREMENT = 20; // Load more at once when scrolling

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Blur placeholder for design images
const shimmer = `data:image/svg+xml;base64,${Buffer.from(
  `<svg width="400" height="224" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="224" fill="#e5e7eb"/></svg>`
).toString("base64")}`;

export default function Designs() {
  // SWR for client-side caching with instant re-renders
  const { data: designs = [], isLoading: designsLoading } = useSWR<Design[]>(
    "/api/designs",
    fetcher,
    { 
      revalidateOnFocus: false, 
      dedupingInterval: 300000, // 5 minutes cache
      keepPreviousData: true // Keep showing old data while revalidating
    }
  );

  const { data: practiceModels = [], isLoading: modelsLoading } = useSWR<
    PracticeModel[]
  >("/api/practice-models", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes cache
    keepPreviousData: true // Keep showing old data while revalidating
  });

  const loading = designsLoading || modelsLoading;
  const [displayCount, setDisplayCount] = useState(INITIAL_COUNT);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDisplayCount((prev) => {
      if (!practiceModels.length) return INITIAL_COUNT;
      return Math.min(Math.max(prev, INITIAL_COUNT), practiceModels.length);
    });
  }, [practiceModels.length]);

  useEffect(() => {
    if (loading) return;
    const sentinel = loadMoreRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayCount((prev) =>
            Math.min(prev + LOAD_INCREMENT, practiceModels.length)
          );
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, practiceModels.length]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="pt-20">
        <section className="py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="max-w-2xl mb-12">
              <p className="text-primary font-semibold">Portfolio & Practice</p>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mt-2">
                Design projects and CAD practice models
              </h1>
              <p className="text-muted-foreground mt-4">
                A growing collection of professional designs and hands-on
                practice models, automatically loading as you explore.
              </p>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted h-56 rounded-t-lg" />
                    <div className="bg-card p-6 rounded-b-lg border border-border">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : designs.length === 0 && practiceModels.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  No designs found.
                </p>
              </div>
            ) : (
              <>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {designs.map((design, idx) => {
                    const isBase64 = design.image?.startsWith("data:");
                    const isPriority = idx < 3; // First 3 images load immediately

                    return (
                      <motion.div
                        key={design.id}
                        variants={fadeInUp}
                        data-testid={`design-card-${design.id}`}
                      >
                        <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                          <div className="h-56 overflow-hidden relative bg-secondary">
                            {isBase64 ? (
                              <img
                                src={design.image}
                                alt={design.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading={isPriority ? "eager" : "lazy"}
                              />
                            ) : (
                              <Image
                                src={design.image}
                                alt={design.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                placeholder="blur"
                                blurDataURL={shimmer}
                                priority={isPriority}
                              />
                            )}
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-4 right-4">
                              <Badge variant="secondary" className="font-medium">
                                {design.category}
                              </Badge>
                            </div>
                          </div>

                          <CardHeader>
                            <CardTitle className="font-heading font-bold text-xl line-clamp-2">
                              {design.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {design.description}
                            </CardDescription>
                          </CardHeader>

                          <div className="px-6 pb-2 flex flex-wrap gap-2">
                            {design.software.map((tool, toolIdx) => (
                              <Badge
                                key={toolIdx}
                                variant="outline"
                                className="text-xs font-normal"
                              >
                                {tool}
                              </Badge>
                            ))}
                          </div>

                          <CardContent className="flex-grow">
                            {design.details && (
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {design.details}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}

                  {practiceModels.slice(0, displayCount).map((model, idx) => (
                    <motion.div
                      key={model.id}
                      variants={fadeInUp}
                      data-testid={`practice-card-${model.id}`}
                    >
                      <PracticeCard
                        model={model}
                        priority={designs.length + idx < 6}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {!loading && practiceModels.length > displayCount && (
                  <div ref={loadMoreRef} className="h-10" aria-hidden />
                )}
              </>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 text-center"
            >
              <p className="text-muted-foreground text-lg">
                More designs coming soon. Check back for updates on new
                projects and portfolio expansions.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-background border-t border-border text-center text-muted-foreground text-sm">
        <div className="container">
          <p>(c) 2025 Shubham Kangune. All rights reserved.</p>
          <p className="mt-2">Designed & Developed by Shubham Kangune.</p>
        </div>
      </footer>
    </div>
  );
}
